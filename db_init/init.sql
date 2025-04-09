CREATE TABLE IF NOT EXISTS employee (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS client (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255),
  last_name VARCHAR(20),
  date_of_birth DATE
);

CREATE TABLE IF NOT EXISTS account (
  id SERIAL PRIMARY KEY,
  balance INT,
  client_id INT REFERENCES client(id)
);

CREATE TABLE IF NOT EXISTS operation (
  id SERIAL PRIMARY KEY,
  value INT,
  account_id INT REFERENCES account(id)
);

CREATE TABLE IF NOT EXISTS debit_card (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(20),
  last_name VARCHAR(20),
  card_number VARCHAR(20),
  code INT,
  account_id INT NOT NULL REFERENCES account(id)
);
