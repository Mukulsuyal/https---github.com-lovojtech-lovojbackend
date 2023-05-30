const passport = require("passport");
const Strategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const { Workers } = require("../models/Worker.model");

const User = require("../models/user");
const authKeys = require("./authKeys");

const filterJson = (obj, unwantedKeys) => {
  const filteredObj = {};
  Object.keys(obj).forEach((key) => {
    if (unwantedKeys?.indexOf(key) === -1) {
      filteredObj[key] = obj[key];
    }
  });
  return filteredObj;
};

passport.use(
  new Strategy(
    {
      usernameField: "email",
      passReqToCallback: true,
    },
    (req, email, password, done, res) => {
      // Check if the role is one of the specified roles
      const isWorkerRole =
        req.body.role === "manager" ||
        req.body.role === "sales" ||
        req.body.role === "cutter" ||
        req.body.role === "master tailor" ||
        req.body.role === "stitching" ||
        req.body.role === "QC" ||
        req.body.role === "delivery";

      if (isWorkerRole) {
        Workers.findOne({ email: email }, (err, worker) => {
          if (err) {
            return done(err);
          }
          if (!worker) {
            return done(null, false, {
              message: "Invalid credentials",
            });
          }

          worker
            .login(password)
            .then(() => {
              worker["_doc"] = filterJson(worker["_doc"], ["password", "__v"]);
              return done(null, worker);
            })
            .catch((err) => {
              return done(err, false, {
                message: "Invalid credentials",
              });
            });
        });
      } else {
        User.findOne({ email: email }, (err, user) => {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: "Invalid credentials",
            });
          }

          user
            .login(password)
            .then(() => {
              user["_doc"] = filterJson(user["_doc"], ["password", "__v"]);
              return done(null, user);
            })
            .catch((err) => {
              return done(err, false, {
                message: "Invalid credentials",
              });
            });
        });
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: authKeys.jwtSecretKey,
    },
    async (jwt_payload, done) => {
      const user = await User.findById(jwt_payload._id);
      if (user) {
        user["_doc"] = filterJson(user["_doc"], ["password", "__v"]);
        return done(null, user);
      }

      const worker = await Workers.findById(jwt_payload._id);
      if (worker) {
        worker["_doc"] = filterJson(worker["_doc"], ["password", "__v"]);
        return done(null, worker);
      }

      return done(null, false, {
        message: "Session Expired",
      });
    }
  )
);


module.exports = passport;
