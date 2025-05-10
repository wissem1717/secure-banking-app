export default function registerOperationRoutes(app, db) {
    // Récupère toutes les opérations d’un compte donné
    app.get('/clients/:clientId/accounts/:accountId/operations', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') { // sécurité d’accès
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        db.manyOrNone('SELECT * FROM operation WHERE account_id = $1 ORDER BY id', req.params.accountId)
        .then(accounts => {
          res.send(accounts); // renvoie la liste d'opérations
        }).catch(() => {
          res.sendStatus(400); // erreur récupération
        })
      }).catch(() => {
        res.sendStatus(404); // compte introuvable
      })
    });

    // Récupère une opération précise
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
            res.send(accounts); // envoie l’opération ciblée
          }).catch(() => {
            res.sendStatus(400); // erreur récupération opération
          })
      }).catch(error => {
        res.sendStatus(404); // compte introuvable
      })
    });

    // Ajoute une opération sur un compte
    app.post("/clients/:clientId/accounts/:accountId/operations", (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        db.one("INSERT INTO operation (value, description, account_id) VALUES ($1, $2, $3) RETURNING *", [req.body.value, req.body.description, req.params.accountId])
        .then((operation) => {
          db.none("UPDATE account SET balance = $1 WHERE id = $2", [account.balance + req.body.value, req.params.accountId]); // mise à jour du solde
          res.send(operation); // renvoie l’opération créée
        }).catch(error => {
          res.sendStatus(500);
          console.error(error);
        })
      }).catch(() => {
        res.sendStatus(404); // compte introuvable
      })
    });

    // Supprime une opération et met à jour le solde
    app.delete('/clients/:clientId/accounts/:accountId/operations/:operationId', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401);
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        db.one('SELECT * FROM operation WHERE id = $1 AND account_id = $2', [req.params.operationId, req.params.accountId])
          .then(operation => {
            db.none('DELETE FROM operation WHERE id = $1 AND account_id = $2', [req.params.operationId, req.params.accountId]); // suppression
            db.none("UPDATE account SET balance = $1 WHERE id = $2", [account.balance - operation.value, req.params.accountId]); // maj solde
            res.send(operation); // retour de l’opération supprimée
          })
          .catch((error)=>{
            res.sendStatus(404); // opération introuvable
            console.error(error);
          })
      }).catch(() => {
        res.sendStatus(404); // compte introuvable
      })
    })
}
