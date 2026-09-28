# Secure Banking App

[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtoken&logoColor=white)]()
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

> Application bancaire full-stack avec authentification par rôle (employé / client) : gestion des clients, comptes, cartes et opérations. Back-end **Express + PostgreSQL** sécurisé par **JWT**, front-end **React + TypeScript (Vite)**.

Projet réalisé par **Teiva Tesson** et **Wissem Chedly**.

## Architecture

```
┌─────────────────┐       HTTP/JWT        ┌──────────────────┐        SQL        ┌──────────────┐
│  front (React/TS) │ ────────────────────▶ │  api (Express)      │ ─────────────────▶ │  PostgreSQL     │
│  Vite, port 4173   │ ◀──────────────────── │  port 3000            │ ◀───────────────── │  (db_init/*.sql) │
└─────────────────┘                        └──────────────────┘                    └──────────────┘
```

- **`api/`** — API REST Express (ESM). Authentification par JWT (`express-jwt`), routes protégées par rôle (`employee` / `user`), connexion PostgreSQL via `pg-promise`.
- **`front/`** — Interface React + TypeScript (Vite). Vues différenciées employé (gestion de tous les clients) et client (ses propres comptes, cartes, opérations).
- **`db_init/`** — Schéma SQL (`bank_user`, `account`, `card`, `operation`) et jeu de données de démonstration, chargé automatiquement par le conteneur PostgreSQL au premier démarrage.

## Fonctionnalités / routes API

| Ressource | Routes |
|---|---|
| Clients | `GET /clients`, `GET /clients/:id`, `POST /clients`, `PUT /clients/:id`, `DELETE /clients/:id` |
| Comptes | `GET /clients/:clientId/accounts[/:accountId]`, `POST`, `DELETE` |
| Cartes | `GET /clients/:clientId/accounts/:accountId/cards[/:cardId]`, `POST`, `DELETE` |
| Opérations | `GET /clients/:clientId/accounts/:accountId/operations[/:operationId]`, `POST`, `DELETE` |

Toutes les routes (hors login) sont protégées par un middleware JWT (`express-jwt`) ; les suppressions sont des **soft delete** (colonne `deleted`).

## Lancer le projet

1. Installer [Docker](https://www.docker.com/) (ou Docker Desktop).
2. Dupliquer `.env.example` en `.env` et renseigner les valeurs :
   ```
   DB_USER=postgres
   DB_PASSWORD=<mot de passe de votre choix>
   JWT_SECRET_KEY=<généré avec: openssl rand -base64 32>
   ```
3. Démarrer les conteneurs :
   ```bash
   docker compose up -d --build
   ```
4. Ouvrir [http://localhost:4173](http://localhost:4173).
5. Pour arrêter :
   ```bash
   docker compose down
   ```

## Comptes de test

Le schéma d'initialisation (`db_init/init.sql`) crée deux comptes de démonstration :

| Rôle | Identifiant | Mot de passe |
|---|---|---|
| Employé | `emp` | `emp` |
| Client | `user` | `user` |

> Identifiants de démo uniquement — à ne jamais utiliser tels quels en production.

## Sécurité

- Authentification **JWT** (HS256), clé secrète chargée depuis la variable d'environnement `JWT_SECRET_KEY` (jamais codée en dur dans le code source).
- Séparation des rôles côté API (`employee` / `user`) sur chaque route sensible.
- Suppression logique (soft delete) plutôt que suppression physique, pour la traçabilité.

## Structure du projet

```
secure-banking-app/
├── api/                Backend Express (routes, middleware JWT, connexion PostgreSQL)
│   └── routes/           clients.js · accounts.js · cards.js · operations.js
├── front/               Frontend React + TypeScript (Vite)
│   └── src/               components, hooks (useAuth), routes
├── db_init/             Schéma SQL + données de démonstration
└── docker-compose.yml   Orchestration front / api / PostgreSQL
```

## Ce que ce projet démontre

- Conception d'une **API REST** sécurisée avec authentification par **JWT** et autorisation par rôle
- Modélisation d'un schéma relationnel PostgreSQL (utilisateurs, comptes, cartes, opérations)
- Développement front-end **React + TypeScript** consommant une API authentifiée
- Orchestration multi-conteneurs avec **Docker Compose** et gestion des secrets via variables d'environnement

---

*Projet académique réalisé en binôme (Teiva Tesson & Wissem Chedly).*
