const Faculty = require("../models/Faculty");
const Student = require("../models/Student");
const { sendMail } = require("../utils/mailservice");

// Faculty Registration
const registerFaculty = async (req, res) => {
    try {
        const {name, email, department, contact, password } = req.body;

        if (!name || !email || !department || !contact || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // check if faculty already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({ message: "Faculty already registered with this email" });
        }

        const newFaculty = new Faculty({
            name,
            email,
            department,
            contact,
            password  // 🔔 currently storing as plain text (like admin)
        });

        await newFaculty.save();
        res.status(201).json({ message: "Faculty registered successfully", faculty: newFaculty });

    } catch (error) {
        res.status(500).json({ message: "Error registering faculty", error: error.message });
    }
};

// Faculty Login
const loginFaculty = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "FacultyId and password are required" });
        }

        const faculty = await Faculty.findOne({ email });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        // check password (plain text check like admin)
        if (faculty.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful", faculty });

    } catch (error) {
        res.status(500).json({ message: "Error logging in faculty", error: error.message });
    }
};

//send email to faculty
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const faculty = await Faculty.create({ name, email, password });

    await sendMail({
      to: email,
      subject: "EduTrack - Faculty Account Created",
      message: `Your faculty account has been created successfully.\nEmail: ${email}\nPassword: ${password}`,
      name
    });

    res.status(201).json({ message: "Faculty created and email sent", faculty });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const getStudentsByDepartment = async (req, res) => {
    try {
        const { facultyId } = req.params;

        // find faculty by ID
        console.log(facultyId);
        const faculty = await Faculty.findOne({ email: facultyId });
        if (!faculty) {
            return res.status(404).json({ message: "Faculty not found" });
        }

        // find students with same department
        const students = await Student.find({ department: faculty.department });

        res.status(200).json({
            message: `Students from ${faculty.department} department`,
            count: students.length,
            students
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching students", error: error.message });
    }
};

module.exports = { registerFaculty, loginFaculty, getStudentsByDepartment };