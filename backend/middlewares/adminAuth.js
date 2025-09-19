
const adminAuth = (req, res, next) => {
if (!req.user) {
      console.log('toto')
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

export default adminAuth