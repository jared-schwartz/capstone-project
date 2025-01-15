const { client } = require("./server")

const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";

const createTables = (async) => {
  const SQL = `  
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
        average_Score REAL,
        disabled BOOLEAN DEFAULT false
        );
    CREATE TABLE reviews(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        flavor_id UUID REFERENCES flavors(id) NOT NULL,
        posted TIMESTAMP default now(),
        content VARCHAR(500),
        score INTEGER
        );
    CREATE TABLE comments(
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id) NOT NULL,
        flavor_id UUID REFERENCES flavors(id) NOT NULL,
        posted TIMESTAMP default now(),
        content VARCHAR(500) NOT NULL
        );
    `;
};

const createReview = async ({ user_id, flavor_id, content, score }) => {
  const SQL = `
    INSERT INTO reviews(id, user_id, flavor_id, content, score) VALUES($1, $2, $3, $4, $5) RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, flavor_id, content, score]);
  return response.rows[0];
};

module.exports = {
  createTables,
  createReview
};
