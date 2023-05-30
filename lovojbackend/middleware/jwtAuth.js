// const passport = require("passport");
// // const jwt = require("jsonwebtoken");
// // const Store = require("../models/store");

// const jwtAuth = (req, res, next) => {
//   passport.authenticate("jwt", { session: false }, function (err, user, info) {
//     // console.log("user",req.headers)
//     if (err) {
      
//       return next(err);
      
//     }

//     if (!user) {
//       // console.log("hiiiii")
//       res.status(401).json(info);
//       return;
//     }

//     // if (!user.type === "admin") {
//     //   if (!user.verified) {
//     //     res.status(401).json({ message: "verfiy yor email first." });
//     //     return;
//     //   }
//     // }
//     req.user = user;
//     next();
//   })(req, res, next);
// };

// module.exports = jwtAuth;





const passport = require("passport");
const jwt = require("jsonwebtoken");
const authKeys = require("../middleware/authKeys");

const jwtAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, function (err, user, info) {
    if (err) {
      return next(err);
    }

    if (!user) {
      res.status(401).json(info);
      return;
    }

    req.user = user;
    next();
  })(req, res, next);
};

const jwtVerifyWorker = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token." });
    }

    req.user = decoded;
    next();
  });
};

const generateToken = (payload, expiresIn) => {

  return jwt.sign(payload, authKeys.jwtSecretKey, { expiresIn });
};

const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== "superadmin")
    return res.status(403).json({
      success: false,
      message: `${req.user.role} is not allowed to access this resource`
    })

  next();
};

module.exports = { jwtAuth, generateToken, authorizeAdmin };







