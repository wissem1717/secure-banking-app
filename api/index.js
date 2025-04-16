// 📁 api/index.js

const express = require("express");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");

const verifyToken = require("./middleware/verifyToken");
const clientsRoutes = require("./routes/clients"); // Assure-toi que ce fichier existe
// const comptesRoutes = require("./routes/comptes"); // décommente si tu l’as

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

// View engine EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Route de base — Page de login
app.get("/", (req, res) => {
  res.render("pages/login", { error: null });
});

// Route POST /login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const usersPath = path.join(__dirname, "data", "users.json");

  try {
    const users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, message: "❌ Email incorrect !" });
    }

    const isPasswordOk = bcrypt.compareSync(password, user.password);
    if (!isPasswordOk) {
      return res.status(401).json({ success: false, message: "❌ Mot de passe incorrect !" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, "TOP_SECRET_KEY", {
      expiresIn: "1h",
    });

    // Stocke le token dans un cookie HTTP Only
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // mettre true si HTTPS
      maxAge: 3600000,
    });

    return res.status(200).json({ success: true, message: "✅ Connexion réussie", token });
  } catch (err) {
    console.error("Erreur login:", err.message);
    return res.status(500).json({ success: false, message: "🔥 Erreur serveur" });
  }
});

// ✅ Routes protégées
app.use("/clients", verifyToken, clientsRoutes);
// app.use("/comptes", verifyToken, comptesRoutes); // décommente si tu veux

// ▶️ Serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur http://localhost:${PORT}`);
});


