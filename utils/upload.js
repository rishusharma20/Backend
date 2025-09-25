const multer = require("multer");

// store files in memory for upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;
