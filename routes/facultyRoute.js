const express = require("express");
const router = express.Router();
const { registerFaculty, loginFaculty, getStudentsByDepartment  } = require("../controllers/facultyController");

// Test Route

// Register Faculty
router.post("/register", registerFaculty);

// Login Faculty
router.post("/login", loginFaculty);

// Fetch all students from faculty's department
router.get("/:facultyId/students", getStudentsByDepartment);

module.exports = router;
