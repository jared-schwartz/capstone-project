const { client } = require("./server")

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";
const uuid = require("uuid");

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
        photo_URL VARCHAR(255),
        is_admin BOOLEAN DEFAULT false
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

const seedData = async () => {
  await createUser({ username: "jesse", password: "j", photo_URL: "", is_admin: true });
  await createUser({ username: "jared", password: "j", photo_URL: "", is_admin: true });
  await createUser({ username: "karl", password: "k", photo_URL: "", is_admin: true });
  await createUser({ username: "joanathan", password: "j", photo_URL: "", is_admin: true });

  await createFlavor({ 
    name: "Dr Pepper Original", 
    description: "Original 23 flavor blend.", 
    photo_URL: "https://i5.walmartimages.com/seo/Doctor-Pepper-Soda-12oz-Cans-Pack-of-48_f311a391-8c1c-4b38-b7f7-788d26359f44.4eb13d8fade9191d2c4f05fdc7cca03f.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Dr Pepper Vanilla Float", 
    description: "Vanilla float style flavor that tastes like a Dr Pepper Float.", 
    photo_URL: "https://i5.walmartimages.com/asr/1e49efb6-01c2-415f-9965-29e15fc3432d.cc510533258805a04cb12e8d5501ca94.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Dr Pepper Cherry", 
    description: "Original 23 flavor blend with cherry flavor added in.", 
    photo_URL: "https://images.albertsons-media.com/is/image/ABS/960022623-R001?$ng-ecom-pdp-mobile$&defaultImage=Not_Available" });
  await createFlavor({ 
    name: "Diet Dr Pepper",
    description: "Diet version of the original 23 flavor blend.", 
    photo_URL: "https://i5.walmartimages.com/asr/097a28e0-cb1d-4ce9-916c-16b4b8d395a9.1e4e4705ac25584781fadea7ee4768d1.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Dr Pepper Strawberries & Cream",
    description: "good", 
    photo_URL: "https://i5.walmartimages.com/asr/028be2fd-151e-4a7a-9438-c6d140e76001.4a9f1df900d85b116abb7b8cde88ed47.jpeg" });
  await createFlavor({ 
    name: "Dr Pepper Creamy Coconut",
    description: "good", 
    photo_URL: "https://www.kroger.com/product/images/large/back/0007800003871" });
  await createFlavor({ 
    name: "Dr Pepper Dark Berry",
    description: "good", 
    photo_URL: "https://i5.walmartimages.com/asr/e663d659-1a5f-422e-94b7-1f5abd3c60fb.0358507f00c74fb01e767a15ea6fa417.jpeg" });
  await createFlavor({ 
    name: "Dr Pepper Cherry Vanilla",
    description: "good", 
    photo_URL: "https://sweetkingdoms.com/wp-content/uploads/2023/11/DR-PEPPER-CHERRY-VANILLA.webp" });
  await createFlavor({ 
    name: "Dr Pepper Cream Soda",
    description: "good", 
    photo_URL: "https://i.ebayimg.com/images/g/3k4AAOSwSAFhKJAQ/s-l1200.jpg" });
  await createFlavor({ 
    name: "Dr Pepper Original (Real Sugar)",
    description: "good", 
    photo_URL: "https://m.media-amazon.com/images/I/61kw9c37qRL.jpg" });
  await createFlavor({ 
    name: "Dr Pepper Zero Sugar",
    description: "good", 
    photo_URL: "https://i5.walmartimages.com/asr/99826e18-22e2-4042-aaa2-7607e3d4a5ca.95aa7add0df607e4a75cbf3fba435a24.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Dr Pepper Zero Sugar Cream Soda",
    description: "good", 
    photo_URL: "https://i5.walmartimages.com/asr/df4e75c2-7b42-48f6-b41b-cc263fc04fc2.741691a64738160dc574aa739f3e49ee.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Dr Pepper Zero Sugar Strawberries & Cream" ,
    description: "good", 
    photo_URL: "https://i5.walmartimages.com/asr/1bf5a211-609f-4724-b3d1-01034c647ae6.abf8a0672d8fd588064d9b7176f00cbf.jpeg" });
  await createFlavor({ 
    name: "Dr Pepper Zero Sugar Creamy Coconut",
    description: "good", 
    photo_URL: "https://www.kroger.com/product/images/large/back/0007800003873" });
  await createFlavor({ 
    name: "Diet Cherry Vanilla Dr Pepper",
    description: "good", 
    photo_URL: "https://www.kroger.com/product/images/large/right/0007800008916" });
  await createFlavor({ 
    name: "Dr Pepper Caffeine Free",
    description: "good", 
    photo_URL: "https://i5.walmartimages.com/asr/64ba3b05-a891-4760-a95f-13dd04c8e750.6bd4fcfff89f2b81de25b8dfb6401ee7.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Diet Dr Pepper Caffeine Free",
    description: "good", 
    photo_URL: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRo5BHtgzIgfs5FTyIQfREk1w8sSmuZJtAm80J9huvYRAm0hRCtb_dAsmMP8lNJEVg-VbK_DCcqRh9Fy9Z1dtYtnnJObODcfQ" });
  await createFlavor({ 
    name: "Dr Pepper Fantastic Chocolate",
    description: "good", 
    photo_URL: "https://i0.wp.com/www.theimpulsivebuy.com/wordpress/wp-content/uploads/2021/08/fanchocpepp.jpeg?resize=600%2C600&ssl=1" });
  await createFlavor({ 
    name: "Diet Dr Pepper Cherry Chocolate",
    description: "good", 
    photo_URL: "https://simferopol.e-sweets.ru/wa-data/public/shop/products/66/02/266/images/251/251.970.jpg" });
  await createFlavor({ 
    name: "Dr Pepper Berries & Cream",
    description: "good", 
    photo_URL: "https://hips.hearstapps.com/hmg-prod/images/dr-pepper-berries-and-cream-flavored-soda-1644933954.jpg?resize=1024:*" });
  await createFlavor({ 
    name: "Heritage Dr Pepper",
    description: "good", 
    photo_URL: "https://candyfunhouse.ca/cdn/shop/files/dr-pepper-made-with-sugar-candy-funhouse.jpg?v=1695756241" });
  await createFlavor({ 
    name: "Dr Pepper Blackberry",
    description: "Brand new in 2025, blackberry flavor.", 
    photo_URL: "https://i5.walmartimages.com/asr/51c42099-12c0-483c-bfb3-038ba62bbbea.2b60744e07277d0d4e88563b72c4c4a4.jpeg?odnHeight=117&odnWidth=117&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Dr Pepper Blackberry Zero Sugar",
    description: "Brand new in 2025, blackberry flavor.", 
    photo_URL: "https://i5.walmartimages.com/asr/cb9b5b59-6b26-4e47-9803-4ebce46ace68.f21321c5acf7ccf6fc5bebe4418c275a.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF" });
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
 // console.log('Full response:', response);
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

const selectUserById = async (id) => {
  try {
    const SQL = `SELECT id, username, photo_URL, created_at, is_admin FROM users WHERE id = $1`;
    const response = await client.query(SQL, [id]);

    if (response.rows.length === 0) {
      return null;
    }

    return response.rows[0];
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const fetchFlavors = async () => {
  const SQL = `
    SELECT * FROM flavors;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchSingleFlavor = async (id) => {
  const SQL = `
    SELECT * FROM flavors
    WHERE id = $1
    ;
    `;
  const response = await client.query(SQL, [id]);
  return response.rows[0];
};



const generateToken = (user) => {
  const payload = {
    user_id: user.id,
    username: user.username,
  };
  const options = { expiresIn: "1h" };
  const secret = process.env.JWT_SECRET || "default_secret"; 

  return jwt.sign(payload, secret, options);
};



module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  createFlavor,
  fetchFlavors,
  fetchSingleFlavor,
  generateToken,
  seedData,
  selectUserById
};


