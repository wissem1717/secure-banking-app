export default function registerClientRoutes(app, db) {
    app.get('/clients', (req, res) => {
      if (req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.manyOrNone('SELECT * FROM bank_user WHERE deleted = FALSE ORDER BY id')
        .then(clients => {
        res.send(clients)
      }).catch(error => {
        res.sendStatus(400)
        console.error(error)
      })
    })

    app.get('/clients/:id', (req, res) => {
      const client_id = req.params.id;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM bank_user WHERE id = $1 AND deleted = FALSE', req.params.id)
        .then(client => {
        res.send(client)
      }).catch(error => {
        res.sendStatus(404)
        console.error(error)
      })
    })

    app.put('/clients/:id', (req, res) => {
      const client_id = req.params.id;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      let values_in_body = Object.keys(req.body).filter(k => ["first_name", "last_name", "date_of_birth", "password"].includes(k))
      if (values_in_body.length == 0) {
        res.sendStatus(200);
        return;
      }
      
      let query = 'UPDATE bank_user SET';
      for (let index = 0; index < values_in_body.length; index++) {
        query += (index === 0 ? "" : ",") + " " + values_in_body[index] + " = $" + (index+2);
      }
      query += ' WHERE id = $1 AND deleted = FALSE RETURNING *';
      
      db.one(query, [req.params.id, ...values_in_body.map(k => req.body[k])])
        .then(client => {
          res.send(client)
        })
        .catch(error => {
          res.sendStatus(500)
          console.error(error)
        })
    })

    app.post("/clients", async (req, res) => {
      if (req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      let values_in_body = Object.keys(req.body)
      if (!values_in_body.includes("first_name") || !values_in_body.includes("last_name") || !values_in_body.includes("date_of_birth") || !values_in_body.includes("role") || !values_in_body.includes("username") || !values_in_body.includes("password")) {
        res.sendStatus(400);
      }
      let same_username = await db.oneOrNone("SELECT * FROM bank_user WHERE username = $1", [req.body.username])
      if (same_username) {
        res.sendStatus(400);
        return;
      } 
      db.one(
        "INSERT INTO bank_user (first_name, last_name, date_of_birth, role, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [req.body.first_name, req.body.last_name, req.body.date_of_birth, req.body.role, req.body.username, req.body.password]
      ).then((client) => {
        res.send(client)
      }).catch(error => {
        res.sendStatus(500)
        console.error(error)
      })
    })

    app.delete('/clients/:id', (req, res) => {
      const client_id = req.params.id
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM bank_user WHERE id = $1 AND deleted = FALSE', client_id)
        .then(() => {
        db.one('UPDATE bank_user SET deleted = TRUE WHERE id = $1 RETURNING *', client_id)
          .then(client => res.send(client))
          .catch((error)=>{
            res.sendStatus(500)
            console.error(error)
          })
      }).catch(() => {
        res.sendStatus(404)
      })
    })
}
