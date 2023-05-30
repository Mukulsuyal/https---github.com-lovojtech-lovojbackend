const {Customer, Product} = require("../models/Customer");

/***************** URL :  ***************/
exports.createCustomer = async(req, res) => {
    try { 
        const storeId = req.user.storeId;
        const {
          country,
          phoneNumber,
          email,
          alternatePhoneNumber,
          customerName,
          gender,
          dateOfBirth,
          address,
        } = req.body;
    
        const customer = await Customer.create({
            storeId,
          country,
          phoneNumber,
          email,
          alternatePhoneNumber,
          customerName,
          gender,
          dateOfBirth,
          address
        });
    
        return res.status(200).json({
          success: true,
          message: 'Customer added successfully to the database.',
          customer
        });
      } catch (err) {
        return res.status(400).json({ message: err.message });
      }
}

/***************** URL :  ***************/
exports.getCustomers = async (req, res) => {
    const customers = await Customer.find({storeId : req.user.storeId})
    res.status(200).json({
        success: true,
        count: customers.length,
        customers
    })
}

/***************** URL :  ***************/
exports.getCustomerById = async (req, res) => {
    const customers = await Customer.findById(req.params.id)
    res.status(200).json({
        success: true,
        count: customers.length,
        customers
    })
}

/***************** URL :  ***************/
exports.createProduct = async (req, res) => {
    try {
        const storeId = req.user.storeId;
      const { CustomerId, productName, fabricName } = req.body;

        const customer = await Customer.findById(CustomerId);
        if(!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found',
            })
        }
  
      const product = await Product.create({
          CustomerId,
          storeId,
        productName,
        fabricName
      });
  
      return res.status(200).json({
        success: true,
        message: 'Product created successfully.',
        product
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  /***************** URL :  ***************/
  exports.getProductByCustomerId = async (req, res) => {
    try {
      const { customerId } = req.params;
  
      const products = await Product.find({customerId });
  
      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No products found for the specified customer.',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully.',
        products,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };