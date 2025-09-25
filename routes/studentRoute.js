const express = require("express");
const router = express.Router();
const { registerStudent, loginStudent } = require("../controllers/studentController");

// Test route
router.get("/test", (req, res) => {
    res.send("Student route is working ✅");
});

// Register Student
router.post("/register", registerStudent);

// Login Student
router.post("/login", loginStudent);

module.exports = router;