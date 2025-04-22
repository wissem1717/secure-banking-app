import express from 'express'
import { expressjwt } from "express-jwt";
import jwt from 'jsonwebtoken';
const app = express()
const port = 3000

const JWT_SECRET_KEY = Buffer.from("REDACTED_ROTATE_THIS_SECRET", "base64");
const JWT_ALGORITHM = "HS256";

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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/login', (req, res) => {
  var token = jwt.sign({ foo: 'bar' }, JWT_SECRET_KEY, { algorithm: JWT_ALGORITHM });
  res.status(200).send({
    "token": token,
  })
})

app.listen(port, () => {
  console.log(`Api available on port ${port}`)
})
