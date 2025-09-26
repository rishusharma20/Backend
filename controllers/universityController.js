const University = require("../models/University");
const bcrypt = require("bcrypt");
const Faculty = require("../models/Faculty");
const { sendMail } = require("../utils/mailservice");

// Register a new university
const registerUniversity = async (req, res) => {
  try {
    console.log(req.body);
    const { aisheCode, name, address, email, contact, password } = req.body;

    // Check if AISHE code or email already exists

    const exists = await University.findOne({ $or: [{ aisheCode }, { email }] });
    if (exists) return res.status(400).json({ message: "University already exists" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new university document
    const newUniversity = new University({
      aisheCode,
      name,
      address,
      email,
      contact,
      password: hashedPassword,
    });

    await newUniversity.save();

    res.status(201).json({ message: "University registered successfully", university: newUniversity });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login for university
const loginUniversity = async (req, res) => {
  try {
    const { aisheCode, password } = req.body;

    // Find university by email
    const university = await University.findOne({ aisheCode });
    if (!university) return res.status(400).json({ message: "University not found" });

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, university.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // Return success response
    res.status(200).json({ message: "Login successful", universityId: university.aisheCode });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

//send mail to university
exports.register = async (req, res) => {
  try {
    const { name, aisheCode, email, password } = req.body;
    const university = await University.create({ name, aisheCode, email, password });

    await sendMail({
      to: email,
      subject: "EduTrack - University Account Created",
      message: `Your university account has been created successfully.\nAISHE Code: ${aisheCode}\nPassword: ${password}`,
      name
    });

    res.status(201).json({ message: "University created and email sent", university });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllFaculty = async (req, res) => {
    try {
        const { aisheCode } = req.params;

        const university = await University.findOne({ aisheCode });
        if (!university) {
            return res.status(404).json({ message: "University not found" });
        }

        // fetch all faculty (later you can filter by universityId if relation is added)
        const faculties = await Faculty.find();

        res.status(200).json({
            message: "All Faculty members",
            count: faculties.length,
            faculties
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching faculty", error: error.message });
    }
};

module.exports = { registerUniversity, loginUniversity, getAllFaculty };