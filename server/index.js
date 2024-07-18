const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { cloudinaryConnect } = require("./config/cloudinary");
const { connectDB } = require("./config/database");
const PORT = process.env.PORT || 4000;
const fileUploader = require("express-fileupload");
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseRoutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");

app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(
  fileUploader({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(cors(corsOptions));

cloudinaryConnect();

connectDB();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

app.get("/", (req, res) => {
  res.send("<h1>Hello ! Welcome to EnigmaLearn</h1>");
});

app.listen(PORT, () => {
  console.log("Your App Started at ",PORT);
});
