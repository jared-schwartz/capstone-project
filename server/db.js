const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/drPepper_db"
);

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
        created_at TIMESTAME DEFAULD now(),
        description VARCHAR(255),
        photo_URL VARCHAR(255),
        average_Score REAL,
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
        content VARCHAR(500) NOT NULL,
        );
    `;
};
module.exports = {
  client,
  createTables,
};
