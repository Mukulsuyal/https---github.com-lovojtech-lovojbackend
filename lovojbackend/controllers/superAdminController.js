const Store = require("../models/stores");
const { sendingEmail } = require("../utils/sendingEmail");

exports.getStoreState = async (req, res) => {
  try {
    // Find stores with flag false
    const stores = await Store.find({ flag: false }).exec();
    if (stores.length == 0) {
      return res.status(200).json({ message: "No stores found" })
    }

    res.status(200).json({
      success: true,
      count: stores.length,
      stores
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error retrieving stores" });
  }
}

exports.verifyStore = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find the store by ID
    const store = await Store.findById(id).exec();
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    // Update the flag to true
    store.flag = true;
    await store.save();
    var replacements = store;
    var templates = "store-created-email";

    await sendingEmail(store?.email,
       "Account and Store Verified. Get the store number below",
    `${store?.storeNumber} use this Store number to Login to your store.`)

    res.status(200).json({ success: true, message: "Store flag updated successfully",store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating store flag" });
  }
}