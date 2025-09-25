const Student = require("../models/Student");

// Register Student
const registerStudent = async (req, res) => {
    try {
        const { name, year, contact, email, gender, aadharNo, password, department } = req.body;

        if (!name || !year || !contact || !email || !gender || !aadharNo || !password || !department) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if student already exists by email or aadhar
        const existingStudent = await Student.findOne({ $or: [{ email }, { aadharNo }] });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already registered with this Email or Aadhar No" });
        }

        const newStudent = new Student({
            name,
            year,
            contact,
            email,
            gender,
            aadharNo,
            password,   // 🔔 storing as plain text (like admin & faculty)
            department
        });

        await newStudent.save();
        res.status(201).json({ message: "Student registered successfully", student: newStudent });

    } catch (error) {
        res.status(500).json({ message: "Error registering student", error: error.message });
    }
};

// Login Student
const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // check password (plain text check)
        if (student.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", student });

    } catch (error) {
        res.status(500).json({ message: "Error logging in student", error: error.message });
    }
};

module.exports = { registerStudent, loginStudent };
