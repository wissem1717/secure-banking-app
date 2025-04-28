// api/controllers/clientController.js

// ===============================
//  Contrôleur : Gestion des Clients
// ===============================
// === Lister tous les clients ===
export function listClients(db) {
  return (req, res) => {
    db.manyOrNone('SELECT * FROM bank_user WHERE deleted = FALSE ORDER BY id')
      .then(clients => {
        res.render('clients/list', { clients });  // Affiche la liste dans la vue 'list'
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des clients :', error);
        res.status(500).send('Erreur serveur');
      });
  };
}

// === Afficher le détail d'un client ===
export function getClient(db) {
  return (req, res) => {
    const clientId = req.params.id;  // Récupère l'id dans l'URL
    db.oneOrNone('SELECT * FROM bank_user WHERE id = $1 AND deleted = FALSE', [clientId])
      .then(client => {
        if (!client) {
          res.status(404).send('Client non trouvé');
          return;
        }
        res.render('clients/detail', { client });  // Affiche le client dans la vue 'detail'
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du client :', error);
        res.status(500).send('Erreur serveur');
      });
  };
}

// === Afficher le formulaire d'ajout ===
export function showCreateForm() {
  return (req, res) => {
    res.render('clients/create');  // Charge simplement le formulaire vide
  };
}

// === Créer un nouveau client ===
export function createClient(db) {
  return (req, res) => {
    const { first_name, last_name, date_of_birth } = req.body;

    // Vérifie que tous les champs obligatoires sont remplis
    if (!first_name || !last_name || !date_of_birth) {
      res.status(400).send('Champs obligatoires manquants');
      return;
    }

    // Insère le nouveau client avec des valeurs par défaut pour username et password
    db.one(
      'INSERT INTO bank_user (first_name, last_name, date_of_birth, role, username, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [first_name, last_name, date_of_birth, 'user', first_name.toLowerCase(), '1234']
    )
      .then(() => {
        res.redirect('/clients');  // Redirige vers la liste des clients après création
      })
      .catch(error => {
        console.error('Erreur lors de la création du client :', error);
        res.status(500).send('Erreur serveur');
      });
  };
}

// === Afficher le formulaire de modification ===
export function showEditForm(db) {
  return (req, res) => {
    const clientId = req.params.id;
    db.oneOrNone('SELECT * FROM bank_user WHERE id = $1 AND deleted = FALSE', [clientId])
      .then(client => {
        if (!client) {
          res.status(404).send('Client non trouvé');
          return;
        }
        res.render('clients/edit', { client });  // Charge la vue d'édition avec les données du client
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du client :', error);
        res.status(500).send('Erreur serveur');
      });
  };
}

// === Modifier un client existant ===
export function updateClient(db) {
  return (req, res) => {
    const clientId = req.params.id;
    const { first_name, last_name, date_of_birth } = req.body;

    db.oneOrNone(
      'UPDATE bank_user SET first_name = $1, last_name = $2, date_of_birth = $3 WHERE id = $4 RETURNING *',
      [first_name, last_name, date_of_birth, clientId]
    )
      .then(client => {
        if (!client) {
          res.status(404).send('Client non trouvé');
          return;
        }
        res.redirect('/clients');  // Redirige vers la liste après la mise à jour
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du client :', error);
        res.status(500).send('Erreur serveur');
      });
  };
}

// === Supprimer un client (suppression douce = soft delete) ===
export function deleteClient(db) {
  return (req, res) => {
    const clientId = req.params.id;

    db.result('UPDATE bank_user SET deleted = TRUE WHERE id = $1', [clientId])
      .then(result => {
        if (result.rowCount === 0) {
          res.status(404).send('Client non trouvé');
          return;
        }
        res.redirect('/clients');  // Redirige vers la liste après suppression
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du client :', error);
        res.status(500).send('Erreur serveur');
      });
  };
}
