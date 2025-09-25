const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/AdminController");

// POST /admin/login
router.post("/login", loginAdmin);

module.exports = router;
