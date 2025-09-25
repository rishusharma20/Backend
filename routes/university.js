const express = require("express");
const router = express.Router();
const { registerUniversity, loginUniversity, getAllFaculty  } = require("../controllers/universityController");

// POST /university/register
router.post("/register", registerUniversity);

// POST /university/login
router.post("/login", loginUniversity);

// Fetch all faculty under a university
router.get("/:aisheCode/faculties", getAllFaculty);

module.exports = router;
