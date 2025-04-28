export default function registerClientRoutes(app, db) {
    app.get('/clients', (req, res) => {
      db.manyOrNone('SELECT * FROM bank_user ORDER BY id')
        .then(clients => {
        res.send(clients)
      }).catch(error => {
        res.sendStatus(400)
        console.error(error)
      })
    })

    app.get('/clients/:id', (req, res) => {
      db.one('SELECT * FROM bank_user WHERE id = $1', req.params.id)
        .then(client => {
        res.send(client)
      }).catch(error => {
        res.sendStatus(404)
        console.error(error)
      })
    })

    app.put('/clients/:id', (req, res) => {
      let values_in_body = Object.keys(req.body).filter(k => ["first_name", "last_name", "date_of_birth"].includes(k))
      if (values_in_body.length == 0) {
        res.sendStatus(200);
        return;
      }
      let query = 'UPDATE bank_user SET' + [...values_in_body.keys().map(i => " " + values_in_body[i] + " = $" + (i+2))] + ' WHERE id = $1 RETURNING *'
      db.one(query, [req.params.id, ...values_in_body.map(k => req.body[k])])
        .then(client => {
          res.send(client)
        })
        .catch(error => {
          res.sendStatus(500)
          console.error(error)
        })
    })

    app.post("/clients", (req, res) => {
      let values_in_body = Object.keys(req.body)
      if (!values_in_body.includes("first_name") || !values_in_body.includes("last_name") || !values_in_body.includes("date_of_birth")) {
        res.sendStatus(400);
      }
      db.one(
        "INSERT INTO bank_user (first_name, last_name, date_of_birth) VALUES ($1, $2, $3) RETURNING *",
        [req.body.first_name, req.body.last_name, req.body.date_of_birth]
      ).then((client) => {
        res.send(client)
      }).catch(error => {
        res.sendStatus(500)
        console.error(error)
      })
    })
}
