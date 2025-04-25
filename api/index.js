import express from 'express'
import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken';
import dbc from 'pg-promise';
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

app.get('/client', (req, res) => {
  db.manyOrNone('SELECT * FROM client')
    .then(clients => {
    res.send(clients)
  }).catch(error => {
    res.sendStatus(400)
  })
})

app.get('/client/:id', (req, res) => {
  db.one('SELECT * FROM client WHERE id = $1', req.params.id)
    .then(client => {
    res.send(client)
  }).catch(() => {
    res.sendStatus(404)
  })
})

app.put('/client/:id', (req, res) => {
  let values_in_body = Object.keys(req.body).filter(k => ["first_name", "last_name", "date_of_birth"].includes(k))
  if (values_in_body.length == 0) {
    res.sendStatus(200);
    return;
  }
  let query = 'UPDATE client SET' + [...values_in_body.keys().map(i => " " + values_in_body[i] + " = $" + (i+2))] + ' WHERE id = $1 RETURNING *'
  db.one(query, [req.params.id, ...values_in_body.map(k => req.body[k])])
    .then(client => {
      res.send(client)
    })
    .catch(() => {
      res.sendStatus(500)
    })
})

app.post("/client", (req, res) => {
  let values_in_body = Object.keys(req.body)
  if (!values_in_body.includes("first_name") || !values_in_body.includes("last_name") || !values_in_body.includes("date_of_birth")) {
    res.sendStatus(400);
  }
  db.one(
    "INSERT INTO client (first_name, last_name, date_of_birth) VALUES ($1, $2, $3) RETURNING *",
    [req.body.first_name, req.body.last_name, req.body.date_of_birth]
  ).then((client) => {
    res.send(client)
  }).catch((e) => {
    console.error(e)
    res.sendStatus(500)
  })
})

app.get('/login', (req, res) => {
  var token = jwt.sign({ foo: 'bar' }, JWT_SECRET_KEY, { algorithm: JWT_ALGORITHM });
  res.status(200).send1({
    "token": token,
  })
})

await app.listen(port, () => {
  console.log(`Api available on port ${port}`)
})
