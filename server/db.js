
const { client } = require("./server.js");

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
        id SERIAL PRIMARY KEY,
        username VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        photo_URL VARCHAR(255),
        is_Admin BOOLEAN DEFAULT false
        );

    CREATE TABLE flavors(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        description VARCHAR(255),
        photo_URL VARCHAR(255),
        average_Score REAL DEFAULT 0,
        disabled BOOLEAN DEFAULT false
        );
    CREATE TABLE reviews(
        id SERIAL PRIMARY KEY,
        user_id SERIAL REFERENCES users(id) NOT NULL,
        flavor_id SERIAL REFERENCES flavors(id) NOT NULL,
        content VARCHAR(500),
        score INTEGER
        );
    CREATE TABLE comments(
        id SERIAL PRIMARY KEY,
        user_id SERIAL REFERENCES users(id) NOT NULL,
        review_id SERIAL REFERENCES reviews(id) NOT NULL,
        content VARCHAR(500) NOT NULL
        );
    `;
  await client.query(SQL);
};

const seedData = async () => {
  createUser({ username: "johnathan", password: "j", photo_URL: "" });
  createFlavor({ name: "Dr Pepper Original", description: "good", photo_URL: "https://i5.walmartimages.com/seo/Doctor-Pepper-Soda-12oz-Cans-Pack-of-48_f311a391-8c1c-4b38-b7f7-788d26359f44.4eb13d8fade9191d2c4f05fdc7cca03f.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF" }),
    createFlavor({ name: "Dr Pepper Vanilla Float", description: "good", photo_URL: "https://i5.walmartimages.com/asr/1e49efb6-01c2-415f-9965-29e15fc3432d.cc510533258805a04cb12e8d5501ca94.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" }),
    createFlavor({ name: "Dr Pepper Cherry", description: "good", photo_URL: "https://images.albertsons-media.com/is/image/ABS/960022623-R001?$ng-ecom-pdp-mobile$&defaultImage=Not_Available" }),
    createFlavor({ name: "Diet Dr Pepper", description: "good", photo_URL: "https://i5.walmartimages.com/asr/097a28e0-cb1d-4ce9-916c-16b4b8d395a9.1e4e4705ac25584781fadea7ee4768d1.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" }),
    createFlavor({ name: "Dr Pepper Strawberries & Cream", description: "good", photo_URL: "https://i5.walmartimages.com/asr/028be2fd-151e-4a7a-9438-c6d140e76001.4a9f1df900d85b116abb7b8cde88ed47.jpeg" }),
    createFlavor({ name: "Dr Pepper Creamy Coconut", description: "good", photo_URL: "https://www.kroger.com/product/images/large/back/0007800003871" }),
    createFlavor({ name: "Dr Pepper Dark Berry", description: "good", photo_URL: "https://i5.walmartimages.com/asr/e663d659-1a5f-422e-94b7-1f5abd3c60fb.0358507f00c74fb01e767a15ea6fa417.jpeg" }),
    createFlavor({ name: "Dr Pepper Cherry Vanilla", description: "good", photo_URL: "https://sweetkingdoms.com/wp-content/uploads/2023/11/DR-PEPPER-CHERRY-VANILLA.webp" }),
    createFlavor({ name: "Dr Pepper Cream Soda", description: "good", photo_URL: "https://i.ebayimg.com/images/g/3k4AAOSwSAFhKJAQ/s-l1200.jpg" }),
    createFlavor({ name: "Dr Pepper Original (Real Sugar)", description: "good", photo_URL: "https://m.media-amazon.com/images/I/61kw9c37qRL.jpg" })
};

const createUser = async ({ username, password }) => {
  const SQL = `
      INSERT INTO users(username, password, photo_URL) VALUES($1, $2, $3) RETURNING *
    `;
  const response = await client.query(SQL, [
    username,
    await bcrypt.hash(password, 5),
    photo_URL,
  ]);
  return response.rows[0];
};

const createFlavor = async ({ name, description, photo_URL }) => {
  const SQL = `
    INSERT INTO flavors (name, description, photo_URL) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const response = await client.query(SQL, [name, description, photo_URL]);
  return response.rows[0];
};

const createReview = async ({ user_id, flavor_id, content, score }) => {
  const SQL = `
    INSERT INTO reviews (user_id, flavor_id, content, score) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *`;

  const response = await client.query(SQL, [
    user_id,
    flavor_id,
    content,
    score
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
  seedData
};