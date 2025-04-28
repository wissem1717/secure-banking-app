import express from 'express';
import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken';
import dbc from 'pg-promise';
import registerClientRoutes from './routes/clients.js';
import registerAccountRoutes from './routes/accounts.js'
import path from 'path';

const app = express();
const port = 3000;

const JWT_SECRET_KEY = Buffer.from("REDACTED_ROTATE_THIS_SECRET", "base64");
const JWT_ALGORITHM = "HS256";

if (!process.env.DB_USER) {
  console.log("Specify database user using DB_USER env variable.");
  process.exit(1);
}

if (!process.env.DB_PASS) {
  console.log("Specify database password using DB_PASS env variable.");
  process.exit(1);
}

const db = dbc()(`postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/bank_db`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration pour EJS
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'api', 'views'));

// Dossier public
app.use(express.static(path.join(path.resolve(), 'public')));

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

// Enregistrer les routes
registerClientRoutes(app, db);
registerAccountRoutes(app, db);

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

app.listen(port, () => {
  console.log(`Api disponible sur http://localhost:${port}`);
});
