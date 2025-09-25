const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true
    },
    aadharNo: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;