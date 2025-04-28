CREATE TYPE user_role AS ENUM ('employee', 'user');

CREATE TABLE IF NOT EXISTS bank_user (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(64),
  last_name VARCHAR(64),
  date_of_birth DATE,
  role user_role,
  username VARCHAR(64),
  password VARCHAR(64),
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS account (
  id SERIAL PRIMARY KEY,
  balance INT,
  client_id INT REFERENCES bank_user(id),
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS operation (
  id SERIAL PRIMARY KEY,
  value INT,
  description VARCHAR(255),
  account_id INT REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS debit_card (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(64),
  last_name VARCHAR(64),
  card_number VARCHAR(20),
  code INT,
  account_id INT NOT NULL REFERENCES account(id),
  deleted BOOLEAN DEFAULT FALSE
);

INSERT INTO bank_user (
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

INSERT INTO bank_user (
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
