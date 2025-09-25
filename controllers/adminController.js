const bcrypt = require("bcrypt");
const Admin = require("../models/Admin");

const loginAdmin = async (req, res) => {
  const { adminId, password } = req.body;

  try {
    
    if (!adminId || !password) {
      return res.status(400).json({ message: "AdminId and password are required" });
    }

    // Find admin by adminId
    const admin = await Admin.findOne({ adminId: adminId.trim() });
    
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Login successful
    res.status(200).json({ 
      message: "Login successful", 
      adminId: admin.adminId 
    });
    
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { loginAdmin };