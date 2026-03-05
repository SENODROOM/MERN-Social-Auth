/**
 * AUTH MIDDLEWARE
 * Verifies the JWT token sent with every protected request.
 * The client stores the JWT in localStorage and sends it
 * in the Authorization header as: "Bearer <token>"
 */

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized — no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach userId to request for downstream use
    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized — invalid token" });
  }
};

module.exports = { protect };
