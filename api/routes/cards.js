export default function registerCardsRoutes(app, db) {
    app.get('/clients/:clientId/accounts/:accountId/cards', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        db.manyOrNone('SELECT * FROM debit_card WHERE account_id = $1 AND deleted = FALSE ORDER BY id', req.params.accountId)
        .then(accounts => {
          res.send(accounts)
        }).catch(() => {
          res.sendStatus(400)
        })
      }).catch(() => {
        res.sendStatus(404)
      })
    })

    app.get('/clients/:clientId/accounts/:accountId/cards/:cardId', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
          db.one('SELECT * FROM debit_card WHERE id = $1 AND account_id = $2 AND deleted = FALSE ORDER BY id', [req.params.cardId, req.params.accountId])
          .then(accounts => {
            res.send(accounts)
          }).catch(() => {
            res.sendStatus(404)
          })
      }).catch(error => {
        res.sendStatus(404)
      })
    })

    app.post("/clients/:clientId/accounts/:accountId/cards", (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(async () => {
        let user = await db.one('SELECT * FROM bank_user WHERE id = $1 AND deleted = FALSE', client_id)
        db.one("INSERT INTO debit_card (first_name, last_name, card_number, code, account_id) VALUES ($1, $2, floor(random() * 1000000000000000), floor(random() * 10000), $3) RETURNING *", [user.first_name, user.last_name, req.params.accountId])
        .then((operation) => {
          res.send(operation)
        }).catch(error => {
          res.sendStatus(500)
          console.error(error)
        })
      }).catch(() => {
        res.sendStatus(404)
      })
    })

    app.delete('/clients/:clientId/accounts/:accountId/cards/:cardId', (req, res) => {
      const client_id = req.params.clientId
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
          db.one('UPDATE debit_card SET deleted = TRUE WHERE id = $1 AND account_id = $2 AND deleted = FALSE RETURNING *', [req.params.cardId, req.params.accountId])
          .then(card => {
            res.send(card)
          }).catch(() => {
            res.sendStatus(404)
          })
      }).catch(error => {
        res.sendStatus(404)
      })
    })
}
