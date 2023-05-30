const passport = require("passport");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");
const Otp = require("../models/otp");
const generateRandomNumber = (min, max) => Math.random() * (max - min) + min;
const crypto = require("crypto");
const sendEmail = require("../utils/sendemail");
const jwt = require("jsonwebtoken");
const Store = require("../models/stores");
const User = require("../models/user");
const authKeys = require("../middleware/authKeys");
const nodemailer = require("nodemailer");

const Superadmin = require("../models/superadmin");
const stores = require("../models/stores");
const { Workers } = require("../models/Worker.model");


/***************** CREATE TRANSPORTER INSTANCE ***************/
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "noreply@louoj.com",
    pass: "ondrjieeiullmazx",
  },
});

/***************** FORGOT PASSWORD CONTROLLER ***************/
/***************** URL :  ***************/
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email address not provided" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email address not found" });
    }

    const now = new Date();
    const lastSent = user.otpSentAt;
    if (lastSent && now - lastSent < 30 * 1000) {
      return res.status(429).json({
        message: "OTP already sent, please try again after 30 seconds",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // store OTP and sent time in user data
    user.otp = otp;
    user.otpSentAt = now;
    await user.save();

    const mailOptions = {
      from: "noreply@louoj.com",
      to: email,
      subject: "Forgot Password - OTP",
      text: `Your OTP for resetting your password is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }

      console.log(`OTP sent to ${email}: ${otp}`);
      return res.status(200).json({ message: "OTP sent to email" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


/***************** RESET PASSWORD CONTROLLER ***************/
/***************** URL :  ***************/
exports.resetPasswordd = async (req, res) => {
  const { otp, password } = req.body;

  if (!otp || !password) {
    return res.status(400).json({ message: "Missing required parameters" });
  }

  try {
    const user = await User.findOne({ otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const now = new Date();
    const otpSentAt = user.otpSentAt;
    if (!otpSentAt || now - otpSentAt > 5 * 60 * 1000) {
      return res.status(400).json({ message: "OTP expired or not sent" });
    }

    // reset user password and clear OTP data
    user.password = password;
    user.otp = undefined;
    user.otpSentAt = undefined;
    await user.save();

    const mailOptions = {
      from: "noreply@louoj.com",
      to: user.email,
      subject: "Password Reset Successfully",
      text: "Your password has been reset successfully.",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Password reset email sent to ${user.email}`);
      }
    });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

/***************** RESEND OTP CONTROLLER ***************/
/***************** URL :  ***************/
exports.resendOTP = async (req, res) => {
  const { email } = req.body;

  // check if email is provided
  if (!email) {
    return res.status(400).json({ message: "Email address not provided" });
  }

  try {
    // find user by email in database
    const user = await User.findOne({ email });

    // if user is not found, return error response
    if (!user) {
      return res.status(400).json({ message: "Email address not found" });
    }

    // check if OTP was sent in last 30 seconds
    const now = new Date();
    const lastSent = user.otpSentAt;
    if (lastSent && now - lastSent < 30 * 1000) {
      return res.status(429).json({
        message: "OTP already sent, please try again after 30 seconds",
      });
    }

    // generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // store OTP and sent time in user data
    user.otp = otp;
    user.otpSentAt = now;
    await user.save();

    // create email message with OTP
    const mailOptions = {
      from: "noreply@louoj.com",
      to: email,
      subject: "Forgot Password - OTP",
      text: `Your OTP for resetting your password is: ${otp}`,
    };

    // send email with OTP
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send OTP email" });
      }

      console.log(`OTP sent to ${email}: ${otp}`);
      return res.status(200).json({ message: "OTP sent to email" });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};


