// 📁 api/routes/clients.js

const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  // Exemples de données fictives protégées
  const fakeClients = [
    { id: 1, nom: "Alice Dupont", email: "alice@example.com" },
    { id: 2, nom: "Bob Martin", email: "bob@example.com" },
  ];

  res.render("pages/clients", { user: req.user, clients: fakeClients });
});

module.exports = router;



