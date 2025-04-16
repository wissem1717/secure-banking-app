const jwt = require("jsonwebtoken");

// Middleware pour vérifier le token JWT dans les cookies
function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).send("❌ Accès refusé. Aucun token !");
  }

  try {
    const decoded = jwt.verify(token, "TOP_SECRET_KEY");
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).send("❌ Token invalide !");
  }
}

module.exports = verifyToken;