/***************** CHECK EMAIL AND SEND OTP TO MAIL ***************/
/***************** URL :  ***************/
exports.checkemail = async (req, res) => {
  try {
    console.log("chala");
    const { email, role } = req.body;
    var user = await Store.findOne({ email });
    if (user) {
      res.status(400).send({ message: "email is already registered." });
      return;
    }
    let check_Otp = await Otp.findOne({ email });
    if (check_Otp) {
      await check_Otp.delete();
    }
    const otp_key = generateRandomNumber(1111, 9999).toFixed(0);

    const create_opt = await new Otp({
      email: email,
      otp_key: bcrypt.hashSync(otp_key, bcrypt.genSaltSync(10)),
    }).save();
    var templates = "signup-verify";
    var replacements = {
      code: otp_key,
    };

    await sendEmail(email, "OTP EMAIL VERIFY", res, templates, replacements);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

/***************** SIGNUP CONTROLLER ***************/
/***************** URL :  ***************/
exports.signUp = async (req, res, next) => {
  try {
    let data = await req?.body;
    const { otp_key, email, storeType } = await req?.body;
    var check = await Store.findOne({ email });
    if (check) {
      res.status(400).send({ message: "email is already registered." });
      return;
    }
    if (otp_key) {
      if (email) {
        let check_email = await Otp.findOne({ email });
        if (check_email) {
          const otpCreated = new Date(check_email.created).getTime();
          const now = new Date().getTime();
          const diff = now - otpCreated;
          if (diff > 2400000) {
            await check_email.delete();
            return res
              .status(403)
              .send({ status: 403, message: "Sign Up Time expired" });
          }
          const check_otp = bcrypt.compareSync(otp_key, check_email.otp_key);
          if (!check_otp) {
            return res.status(400).send({ status: 400, message: "Wrong OTP" });
          }
          if (check_email.used) {
            return res
              .status(400)
              .send({ status: 400, message: "This otp is used" });
          }
          if (storeType) {
            let latestStore = await Store.findOne({ storeType }).sort({
              storeNumber: -1,
            });
            let storeNumber = 100;
            if (latestStore) {
              storeNumber = Number(latestStore.storeNumber.substring(1)) + 1;
            }
            let prefix = "";
            if (storeType === "Designer") {
              prefix = "D";
            } else if (storeType === "Fabric") {
              prefix = "B";
            } else if (storeType === "Factory") {
              prefix = "C";
            } else {
              prefix = "A";
            }
            let store = new Store({
              ...data,
              storeNumber: prefix + storeNumber,
            });
            store
              .save()
              .then(async () => {
                let user = new User({
                  ...data,
                  role: "admin",
                  storeId: store?._id,
                  storeNumber: store?.storeNumber,
                });
                user
                  .save()
                  .then(async () => {
                    const token = await new Token({
                      userId: await user?._id,
                      token: crypto.randomBytes(32).toString("hex"),
                    }).save();
                    var replacements = {
                      ...user.toObject(),
                    };
                    console.log("dfdsf => ", replacements);
                    var templates = "store-created-email";
                    await sendEmail(
                      data?.email,
                      "Account and Store Created",
                      res,
                      templates,
                      replacements
                    );
                    // res.status(200).send({ user });
                  })
                  .catch((err) => res.status(500).send({ message: err }));
              })
              .catch((err) => res.status(500).send({ message: err }));
          } else {
            return res
              .status(400)
              .send({ status: 400, message: "Store Type is required." });
          }
        } else {
          res.status(404).send({ message: "Otp not found" });
          return;
        }
      }
    } else {
      res.status(404).send({ message: "Please Provide otp" });
      return;
    }
  } catch (error) {
    res.status(400).send({ message: error });
    return;
  }
};

/***************** URL :  ***************/
exports.getAllStores = async (req, res, next) => {
  try {
    const storeType = req.params.storeType;
    let stores = [];
    if (storeType) {
      stores = await Store.find({ storeType });
    } else {
      stores = await Store.find();
    }
    res.status(200).send(stores);
  } catch (error) {
    res.status(400).send({ message: error });
  }
};


/////////////////////////////////////////////////////////
/***************** URL :  ***************/
exports.getStoreByTypeAndNumber = async (req, res) => {
  try {
    const { storeType, storeNumber } = req.params;
    const store = await Store.findOne({ storeType, storeNumber });
    if (!store) {
      return res.status(404).send({ message: "Store not found" });
    }
    res.send({ store });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/////////////////////////////////////////////////////////


///////////////////deleteStoreApi///////////////////////////
/***************** URL :  ***************/
exports.deleteStore = async (req, res, next) => {
  try {
    const { storeNumber } = req.params;
    const store = await Store.findOne({ storeNumber });
    if (!store) {
      return res.status(404).send({ message: "Store not found." });
    }
    await User.deleteMany({ storeId: store._id });
    await Token.deleteMany({ userId: { $in: store.admins } });
    await Store.deleteOne({ _id: store._id });
    return res.status(200).send({ message: "Store deleted successfully." });
  } catch (error) {
    res.status(400).send({ message: error });
    return;
  }
};



//////////////loginApi for all tailor fabric stylist etc/////////////
/***************** URL :  ***************/
// exports.logIn = (req, res, next) => {
//   passport.authenticate(
//     "local",
//     { session: false },
//     async function (err, user, info) {
//       if (err) {
//         return next(err);
//       }
//       if (!user) {
//         return res.status(400).send({ message: info.message });
//       }

//       const { email, storeNumber, role, storeType } = req?.body;

//       if (role == "admin" || role == "superadmin") {

//         const userFromDB = await User.findOne({ email });

//         // // For Super Admin Login
//         // if (userFromDB.role === "superadmin" && !storeNumber && !role) {
//         //   if (userFromDB.email !== email) {
//         //     return res.status(400).send({ message: "Invalid Credentials" });
//         //   }
//         // }

//         if (role === "admin") {
//           if (!userFromDB) {
//             return res.status(400).json({ success: false, message: "Invalid Credentials" });
//           }

//           if (userFromDB.email !== email) {
//             return res.status(400).json({ success: false, message: "Invalid Credentials" });
//           }

//           if (userFromDB.storeNumber !== storeNumber || userFromDB.role !== role || userFromDB.storeType !== storeType) {
//             return res.status(400).json({ success: false, message: "Invalid Credentials" });
//           }
//           const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
//           return res.status(200).json({
//             token: token,
//             user: userFromDB,
//           });
//         }
//       }
//       else {
//         // Check if the role is one of the specified roles
//         const isWorkerRole =
//           role === "manager" ||
//           role === "sales" ||
//           role === "cutter" ||
//           role === "master tailor" ||
//           role === "stitching" ||
//           role === "QC" ||
//           role === "delivery";

//         if (isWorkerRole) {
//           const workerFromDB = await Workers.findOne({ email, storeNumber });

//           if (!workerFromDB) {
//             return res.status(400).json({ success: false, message: "Invalid Credentials" });
//           }

//           if (workerFromDB.email !== email || workerFromDB.storeNumber !== storeNumber || workerFromDB.storeType !== storeType) {
//             return res.status(400).json({ success: false, message: "Invalid Credentials" });
//           }

//           // Generate a separate token for the worker
//           const workerToken = jwt.sign({ _id: workerFromDB._id }, authKeys.jwtSecretKey);

//           // Customize the response for worker authentication
//           return res.status(200).json({
//             token: workerToken,
//             worker: workerFromDB,
//           });
//         }
//       }

//       // TODO: Update the device token for the logged-in user
//       // userFromDB.deviceToken = deviceToken;
//       // await userFromDB.save();


//       //  else if (userFromDB.role === "superadmin") {
//       //   return res.status(200).json({
//       //     token: token,
//       //     message: "You are Logged in as Super Admin",
//       //   });
//       // }
//     }
//   )(req, res, next);
// };


exports.logIn = (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).send({ message: info.message });
      }

      const { email, storeNumber, role, storeType } = req?.body;

      if (role == "admin" || role == "superadmin") {
        const userFromDB = await User.findOne({ email });

        if (role === "admin") {
          if (!userFromDB || userFromDB.email !== email || userFromDB.storeNumber !== storeNumber || userFromDB.role !== role || userFromDB.storeType !== storeType) {
            return res.status(400).json({ success: false, message: "Invalid Credentials" });
          }

          const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
          return res.status(200).json({
            token: token,
            user: userFromDB,
          });
        }
      }
      else if (role === "manager" || role === "sales" || role === "cutter" || role === "master tailor" || role === "stitching" || role === "QC" || role === "delivery") {
        const workerFromDB = await Workers.findOne({ email, storeNumber });

        if (!workerFromDB || workerFromDB.email !== email || workerFromDB.storeNumber !== storeNumber || workerFromDB.role !== role || workerFromDB.storeType !== storeType) {
          return res.status(400).json({ success: false, message: "Invalid Credentials" });
        }

        const workerToken = jwt.sign({ _id: workerFromDB._id }, authKeys.jwtSecretKey);

        return res.status(200).json({
          token: workerToken,
          worker: workerFromDB,
        });
      }
      else {
        return res.status(400).json({ success: false, message: "Invalid Credentials" });
      }
    }
  )(req, res, next);
};






