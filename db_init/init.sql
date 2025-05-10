CREATE TYPE user_role AS ENUM ('employee', 'user'); -- Déclaration d'un type énuméré pour le rôle utilisateur

CREATE TABLE IF NOT EXISTS bank_user ( -- Table des utilisateurs (clients ou employés)
  id SERIAL PRIMARY KEY, -- Identifiant unique auto-incrémenté
  first_name VARCHAR(64), -- Prénom
  last_name VARCHAR(64), -- Nom
  date_of_birth DATE, -- Date de naissance
  role user_role, -- Rôle de l'utilisateur (user ou employee)
  username VARCHAR(64), -- Nom d'utilisateur pour la connexion
  password VARCHAR(64), -- Mot de passe (à chiffrer idéalement)
  deleted BOOLEAN DEFAULT FALSE -- Suppression logique (soft delete)
);

CREATE TABLE IF NOT EXISTS account ( -- Table des comptes bancaires
  id SERIAL PRIMARY KEY, -- Identifiant du compte
  balance INT, -- Solde actuel du compte
  client_id INT REFERENCES bank_user(id), -- Référence au client propriétaire du compte
  deleted BOOLEAN DEFAULT FALSE -- Suppression logique
);

CREATE TABLE IF NOT EXISTS operation ( -- Table des opérations bancaires (crédit ou débit)
  id SERIAL PRIMARY KEY, -- Identifiant unique de l’opération
  value INT, -- Montant de l’opération (positif ou négatif)
  description VARCHAR(255), -- Description ou libellé de l’opération
  account_id INT REFERENCES account(id) -- Référence au compte concerné
);

CREATE TABLE IF NOT EXISTS debit_card ( -- Table des cartes bancaires associées à un compte
  id SERIAL PRIMARY KEY, -- Identifiant de la carte
  first_name VARCHAR(64), -- Prénom sur la carte
  last_name VARCHAR(64), -- Nom sur la carte
  card_number VARCHAR(20), -- Numéro unique de la carte
  code INT, -- Code secret (PIN)
  account_id INT NOT NULL REFERENCES account(id), -- Compte bancaire associé
  deleted BOOLEAN DEFAULT FALSE -- Suppression logique
);

INSERT INTO bank_user ( -- Insertion d’un utilisateur employé par défaut
  first_name,
  last_name,
  date_of_birth,
  "role",
  username,
  "password"
) VALUES (
  'Jacques',
  'HAUSER',
  '2000-01-02',
  'employee',
  'emp',
  'emp'
);

INSERT INTO bank_user ( -- Insertion d’un utilisateur client par défaut
  first_name,
  last_name,
  date_of_birth,
  "role",
  username,
  "password"
) VALUES (
  'Paul',
  'PIPETTE',
  '2000-01-02',
  'user',
  'user',
  'user'
);
