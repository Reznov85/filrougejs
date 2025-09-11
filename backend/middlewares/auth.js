
import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token manquant" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: "Token invalide" });
        req.user = user;
        next();
    });
};
const adminAuth = (req, res, next) => {
if (!req.user) {
    return res.status(401).json({ message: "Non authentifié." });
  }
  if (!req.user.role)  {
    return res.status(403).json({ message: "Rôle utilisateur manquant." });
  }

  const role = String(req.user.role).toLowerCase();
  if (role !== 'admin') {
    return res.status(403).json({ message: "Accès refusé : rôle insuffisant." });
  }
  return next();
};
export const adminOnly = [auth, adminAuth];
