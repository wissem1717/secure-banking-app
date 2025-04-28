# Utiliser une image officielle Node.js
FROM node:20

# Définir le dossier de travail dans le conteneur
WORKDIR /app

# Copier uniquement package.json et package-lock.json d'abord
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet dans le conteneur
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application
CMD ["node", "index.js"]
