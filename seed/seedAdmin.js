const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/sih-db')
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const createAdmin = async () => {
  try {
    const exists = await Admin.findOne({ adminId: "admin123" });
    if (exists) {
      console.log("Admin already exists");
      return mongoose.connection.close();
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const newAdmin = new Admin({
      adminId: "admin123",
      password: hashedPassword, // hashed password
    });

    await newAdmin.save();
    console.log("Admin created successfully!");
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();