// === Imports des modules nécessaires ===
import path from 'path';                   // Gérer les chemins de fichiers (utile pour EJS notamment)
import { fileURLToPath } from 'url';        // Convertir l'URL du fichier actuel en chemin classique
import express from 'express';              // Framework serveur web rapide
import dbc from 'pg-promise';               // Pour parler à la base PostgreSQL facilement
import dotenv from 'dotenv';                // Charger les variables d'environnement depuis .env
import jwt from 'jsonwebtoken';             // Pour créer des tokens JWT
import registerClientRoutes from './routes/clients.js';
import registerAccountRoutes from './routes/accounts.js';

// === Variables système pour bien gérer __dirname avec ES Modules ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // Pour retrouver le dossier courant du projet

// === Chargement du fichier .env ===
dotenv.config();

// === Instanciation de l'application Express ===
const app = express();
const port = 3000; // Port d'écoute du serveur

// === Configuration pour les tokens JWT (sécurité plus tard) ===
const JWT_SECRET_KEY = Buffer.from("REDACTED_ROTATE_THIS_SECRET", "base64"); // Clé de chiffrement
const JWT_ALGORITHM = "HS256"; // Algo utilisé pour signer les tokens

// === Vérification : les infos de connexion à la BDD sont-elles présentes ? ===
if (!process.env.DB_USER || !process.env.DB_PASS) {
  console.error("❌ Erreur : DB_USER ou DB_PASS manquant dans le .env");
  process.exit(1); // On arrête tout si ce n'est pas configuré
}

// === Connexion à la base PostgreSQL ===
const db = dbc()(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@db:5432/bank_db`);
// --> Attention ici : 'db' est le nom du service défini dans docker-compose.yml

// === Middlewares Express ===
app.use(express.json()); // Permet de parser le JSON dans les requêtes POST
app.use(express.urlencoded({ extended: true })); // Permet de lire les données des formulaires classiques (html forms)
app.use(express.static('public')); // Pour que CSS, JS, images soient accessibles (ex : /css/style.css)

// === Paramétrage de la vue (EJS) ===
app.set('view engine', 'ejs'); // Définir EJS comme moteur de template
app.set('views', path.join(__dirname, 'views')); // Où trouver nos fichiers .ejs

// ===============================================
// Routing principal
// ===============================================
registerClientRoutes(app, db);
registerAccountRoutes(app, db);

// authenticate api calls except login
app.use(
  expressjwt({
    secret: JWT_SECRET_KEY,
    algorithms: [JWT_ALGORITHM],
  }).unless({ path: ["/login"] })
);

// handle invalid token error
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ "error": "invalid token" });
  } else {
    next(err);
  }
});

// ===============================================
// Route spéciale pour récupérer un Token
// ===============================================

// Login route
app.post('/login', async (req, res) => {
  try {
    const user = await db.one('SELECT * FROM bank_user WHERE username = $1 and password = $2 and deleted = FALSE', [req.body.username, req.body.password]);
    const token = jwt.sign({ user_id: user.id, role: user.role }, JWT_SECRET_KEY, { algorithm: JWT_ALGORITHM });
    res.status(200).send({ token });
  } catch (error) {
    res.sendStatus(401);
  }
});

// ===============================================
// Lancement du serveur
// ===============================================
app.listen(port, () => {
  console.log(`✅ Serveur démarré : http://localhost:${port}`);
});
