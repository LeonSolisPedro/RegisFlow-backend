import jwt from "jsonwebtoken"
import db from "./db.mjs"

const authorize = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>

  if (!token)
    return res.status(401).json({ message: 'Unauthorized' });

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, 'fantastic-and-cool-key');
    const sql = 'SELECT status FROM users WHERE id = ?';
    const response = await db.query(sql, [decoded.id])
    const status = response[0].map(x => x.status).at(0) ?? "blocked"
    if (status === "blocked")
      return res.status(401).json({ message: 'Unauthorized' });
    // If everything is fine, proceed to the next middleware or endpoint handler
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export default authorize;