const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/drPepper_db"
);

const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

const createTables = async () => {
  const SQL = `  
  DROP TABLE IF EXISTS comments;
  DROP TABLE IF EXISTS reviews;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS flavors;

    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        photo_URL VARCHAR(255)
        );

    CREATE TABLE flavors(
        id UUID PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        description VARCHAR(255),
        photo_URL VARCHAR(255),
        average_Score REAL DEFAULT 5,
        disabled BOOLEAN DEFAULT false
        );
    CREATE TABLE reviews(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        flavor_id UUID REFERENCES flavors(id) NOT NULL,
        content VARCHAR(500),
        score INTEGER
        );
    CREATE TABLE comments(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        flavor_id UUID REFERENCES flavors(id) NOT NULL,
        content VARCHAR(500) NOT NULL
        );
    `;
  await client.query(SQL);
};

const createUser = async ({ username, password, photo_URL }) => {
  const SQL = `
      INSERT INTO users(id, username, password, photo_URL) VALUES($1, $2, $3, $4) RETURNING *
    `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
    photo_URL,
  ]);
  return response.rows[0];
};

const createFlavor = async ({ name, description, photo_URL }) => {
  const SQL = `
        INSERT INTO flavors(id, name, description, photo_URL) VALUES($1, $2, $3, $4) RETURNING *
      `;
  const response = await client.query(SQL, [
    uuid.v4(),
    name,
    description,
    photo_URL,
  ]);
  return response.rows[0];
};

const fetchUsers = async () => {
  const SQL = `
      SELECT * FROM users;
    `;
  const response = await client.query(SQL);
  console.log(response);
  return response.rows;
};

const fetchUserById = async (id) => {
  const SQL = `
    SELECT * FROM users
    WHERE id = $1
    ;
    `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};

const fetchFlavors = async () => {
  const SQL = `
    SELECT * FROM flavors;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  createFlavor,
  fetchFlavors,
  fetchUserById,
};
