const Fabrics = require("../models/fabric");
const Store = require("../models/stores");
const User = require("../models/user");
const uploadToS3 = require("../utils/s3Upload");
const Cart = require("../models/cart");
const deleteFromS3 = require("../utils/deleteFroms3");

/***************** ADD FABRIC ***************/
/***************** URL : {{LOCAL_URL}}/fabric/addFabric ***************/
exports.addFabric = async (req, res) => {
  try {
    const user = req.user;
    const { storeId } = user;
    const data  = req.body;
    const fileObj = req.file;

    const store = await Store.findById(storeId);

    const fileUrl = await uploadToS3(fileObj);

    const fabric = await Fabrics.create({
      ...data,
      storeNumber: store.storeNumber,
      fabImage: fileUrl,
    });

    return res.status(200).json({
      success: true,
      message: "Fabric added successfully to the database.",
      fabric,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


/***************** GET FABRIC ***************/
/***************** URL : {{LOCAL_URL}}/fabric/getfabric ***************/
exports.getFabric = async (req, res) => {
  try {
    let fabrics = await Fabrics.find({});
    res.status(200).json({
      success: true,
      count: fabrics.length,
      fabrics,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/***************** GET FABRIC BY STORE NUMBER ***************/
/***************** URL : {{LOCAL_URL}}/fabric/getfabrics/D100 ***************/
exports.getFabricByStoreNumber = async (req, res) => {
  try {
    const { storeNumber } = req.params;
    const fabrics = await Fabrics.find({ storeNumber });
    if (!fabrics) {
      return res
      .status(404)
      .send({ message: "No fabrics found for this store number" });
    }
    res.send({ fabrics });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/***************** GET FABRIC BY STORE NUMBER AND FAV NUMBER ***************/
/***************** URL : {{LOCAL_URL}}/fabric/D100/100007 ***************/
exports.getFabricByStoreAndNumber = async (req, res) => {
  try {
    const { storeNumber, fabNumber } = req.params;
    const fabric = await Fabrics.findOne({ storeNumber, fabNumber });
    if (!fabric) {
      return res.status(404).json({ message: "Fabric not found" });
    }
    res.send({ fabric });
  } catch (error) {
    res.status(500).json({success:false, message: error.message });
  }
};


/***************** UPDATE FABRIC ***************/
/***************** URL : {{LOCAL_URL}}/fabric/updatefab/:id ***************/
exports.updateFabric = async (req, res) => {
  try {
    const fabricCollection = await Fabrics.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!fabricCollection) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found",
      });
    }
    
    if (req.file) {
      const fileObj = req.file;
      const fileUrl = await uploadToS3(fileObj);
      await deleteFromS3(fabricCollection.fabImage);
      fabricCollection.fabImage = fileUrl;
    }
    
    await fabricCollection.save();
    
    res.status(200).json({
      success: true,
      message: "Fabric updated successfully",
      updates: fabricCollection,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


/***************** GET FABRIC BY ID ***************/
  /***************** URL : {{LOCAL_URL}}/fabric/getfabric/:id ***************/
exports.getFab = async (req, res) => {
  try {
    const fabricId = req.params.id;
    const fabric = await Fabrics.findById(fabricId);

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fabric found successfully",
      fabric,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


/***************** DELETE FABRIC ***************/
/***************** URL : {{LOCAL_URL}}/fabric/deletefab/:id ***************/
exports.deleteFabric = async (req, res) => {
  try {
    const fabricId = req.params.id;
    const deletedFabric = await Fabrics.findByIdAndDelete(fabricId);
    await deleteFromS3(deletedFabric.fabImage)
    
    if (!deletedFabric) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Fabric deleted successfully",
      deletedFabric: deletedFabric,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


/***************** ADD TO CART ***************/
/***************** URL :  ***************/
exports.addToCart = async (req, res) => {
  try {
    const user = req.user;
    const fabric = await Fabrics.findOne({ fabNumber: req.body.fabNumber });

    if (!fabric) {
      return res.status(404).json({
        success: false,
        message: "Fabric not found.",
      });
    }

    // Update fabric collection with price and quantity
    const quantity = req.body.quantity || 1;
    let price = fabric.fabricPrice || 0;

    // Update price if provided
    if (req.body.fabricPrice) {
      price = req.body.fabricPrice;
    }

    // Calculate total price
    const totalPrice = price * quantity;

    const updatedFabric = await Fabrics.findOneAndUpdate(
      { fabNumber: fabric.fabNumber },
      { fabricQuantity: quantity, fabricPrice: price, totalPrice: totalPrice },
      {
        new: true,
        select:
          "fabNumber fabName fabImage fabricPrice fabricQuantity totalPrice",
      }
    );

    // Add data to cart collection
    const cartData = {
      user: user._id,
      fabric: fabric._id,
      quantity: quantity,
      price: price,
      totalPrice: totalPrice,
    };

    const cart = await Cart.findOne({ user: user._id });

    if (!cart) {
      // Create new cart document if none exists for user
      const newCart = new Cart({
        user: user._id,
        items: [cartData],
        totalPrice: totalPrice,
      });
      await newCart.save();
    } else {
      // Update cart item if already exists in cart
      const existingItem = cart.items.find(
        (item) => item.fabric.toString() === fabric._id.toString()
      );
      if (existingItem) {
        existingItem.quantity = quantity;
        existingItem.price = price;
        const prevTotalPrice = existingItem.totalPrice || 0;
        cart.totalPrice = cart.totalPrice - prevTotalPrice + totalPrice;
        existingItem.totalPrice = totalPrice;
      } else {
        cart.items.push(cartData);
        cart.totalPrice += totalPrice;
      }
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: "Fabric added to cart successfully.",
      updatedFabric,
      totalPrice,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

/***************** GET CART TOTAL ***************/
/***************** URL :  ***************/
exports.getCartTotal = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found.",
      });
    }

    return res.status(200).json({
      success: true,
      totalPrice: cart.totalPrice,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};