import express from 'express'
import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken';
import dbc from 'pg-promise';
import registerClientRoutes from './routes/clients.js';

const app = express()
const port = 3000

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

app.use(express.json())

// authenticate api calls on all routes except for login route.
app.use(
  expressjwt({
    secret: JWT_SECRET_KEY,
    algorithms: [JWT_ALGORITHM],
  }).unless({ path: ["/login"] })
);

// handle invalid token error
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({"error": "invalid token"});
  } else {
    next(err);
  }
});

registerClientRoutes(app, db);

app.get('/login', (req, res) => {
  db.one('SELECT * FROM user WHERE id = $1', req.params.id)
    .then(client => {
    res.send(client)
  }).catch(() => {
    res.sendStatus(404)
  })

  var token = jwt.sign({ foo: 'bar' }, JWT_SECRET_KEY, { algorithm: JWT_ALGORITHM });
  res.status(200).send({
    "token": token,
  })
})

await app.listen(port, () => {
  console.log(`Api available on port ${port}`)
})
