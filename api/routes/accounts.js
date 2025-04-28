export default function registerAccountRoutes(app, db) {
    app.get('/clients/:clientId/accounts', (req, res) => {
      if (req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.manyOrNone('SELECT * FROM account WHERE client_id = $1 AND deleted = FALSE ORDER BY id', req.params.clientId)
        .then(accounts => {
        res.send(accounts)
      }).catch(error => {
        res.sendStatus(400)
        console.error(error)
      })
    })

    app.get('/clients/:clientId/accounts/:accountId', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        res.send(account)
      }).catch(error => {
        res.sendStatus(404)
        console.error(error)
      })
    })

    app.post("/clients/:clientId/accounts", (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one("INSERT INTO account (balance, client_id) VALUES (0, $1) RETURNING *", client_id)
      .then((account) => {
        res.send(account)
      }).catch(error => {
        res.sendStatus(500)
        console.error(error)
      })
    })

    app.delete('/clients/:clientId/accounts/:accountId', (req, res) => {
      const client_id = req.params.clientId
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(() => {
        db.one('UPDATE account SET deleted = TRUE WHERE id = $1 AND client_id = $2 AND deleted = FALSE RETURNING *', [req.params.accountId, client_id])
          .then(account => res.send(account))
          .catch((error)=>{
            res.sendStatus(500)
            console.error(error)
          })
      }).catch(() => {
        res.sendStatus(404)
      })
    })
}
