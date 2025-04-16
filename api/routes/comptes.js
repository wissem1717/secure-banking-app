const express = require("express");
const fs = require("fs");
const path = require("path");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
const comptesFile = path.join(__dirname, "../data/comptes.json");

// 📦 Lire les comptes
function getComptes() {
  const data = fs.readFileSync(comptesFile, "utf-8");
  return JSON.parse(data);
}

// 💾 Sauvegarder les comptes
function saveComptes(comptes) {
  fs.writeFileSync(comptesFile, JSON.stringify(comptes, null, 2));
}

// ✅ GET /comptes (afficher)
router.get("/", verifyToken, (req, res) => {
  const comptes = getComptes();
  res.render("pages/comptes", { comptes });
});

// ✅ POST /comptes (ajouter)
router.post("/", verifyToken, (req, res) => {
  const { numero, solde } = req.body;
  const comptes = getComptes();
  const newCompte = {
    id: comptes.length ? comptes[comptes.length - 1].id + 1 : 1,
    numero,
    solde: parseFloat(solde)
  };
  comptes.push(newCompte);
  saveComptes(comptes);
  res.redirect("/comptes");
});

// ✅ POST /comptes/delete/:id (supprimer)
router.post("/delete/:id", verifyToken, (req, res) => {
  const id = parseInt(req.params.id);
  let comptes = getComptes();
  comptes = comptes.filter(compte => compte.id !== id);
  saveComptes(comptes);
  res.redirect("/comptes");
});

module.exports = router;
