const express = require("express");
const bodyParser = require("body-parser");
// const errorHandlers = require("./helpers/errors-handler");
const mongoose = require("mongoose");
const passportConfig = require("./middleware/passportConfig");
const cors = require("cors");
const dotenv = require("dotenv");
const superAdminRouter = require("./routes/superAdminRoutes");
const profileDetails = require("./routes/profileRoutes");
const quickOrderRouter = require("./routes/quickOrderRoute");

dotenv.config();
const app = express();
const server = require("http").createServer(app);

/////

// mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  // useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`Connected to MongoDB database at ${process.env.MONGODB_URL}!`);
});

// const URI = process.env.MONGODB_URL;
// mongoose.connect(URI, (err) => {
//   if (err) throw err;
//   console.log("connected to mongodb");
// });
app.use(cors());

const PORT = process.env.PORT || 5001;

app.use(bodyParser.json()); // //support json encoded bodies

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// Routing
app.use("/auth", require("./routes/authRoutes"));
// app.use("/tailor", require("./routes/tailorRoutes"));
app.use("/profile", profileDetails);
// app.use("/superadmin", require("./routes/adminroute"));
app.use("/fabric", require("./routes/fabricRoutes"));

//Quick Order Routes
app.use("/api/v1", quickOrderRouter)


//Super Admin Route
app.use(superAdminRouter);
app.use("/dummy", require("./routes/dummyLoginRoutes"));
app.use("/designation", require("./routes/workerRoute"));

// app.use("/check", require("./routes/otpsRoutes"));
app.use(require("./routes/testRoute"));
// app.use("/",require("./routes/"))

// Setting up middlewares

app.use(express.json());
// app.use(express.urlencoded({extended:false}));//////
app.use(passportConfig.initialize());
// app.use(errorHandlers);
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  console.log("serving");
  res.send("running.....");
  // res.sendFile(__dirname + "/public/serverHtml/serving.html");
});
app.use("*", (req, res) => {
  res.send("Route not found");
});

server.listen(PORT, () => {
  console.log("Server Running on Port " + PORT);
});
