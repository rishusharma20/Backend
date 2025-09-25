const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: "Not authorized" });

    token = token.split(" ")[1]; // Bearer token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalid or expired" });
    }
};

module.exports = { protect };
