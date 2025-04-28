// =========================================
// Fichier : /api/routes/clients.js
// Rôle : Définir les routes pour l'API clients (backend) et la partie web (frontend EJS)
// =========================================

import express from 'express';
import {
  listClients,
  getClient,
  showCreateForm,
  createClient,
  showEditForm,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';

// Fonction principale pour enregistrer toutes les routes liées aux clients
export default function registerClientRoutes(app, db) {
  const router = express.Router(); // Créer un "mini" routeur pour ce module

  // ==============================
  // === Routes API REST (JSON brut) ===
  // ==============================

  // ➔ GET /clients/api : récupérer tous les clients (API JSON)
  router.get('/api', (req, res) => {
    db.manyOrNone('SELECT * FROM bank_user WHERE deleted = FALSE ORDER BY id')
      .then(clients => res.json(clients))
      .catch(error => {
        console.error('Erreur lors de la récupération des clients (API) :', error);
        res.status(500).json({ error: 'Erreur serveur' });
      });
  });

  // ➔ GET /clients/api/:id : récupérer un seul client par ID (API JSON)
  router.get('/api/:id', (req, res) => {
    db.oneOrNone('SELECT * FROM bank_user WHERE id = $1 AND deleted = FALSE', [req.params.id])
      .then(client => {
        if (!client) {
          res.status(404).json({ error: 'Client non trouvé' });
          return;
        }
        res.json(client);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du client (API) :', error);
        res.status(500).json({ error: 'Erreur serveur' });
      });
  });

  // ➔ POST /clients/api : ajouter un nouveau client (API JSON)
  router.post('/api', (req, res) => {
    const { first_name, last_name, date_of_birth } = req.body;
    if (!first_name || !last_name || !date_of_birth) {
      res.status(400).json({ error: 'Champs obligatoires manquants' });
      return;
    }

    db.one(
      "INSERT INTO bank_user (first_name, last_name, date_of_birth, role, username, password) VALUES ($1, $2, $3, 'user', $4, $5) RETURNING *",
      [first_name, last_name, date_of_birth, first_name.toLowerCase(), '1234']
    )
      .then(client => res.status(201).json(client))
      .catch(error => {
        console.error('Erreur lors de la création du client (API) :', error);
        res.status(500).json({ error: 'Erreur serveur' });
      });
  });

  // ➔ PUT /clients/api/:id : modifier un client existant (API JSON)
  router.put('/api/:id', (req, res) => {
    const { first_name, last_name, date_of_birth } = req.body;

    db.oneOrNone(
      "UPDATE bank_user SET first_name = $1, last_name = $2, date_of_birth = $3 WHERE id = $4 RETURNING *",
      [first_name, last_name, date_of_birth, req.params.id]
    )
      .then(client => {
        if (!client) {
          res.status(404).json({ error: 'Client non trouvé' });
          return;
        }
        res.json(client);
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du client (API) :', error);
        res.status(500).json({ error: 'Erreur serveur' });
      });
  });

  // ➔ DELETE /clients/api/:id : suppression d'un client (soft delete)
  router.delete('/api/:id', (req, res) => {
    db.result('UPDATE bank_user SET deleted = TRUE WHERE id = $1', [req.params.id])
      .then(result => {
        if (result.rowCount === 0) {
          res.status(404).json({ error: 'Client non trouvé' });
          return;
        }
        res.json({ message: 'Client supprimé avec succès' });
      })
      .catch(error => {
        console.error('Erreur lors de la suppression du client (API) :', error);
        res.status(500).json({ error: 'Erreur serveur' });
      });
  });

  // ==============================
  // === Routes Vue EJS (pages HTML générées côté serveur) ===
  // ==============================

  // ➔ GET /clients/ : liste des clients (affichage EJS)
  router.get('/', listClients(db));

  // ➔ GET /clients/create : afficher le formulaire de création
  router.get('/create', showCreateForm());

  // ➔ POST /clients/ : envoyer les données pour créer un client
  router.post('/', createClient(db));

  // ➔ GET /clients/:id : afficher un client précis (affichage EJS)
  router.get('/:id', getClient(db));

  // ➔ GET /clients/:id/edit : afficher le formulaire de modification
  router.get('/:id/edit', showEditForm(db));

  // ➔ POST /clients/:id : envoyer les modifications d'un client
  router.post('/:id', updateClient(db));

  // ➔ POST /clients/:id/delete : suppression d'un client depuis l'IHM
  router.post('/:id/delete', deleteClient(db));

  // On "monte" le routeur sous /clients
  app.use('/clients', router);
}
