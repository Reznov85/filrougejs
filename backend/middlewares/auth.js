// middlewares/auth.js
import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Non authentifié." });
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    req.user = payload; // { id, email, role, iat, exp }
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Token invalide ou expiré." });
  }
}
