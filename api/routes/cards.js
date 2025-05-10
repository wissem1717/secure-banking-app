export default function registerCardsRoutes(app, db) {
    // Récupérer toutes les cartes d’un compte
    app.get('/clients/:clientId/accounts/:accountId/cards', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401); // accès refusé si non autorisé
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        db.manyOrNone('SELECT * FROM debit_card WHERE account_id = $1 AND deleted = FALSE ORDER BY id', req.params.accountId)
        .then(accounts => {
          res.send(accounts); // renvoie les cartes bancaires liées au compte
        }).catch(() => {
          res.sendStatus(400); // erreur SQL
        })
      }).catch(() => {
        res.sendStatus(404); // compte introuvable
      })
    })

    // Récupérer une carte précise d’un compte
    app.get('/clients/:clientId/accounts/:accountId/cards/:cardId', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401); // sécurité
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
          db.one('SELECT * FROM debit_card WHERE id = $1 AND account_id = $2 AND deleted = FALSE ORDER BY id', [req.params.cardId, req.params.accountId])
          .then(accounts => {
            res.send(accounts); // renvoie la carte demandée
          }).catch(() => {
            res.sendStatus(404); // carte introuvable
          })
      }).catch(error => {
        res.sendStatus(404); // compte introuvable
      })
    })

    // Créer une nouvelle carte pour un compte
    app.post("/clients/:clientId/accounts/:accountId/cards", (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401); // sécurité
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(async () => {
        let user = await db.one('SELECT * FROM bank_user WHERE id = $1 AND deleted = FALSE', client_id)
        db.one("INSERT INTO debit_card (first_name, last_name, card_number, code, account_id) VALUES ($1, $2, floor(random() * 1000000000000000), floor(random() * 10000), $3) RETURNING *", [user.first_name, user.last_name, req.params.accountId])
        .then((operation) => {
          res.send(operation); // renvoie la carte nouvellement créée
        }).catch(error => {
          res.sendStatus(500); // erreur lors de l’insertion
          console.error(error);
        })
      }).catch(() => {
        res.sendStatus(404); // compte introuvable
      })
    })

    // Supprimer une carte (logiquement)
    app.delete('/clients/:clientId/accounts/:accountId/cards/:cardId', (req, res) => {
      const client_id = req.params.clientId
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401); // accès refusé
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
          db.one('UPDATE debit_card SET deleted = TRUE WHERE id = $1 AND account_id = $2 AND deleted = FALSE RETURNING *', [req.params.cardId, req.params.accountId])
          .then(card => {
            res.send(card); // renvoie la carte supprimée (logiquement)
          }).catch(() => {
            res.sendStatus(404); // carte introuvable
          })
      }).catch(error => {
        res.sendStatus(404); // compte introuvable
      })
    })
}
