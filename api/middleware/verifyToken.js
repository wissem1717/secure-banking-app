// 📁 middleware/verifyToken.js

const jwt = require("jsonwebtoken");

// Middleware pour valider le token JWT dans les cookies
function verifyToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send("❌ Accès refusé. Aucun token trouvé !");
  }

  try {
    const decoded = jwt.verify(token, "TOP_SECRET_KEY");
    req.user = decoded; // Ajoute les données du token à req
    next(); // Continue vers la route protégée
  } catch (err) {
    console.error("❌ Token invalide :", err.message);
    return res.status(403).send("❌ Token invalide !");
  }
}

module.exports = verifyToken;


