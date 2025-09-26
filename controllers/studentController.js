const Student = require("../models/Student");
const { sendMail } = require("../utils/mailservice");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/upload"); // multer

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

//send email to student
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const student = await Student.create({ name, email, password });

    // send email
    await sendMail({
      to: email,
      subject: "EduTrack - Student Account Created",
      message: `Your student account has been created successfully.\nEmail: ${email}\nPassword: ${password}`,
      name
    });

    res.status(201).json({ message: "Student created and email sent", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register + upload photo & certificates
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Upload profile photo (if provided)
    let photoUrl = null;
    if (req.files && req.files.photo) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: "EduTrack/students/photos" },
        (error, result) => {
          if (error) throw error;
          photoUrl = result.secure_url;
        }
      );
      req.files.photo[0].stream.pipe(result);
    }

    // Upload certificates (multiple files)
    let certificates = [];
    if (req.files && req.files.certificates) {
      for (const file of req.files.certificates) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "EduTrack/students/certificates" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          file.stream.pipe(stream);
        });
        certificates.push(result.secure_url);
      }
    }

    // Save student in DB
    const student = await Student.create({
      name,
      email,
      password,
      photo: photoUrl,
      certificates,
    });

    res.status(201).json({ message: "Student created", student });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerStudent, loginStudent };
