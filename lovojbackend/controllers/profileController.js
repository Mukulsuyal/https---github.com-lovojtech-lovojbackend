const Fabrics = require("../models/fabric");
const User = require("../models/user");
const PersonalDet = require("../models/personalDet");
const { uploadObject } = require("../libs/putObject");
const uploadToS3 = require("../utils/s3Upload");
const deleteFromS3 = require("../utils/deleteFroms3");
const stores = require("../models/stores");

///////////////ADD PERSONAL DETAILS////////////
/***************** URL :  ***************/
// exports.personalDetail = async (req, res) => {
//   try {
//     //User ID
//     const user = req.user._id;

//     //Request Body
//     let { address, whatsapp, telegram, line } = req.body;

//     let addressProof1Url = null;
//     let addressProof2Url = null;
//     let addressProof3Url = null;

//     // Check if addressProof1 file is provided
//     if (req.files.addressProof1 && req.files.addressProof1.length > 0) {
//       const addressProof1obj = req.files.addressProof1[0];
//       addressProof1Url = await uploadToS3(addressProof1obj);
//     }

//     // Check if addressProof2 file is provided
//     if (req.files.addressProof2 && req.files.addressProof2.length > 0) {
//       const addressProof2obj = req.files.addressProof2[0];
//       addressProof2Url = await uploadToS3(addressProof2obj);
//     }

//     // Check if addressProof3 file is provided
//     if (req.files.addressProof3 && req.files.addressProof3.length > 0) {
//       const addressProof3obj = req.files.addressProof3[0];
//       addressProof3Url = await uploadToS3(addressProof3obj);
//     }

//     //Insert Data
//     const personalDetails = await PersonalDet.create({
//       user,
//       address,
//       whatsapp,
//       telegram,
//       line,
//       addressProof1: addressProof1Url,
//       addressProof2: addressProof2Url,
//       addressProof3: addressProof3Url,
//     });

//     return res.status(201).json({
//       success: true,
//       personalDetails,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send({ message: err.message });
//     A;
//   }
// };

//////////////GET PERSONAL DETAILS///////////



exports.personalDetail = async (req, res) => {
  try {
    // User ID
    const user = req.user._id;

    // Request Body
    let { address, whatsapp, telegram, line } = req.body;

    let addressProof1Url = null;
    let addressProof2Url = null;
    let addressProof3Url = null;

    // Check if personal details already exist for the user
    const existingDetails = await PersonalDet.findOne({ user });

    if (existingDetails) {
      return res.status(400).json({
        success: false,
        message: "Personal details already exist for this user.",
      });
    }

    // Check if addressProof1 file is provided
    if (req.files.addressProof1 && req.files.addressProof1.length > 0) {
      const addressProof1obj = req.files.addressProof1[0];
      addressProof1Url = await uploadToS3(addressProof1obj);
    }

    // Check if addressProof2 file is provided
    if (req.files.addressProof2 && req.files.addressProof2.length > 0) {
      const addressProof2obj = req.files.addressProof2[0];
      addressProof2Url = await uploadToS3(addressProof2obj);
    }

    // Check if addressProof3 file is provided
    if (req.files.addressProof3 && req.files.addressProof3.length > 0) {
      const addressProof3obj = req.files.addressProof3[0];
      addressProof3Url = await uploadToS3(addressProof3obj);
    }

    // // Check if personal details already exist for the user
    // const existingDetails = await PersonalDet.findOne({ user });

    // if (existingDetails) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Personal details already exist for this user.",
    //   });
    // }

    // Insert Data
    const personalDetails = await PersonalDet.create({
      user,
      address,
      whatsapp,
      telegram,
      line,
      addressProof1: addressProof1Url,
      addressProof2: addressProof2Url,
      addressProof3: addressProof3Url,
    });

    return res.status(201).json({
      success: true,
      personalDetails,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: err.message });
  }
};




/***************** URL :  ***************/
exports.getPersonalDetails = async (req, res) => {
  try {
    const personalDetails = await PersonalDet.findOne({ user: req.user._id })
      .populate("user", "name email mobileNumber");
    return res.status(201).json({
      success: true,
      personalDetails,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

///////////////UPDATE PERSONAL DETAILS/////////////////////
/***************** URL :  ***************/
exports.updatepersonalDlt = async (req, res) => {
  try {
    const { name, mobilenumber, whatsapp } = req.body;

    // Find the personal details by user ID
    const personalDetails = await PersonalDet.findOne({ user: req.user._id })
    const user = await User.findById(req.user._id)
    const storefromdb = await stores.findById(req.user.storeId)

    // Update the fields that were sent in the request body
    if (name) {
      storefromdb.name = name
      user.name = name;
    }
    if (mobilenumber) {
      user.mobileNumber = mobilenumber;
    }
    if (whatsapp) personalDetails.whatsapp = whatsapp;

    // Update addressProof1 file if provided
    if (req.files && req.files.addressProof1 && req.files.addressProof1[0]) {
      const file = req.files.addressProof1[0];
      const imageUrl = await uploadToS3(file);

      // Delete existing addressProof1 file from the store if it exists
      if (personalDetails.addressProof1) {
        await deleteFromS3(personalDetails.addressProof1);
      }

      personalDetails.addressProof1 = imageUrl;
    }

    // Update addressProof2 file if provided
    if (req.files && req.files.addressProof2 && req.files.addressProof2[0]) {
      const file = req.files.addressProof2[0];
      const imageUrl = await uploadToS3(file);

      // Delete existing addressProof2 file from the store if it exists
      if (personalDetails.addressProof2) {
        await deleteFromS3(personalDetails.addressProof2);
      }

      personalDetails.addressProof2 = imageUrl;
    }

    // Update addressProof3 file if provided
    if (req.files && req.files.addressProof3 && req.files.addressProof3[0]) {
      const file = req.files.addressProof3[0];
      const imageUrl = await uploadToS3(file);

      // Delete existing addressProof3 file from the store if it exists
      if (personalDetails.addressProof3) {
        await deleteFromS3(personalDetails.addressProof3);
      }

      personalDetails.addressProof3 = imageUrl;
    }

    await personalDetails.save();
    await user.save();
    await storefromdb.save();

    res.status(200).json({
      success: true,
      message: "Personal Details Updated Successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/************************************BusinessDetails ***********************************/