const secretKey = "Mukul@123";

/***************** URL :  ***************/
exports.superadminController = async (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required." });
  }

  try {
    // Check if the username exists and password is correct
    const superadmin = await Superadmin.findOne({ username, password });

    // If username and password are not found, send an "Invalid credentials" response
    if (!superadmin) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Generate a JWT token with a 1-hour expiration
    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });

    // Send the token as a response
    res.send({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: "Internal server error." });
  }
};

/////////////////////sendOtpStore/////////////////////////////////
/***************** URL :  ***************/
exports.sendOTP = async (req, res) => {
  const { number, type, email } = await req.body;
  //   if (email && number) {
  //     return res.status(401).send({ msg: "verify by either email or number" });
  //   }
  if (email) {
    let check_Otp = await Otp.findOne({ email });
    if (check_Otp) {
      await check_Otp.delete();
    }
    let check_number = await Store.findOne({ email });
    const client = require("twilio")(accountSid, authToken);

    if (check_number) {
      const otp_key = generateRandomNumber(1111, 9999).toFixed(0);
      const create_opt = await new Otp({
        email: email,
        otp_key: bcrypt.hashSync(otp_key, bcrypt.genSaltSync(10)),
      }).save();
      var replacements = {
        code: otp_key,
      };
      var templates = "forget-password";
      await sendEmail(
        email,
        "CHEF ZONE REQUESTED OTP",
        res,
        templates,
        replacements
      );
    } else {
      return res.status(404).send({ message: "User Not Found" });
    }
  }
  else {
    return res.status(401).send({ msg: "Email is required!" });
  }
};

