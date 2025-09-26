const express = require("express");
const router = express.Router();
const { registerStudent, loginStudent, } = require("../controllers/studentController");
const studentController = require("../controllers/studentController");
const upload = require("../utils/upload");

// Test route
router.get("/test", (req, res) => {
    res.send("Student route is working ✅");
});

// Register Student
router.post("/register", registerStudent);

// Login Student
router.post("/login", loginStudent);

// Upload one photo + multiple certificates
router.post(
  "/register",
  upload.fields([{ name: "photo", maxCount: 1 }, { name: "certificates", maxCount: 5 }]),
  studentController.register
);


module.exports = router;