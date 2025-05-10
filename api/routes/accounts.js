export default function registerAccountRoutes(app, db) {
    // Récupérer tous les comptes d’un client
    app.get('/clients/:clientId/accounts', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401); // accès interdit si non employé ou non propriétaire
        return;
      }
      db.manyOrNone('SELECT * FROM account WHERE client_id = $1 AND deleted = FALSE ORDER BY id', req.params.clientId)
        .then(accounts => {
        res.send(accounts) // renvoie la liste des comptes actifs
      }).catch(error => {
        res.sendStatus(400) // erreur requête SQL
        console.error(error)
      })
    })

    // Récupérer un compte spécifique
    app.get('/clients/:clientId/accounts/:accountId', (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401); // accès refusé si pas autorisé
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(account => {
        res.send(account) // renvoie les infos du compte
      }).catch(error => {
        res.sendStatus(404) // compte non trouvé
      })
    })

    // Créer un nouveau compte pour un client
    app.post("/clients/:clientId/accounts", (req, res) => {
      const client_id = req.params.clientId;
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401); // sécurité : seul l’employé ou l’utilisateur concerné peut créer
        return;
      }
      db.one("INSERT INTO account (balance, client_id) VALUES (0, $1) RETURNING *", client_id)
      .then((account) => {
        res.send(account) // renvoie le compte créé
      }).catch(error => {
        res.sendStatus(500) // erreur lors de l’insertion
        console.error(error)
      })
    })

    // Supprimer un compte (logiquement)
    app.delete('/clients/:clientId/accounts/:accountId', (req, res) => {
      const client_id = req.params.clientId
      if (req.auth.user_id != client_id && req.auth.role != 'employee') {
        res.sendStatus(401); // vérifie les droits d’accès
        return;
      }
      db.one('SELECT * FROM account WHERE id = $1 AND client_id = $2 AND deleted = FALSE', [req.params.accountId, client_id])
        .then(() => {
        db.one('UPDATE account SET deleted = TRUE WHERE id = $1 AND client_id = $2 AND deleted = FALSE RETURNING *', [req.params.accountId, client_id])
          .then(account => res.send(account)) // renvoie le compte mis à jour
          .catch((error)=>{
            res.sendStatus(500) // erreur SQL update
            console.error(error)
          })
      }).catch(() => {
        res.sendStatus(404) // compte introuvable
      })
    })
}
