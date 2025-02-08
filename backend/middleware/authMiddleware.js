const jwt = require ("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Access Denied" });
  }

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token format" });
  }

  try {
    const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    console.log("Decoded token:", verified);

    if (!verified.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = { id: verified.userId };
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
