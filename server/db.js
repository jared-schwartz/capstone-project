const pg = require("pg");
const { client } = require("server.js");
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
        average_Score REAL DEFAULT 0,
        disabled BOOLEAN DEFAULT false
        );
    CREATE TABLE reviews(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        flavor_id UUID REFERENCES flavors(id) NOT NULL,
        content VARCHAR(500),
        score INTEGER,
        username VARCHAR(20) UNIQUE NOT NULL;
        );
    CREATE TABLE comments(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        review_id UUID REFERENCES reviews(id) NOT NULL,
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

const createReview = async ({ user_id, flavor_id, content, score }) => {
  const SQL = `
    INSERT INTO reviews (id, user_id, flavor_id, content, score) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *`;

  const response = await client.query(SQL, [
    uuid.v4(), 
    user_id, 
    flavor_id, 
    content, 
    score
  ]);
  return response.rows[0];
};


const fetchUsers = async () => {
  const SQL = `
      SELECT id, username FROM users;
    `;
  const response = await client.query(SQL);
  return response.rows;
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
  createReview, 
};