/////////////////////////////////////////////////////////////

////////////////////////////////getOtpStore/////////////////////
/***************** URL :  ***************/
exports.getOTP = async (req, res) => {
  const { otp_key, number, email } = await req.body;
  //   if (email && number) {
  //     return res.status(401).send({ msg: "verify by either email or number" });
  //   }
  if (email) {
    let check_email = await Otp.findOne({ email });

    if (check_email) {
      const otpCreated = new Date(check_email.created).getTime();
      const now = new Date().getTime();
      const diff = now - otpCreated;
      if (diff > 300000) {
        return res.status(403).send({ status: 403, message: "OTP expire" });
      }
      const check_otp = bcrypt.compareSync(otp_key, check_email.otp_key);
      if (!check_otp) {
        return res.status(400).send({ status: 400, message: "Wrong OTP" });
      }
      return res.status(200).send({ status: 200, message: "OTP confirmed" });
      // res.send({ user: check_number });
    } else {
      res.send({ message: "number Not Found" });
    }
  }
};

////////////////////////////////////////////////////////////////

////////////////////////////////otpPasswordStore//////////////////////
/***************** URL :  ***************/
exports.otpPassword = async (req, res) => {
  const { otp_key, number, type, password, email } = await req.body;
  if (email) {
    let check_email = await Otp.findOne({ email });

    if (check_email) {
      const otpCreated = new Date(check_email.created).getTime();
      const now = new Date().getTime();
      const diff = now - otpCreated;
      if (diff > 1200000) {
        await check_email.delete();
        return res
          .status(403)
          .send({ status: 403, message: "Sign Up Time expired" });
      }
      const check_otp = bcrypt.compareSync(otp_key, check_email.otp_key);
      if (!check_otp) {
        return res.status(400).send({ status: 400, message: "Wrong OTP" });
      }
      if (check_email.used) {
        return res
          .status(400)
          .send({ status: 400, message: "This otp is used" });
      }
      var user = await Store.findOne({ email });

      user.password = password;

      await user.save();
      await check_email.delete();
      return res
        .status(200)
        .send({ status: 200, message: "Password updated successfully" });
      // res.send({ user: check_number });
    } else {
      res.send({ message: "otp Not Found" });
    }
  }
};

//////////////////////////////////////////////////////////////////////
