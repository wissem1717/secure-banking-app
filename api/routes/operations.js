export default function registerOperationRoutes(app, db) {
    app.get('/clients/:clientId/accounts/:accountId/operations', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        db.manyOrNone('SELECT * FROM operation WHERE account_id = $1 ORDER BY id', req.params.accountId)
        .then(accounts => {
          res.send(accounts)
        }).catch(() => {
          res.sendStatus(400)
        })
      }).catch(() => {
        res.sendStatus(404)
      })

      
    })

    app.get('/clients/:clientId/accounts/:accountId/operations/:operationId', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
          db.one('SELECT * FROM operation WHERE id = $1 AND account_id = $2 ORDER BY id', [req.params.operationId, req.params.accountId])
          .then(accounts => {
            res.send(accounts)
          }).catch(() => {
            res.sendStatus(400)
          })
      }).catch(error => {
        res.sendStatus(404)
      })
    })

    app.post("/clients/:clientId/accounts/:accountId/operations", (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        db.one("INSERT INTO operation (value, description, account_id) VALUES ($1, $2, $3) RETURNING *", [req.body.value, req.body.desc, req.params.accountId])
        .then((operation) => {
          db.none("UPDATE account SET balance = $1 WHERE id = $2", [account.balance + req.body.value, req.params.accountId])
          res.send(operation)
        }).catch(error => {
          res.sendStatus(500)
          console.error(error)
        })
      }).catch(() => {
        res.sendStatus(404)
      })
    })

    app.delete('/clients/:clientId/accounts/:accountId/operations/:operationId', (req, res) => {
      const client_id = req.params.clientId
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        db.one('SELECT * FROM operation WHERE id = $1 AND account_id = $2', [req.params.operationId, req.params.accountId])
          .then(operation => {
            db.none('DELETE FROM operation WHERE id = $1 AND account_id = $2', [req.params.operationId, req.params.accountId])
            db.none("UPDATE account SET balance = $1 WHERE id = $2", [account.balance - operation.value, req.params.accountId])
            res.send(operation)
          })
          .catch((error)=>{
            res.sendStatus(404)
            console.error(error)
          })
      }).catch(() => {
        res.sendStatus(404)
      })
    })
}
