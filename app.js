const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


const nodemailer = require("nodemailer");
const { sendMail } = require("./utils/mailservice");
const cloudinary = require("./utils/cloudinaryConfig");
const upload = require("./utils/upload");
const connectDB = require("./config/dbConnect");

dotenv.config();
const app = express();

const adminRoutes = require("./routes/adminRoute");
const universityRoutes = require("./routes/university");
const facultyRoutes = require("./routes/facultyRoute");
const studentRoutes = require("./routes/studentRoute");


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect Database
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("SIH Backend API Running");
});


app.use("/api/admin", adminRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

// ------------------- Email API -------------------
app.post("/send-mail", async (req, res) => {
  const { to, subject, name, message } = req.body;

  if (!to || !subject || !message)
    return res.status(400).json({ success: false, error: "Missing fields" });

  try {
    const info = await sendMail({ to, subject, message, name });
    res.json({ success: true, previewURL: info.previewURL || null });
  } catch (err) {
    console.error("Mail error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ------------------- Image Upload API -------------------
app.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file uploaded" });

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "sih_project" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(fileBuffer);
      });
    };

    const result = await streamUpload(req.file.buffer);
    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});