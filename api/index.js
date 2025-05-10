import express from 'express'; // Framework web Node.js
import cors from 'cors'; // Middleware pour autoriser les requêtes cross-origin
import { expressjwt } from "express-jwt"; // Middleware pour valider les JWT
import jwt from 'jsonwebtoken'; // Librairie pour signer les JWT
import dbc from 'pg-promise'; // Librairie pour connecter PostgreSQL
import registerClientRoutes from './routes/clients.js'; // Routes clients
import registerAccountRoutes from './routes/accounts.js' // Routes comptes
import registerOperationRoutes from './routes/operations.js' // Routes opérations
import registerCardsRoutes from './routes/cards.js' // Routes cartes
import path from 'path'; // Utilitaire pour manipuler les chemins

const app = express(); // Création de l'application Express
const port = 3000; // Port du serveur

const JWT_SECRET_KEY = Buffer.from("REDACTED_ROTATE_THIS_SECRET", "base64"); // Clé secrète encodée en base64
const JWT_ALGORITHM = "HS256"; // Algorithme utilisé pour signer les tokens

if (!process.env.DB_USER) { // Vérifie si la variable d’environnement DB_USER est définie
  console.log("Specify database user using DB_USER env variable.");
  process.exit(1);
}

if (!process.env.DB_PASS) { // Vérifie si DB_PASS est défini
  console.log("Specify database password using DB_PASS env variable.");
  process.exit(1);
}

// Connexion à la base PostgreSQL via pg-promise
const db = dbc()(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

app.use(express.json()); // Middleware pour parser les JSON
app.use(express.urlencoded({ extended: true })); // Middleware pour parser les données URL-encodées
app.use(cors({ origin: true, credentials: true })); // Active CORS avec cookies

// Configuration pour EJS
app.set('view engine', 'ejs'); // Moteur de templates
app.set('views', path.join(path.resolve(), 'api', 'views')); // Dossier des vues EJS

// Dossier public
app.use(express.static(path.join(path.resolve(), 'public'))); // Sert les fichiers statiques

// Middleware JWT : protège toutes les routes sauf /login
app.use(
  expressjwt({
    secret: JWT_SECRET_KEY,
    algorithms: [JWT_ALGORITHM],
  }).unless({ path: ["/login"] })
);

// Gestion des erreurs JWT
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({ "error": "invalid token" }); // Si token invalide
  } else {
    next(err);
  }
});

// Enregistrement des routes
registerClientRoutes(app, db);
registerAccountRoutes(app, db);
registerOperationRoutes(app, db);
registerCardsRoutes(app, db);

// Route de connexion
app.post('/login', async (req, res) => {
  try {
    // Recherche l’utilisateur avec identifiants corrects
    const user = await db.oneOrNone('SELECT * FROM bank_user WHERE username = $1 and password = $2 and deleted = FALSE', [req.body.username, req.body.password]);
    if (!user) {
      res.sendStatus(401); // Identifiants incorrects
      return;
    }
    // Génère un token JWT avec l’ID et le rôle
    const token = jwt.sign({ user_id: user.id, role: user.role }, JWT_SECRET_KEY, { algorithm: JWT_ALGORITHM });
    res.status(200).send({
      token,
      id: user.id,
      role: user.role
    });
  } catch (error) {
    res.sendStatus(500); // Erreur serveur
    console.log(error);
  }
});

// Lance le serveur
app.listen(port, () => {
  console.log(`Api disponible sur http://localhost:${port}`);
});
