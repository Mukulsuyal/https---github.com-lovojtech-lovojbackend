const User = require("../models/user");
const jwt = require("jsonwebtoken")
const { sendingEmail } = require("../utils/sendingEmail");
const { hashPassword, comparePassword } = require("../utils/hashPassword");
const { generateToken } = require("../middleware/jwtAuth");
const { Workers } = require("../models/Worker.model");
const { jwtSecretKey } = require("../middleware/authKeys");

/***************** URL : {{LOCAL_URL}}/designation/signup ***************/
// exports.roleSignUp = async (req, res, next) => {
//     try {
//         const { email, password, role } = req.body;
//         const storeNumber = req.user.storeNumber
//         const storeType = req.user.storeType

//         // Check if the storeNumber, storeType, email, password, and role are provided
//         if (!email || !password || !role) {
//             return res.status(400).json({ message: "email, password, and role are required." });
//         }

//         // Check if the storeNumber is present in the User collection
//         let store = await User.findOne({ storeNumber });
//         if (!store) {
//             return res.status(404).json({ message: "Store not found." });
//         }
//         //const hashedPassword = await hashPassword(password)

//         const worker = await Workers.create({ storeNumber: storeNumber, password: password, storeType: storeType, email, role })
//         if (worker) {
//             sendingEmail(email, "Welcome to our Team", `Your account for store ${storeNumber} has been registered successfully.\n\n Your Store Number: ${storeNumber}\n Your Password: ${password}`)
//         }
//         res.status(200).json({ success: true, message: `Registered successfully for role ${role}`,worker });

//     } catch (error) {
//         res.status(400).json({ message: error });
//     }
// };




exports.roleSignUp = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const storeNumber = req.user.storeNumber;
        const storeType = req.user.storeType;

        // Check if the storeNumber, storeType, email, password, and role are provided
        if (!email || !password || !role) {
            return res.status(400).json({ message: "email, password, and role are required." });
        }

        
        // Check if the role already exists for the given storeType
        const existingWorker = await Workers.findOne({ storeType, role });
        if (existingWorker) {
            return res.status(400).json({ message: `Role '${role}' already exists for store type '${storeType}'.` });
        }

        // Check if the storeNumber is present in the User collection
        let store = await User.findOne({ storeNumber });
        if (!store) {
            return res.status(404).json({ message: "Store not found." });
        }

        const worker = await Workers.create({ storeNumber: storeNumber, password: password, storeType: storeType, email, role })
        if (worker) {
            sendingEmail(
                email,
                "Welcome to our Team",
                `Your account for store ${storeNumber} has been registered successfully.\n\n Your Store Number: ${storeNumber}\n Your Password: ${password}`
            );
        }

        res.status(200).json({ success: true, message: `Registered successfully for role ${role}`, worker });

    } catch (error) {
        res.status(400).json({ message: error });
    }
};












// exports.roleLogin = async (req, res, next) => {
//     try {
//         const { storeNumber, email, password } = req.body;

//         // Check if the storeNumber, email, password, and role are provided
//         if (!storeNumber || !email || !password) {
//             return res.status(400).send({ message: "storeNumber, email, password, and role are required." });
//         }

//         // Find the user in the respective collection
//         const worker = await Workers.findOne({ storeNumber, email });
//         if (!worker) {
//             return res.status(404).send({ message: "User not found." });
//         }
        
//         const isMatch = await comparePassword(password, worker.password)
//         if (!isMatch) {
//             res.status(404).json({
//                 success: false,
//                 message: "Invalid Credentials"
//             })
//         }
//         // User authentication successful
//         const token =await jwt.sign({ _id: worker._id, role: worker.role, storeNumber: worker.storeNumber }, jwtSecretKey, { expiresIn: "1h" });
//         res.status(200).json({ success: true, message: `Login successful.`, token });

//     } catch (error) {
//         res.status(400).send({ message: error });
//     }
// };
