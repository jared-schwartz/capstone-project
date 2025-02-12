const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/drPepper_db");
const bcrypt = require("bcrypt");
const { response } = require("express");
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
        is_admin BOOLEAN DEFAULT false
        );

    CREATE TABLE flavors(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT now(),
        description VARCHAR(500),
        photo_URL VARCHAR(255),
        average_Score REAL DEFAULT 5,
        disabled BOOLEAN DEFAULT false
        );

CREATE TABLE reviews(
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) NOT NULL,
    flavor_id INT REFERENCES flavors(id) NOT NULL,
    content VARCHAR(500),
    score INTEGER,
    UNIQUE (user_id, flavor_id)
);
        
    CREATE TABLE comments(
        id SERIAL PRIMARY KEY,
        user_id SERIAL REFERENCES users(id) NOT NULL,
        review_id SERIAL REFERENCES reviews(id) NOT NULL,
        content VARCHAR(500) NOT NULL,
        UNIQUE (user_id, review_id)
        );
    `;
  await client.query(SQL);
};

const seedData = async () => {

  await createUser({
    username: "jesse",
    password: "j",
    photo_URL: "",
    is_admin: true,
  });
  await createUser({
    username: "jared",
    password: "j",
    photo_URL: "",
    is_admin: true,
  });
  await createUser({
    username: "karl",
    password: "k",
    photo_URL: "",
    is_admin: true,
  });
  await createUser({
    username: "joanathan",
    password: "j",
    photo_URL: "",
    is_admin: true,
  });
  await createUser({
    username: "karlbusse242",
    password: "password",
    photo_URL: "",
    is_admin: false,
  });

  await createFlavor({
    name: "Dr Pepper Original",
    description: "Original 23 flavor blend.",
    photo_URL:
      "https://i5.walmartimages.com/seo/Doctor-Pepper-Soda-12oz-Cans-Pack-of-48_f311a391-8c1c-4b38-b7f7-788d26359f44.4eb13d8fade9191d2c4f05fdc7cca03f.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF",
  });
  await createFlavor({
    name: "Dr Pepper Vanilla Float",
    description:
      "Vanilla float style flavor that tastes like a Dr Pepper Float.",
    photo_URL:
      "https://i5.walmartimages.com/asr/1e49efb6-01c2-415f-9965-29e15fc3432d.cc510533258805a04cb12e8d5501ca94.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
  });
  await createFlavor({
    name: "Dr Pepper Cherry",
    description: "Original 23 flavor blend with cherry flavor added in.",
    photo_URL:
      "https://images.albertsons-media.com/is/image/ABS/960022623-R001?$ng-ecom-pdp-mobile$&defaultImage=Not_Available",
  });
  await createFlavor({
    name: "Diet Dr Pepper",
    description: "Diet version of the original 23 flavor blend.",
    photo_URL:
      "https://i5.walmartimages.com/asr/097a28e0-cb1d-4ce9-916c-16b4b8d395a9.1e4e4705ac25584781fadea7ee4768d1.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF",
  });
  await createFlavor({
    name: "Dr Pepper Strawberries & Cream",
    description: "The 23 signature flavors of Dr Pepper combined with the delicious sweet flavor of strawberries and the smooth taste of cream", 
    photo_URL: "https://i5.walmartimages.com/asr/028be2fd-151e-4a7a-9438-c6d140e76001.4a9f1df900d85b116abb7b8cde88ed47.jpeg" });
  await createFlavor({ 
    name: "Dr Pepper Creamy Coconut",
    description: "Dr. Pepper Creamy Coconut is a limited-edition soda that combines Dr. Pepper's flavor with coconut. It's described as having a creamy finish and notes of light brown sugar. ", 
    photo_URL: "https://www.kroger.com/product/images/large/back/0007800003871" });
  await createFlavor({ 
    name: "Dr Pepper Dark Berry",
    description: "Dr Pepper Dark Berry is a soda that combines the classic Dr Pepper flavor with darker fruit flavors like black cherry, blackberry, and black currant. ", 
    photo_URL: "https://i5.walmartimages.com/asr/e663d659-1a5f-422e-94b7-1f5abd3c60fb.0358507f00c74fb01e767a15ea6fa417.jpeg" });
  await createFlavor({ 
    name: "Dr Pepper Cherry Vanilla",
    description: "A splash of cherry, a hint of vanilla, and the authentic taste of Dr Pepper. That's one tasteful triple threat, otherwise known as Cherry Vanilla Dr Pepper.", 
    photo_URL: "https://sweetkingdoms.com/wp-content/uploads/2023/11/DR-PEPPER-CHERRY-VANILLA.webp" });
  await createFlavor({ 
    name: "Dr Pepper Cream Soda",
    description: "A brand-new duet that is sweeter than any other. The beloved Dr Pepper paired with the richness of cream soda makes for perfect flavor harmony. Take a sip of the symphony of deliciousness.", 
    photo_URL: "https://i.ebayimg.com/images/g/3k4AAOSwSAFhKJAQ/s-l1200.jpg" });
  await createFlavor({ 
    name: "Dr Pepper Original (Real Sugar)",
    description: "Made with Imperial Pure Cane Sugar, the 23 flavors of Dr Pepper have never tasted so special. Made with Sugar, made for you! Try Dr Pepper Made with Sugar now.", 
    photo_URL: "https://m.media-amazon.com/images/I/61kw9c37qRL.jpg" });
  await createFlavor({ 
    name: "Dr Pepper Zero Sugar",
    description: "And just when you thought perfect flavor couldn’t get any more perfect-er. This zero-sugar captivates your tastebuds with the iconic blend of 23 flavors. It’s the delicious double-take your tastebuds deserve.", 
    photo_URL: "https://i5.walmartimages.com/asr/99826e18-22e2-4042-aaa2-7607e3d4a5ca.95aa7add0df607e4a75cbf3fba435a24.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Dr Pepper Zero Sugar Cream Soda",
    description: "From the tastemakers who brought you Diet Dr Pepper & Cream Soda comes Dr Pepper & Cream Soda Zero Sugar. The richness of cream soda harmonizes with all 23 flavors of Dr Pepper in the delicious zero-sugar treat you deserve.", 
    photo_URL: "https://i5.walmartimages.com/asr/df4e75c2-7b42-48f6-b41b-cc263fc04fc2.741691a64738160dc574aa739f3e49ee.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Dr Pepper Zero Sugar Strawberries & Cream" ,
    description: "Dr Pepper Strawberries & Cream Zero Sugar is here. It’s the same smooth, creamy, strawberry flavor you know and love, without the sugar. Crack open the sugarless treat you deserve, and ride this highway to the flavor zone.", 
    photo_URL: "https://i5.walmartimages.com/asr/1bf5a211-609f-4724-b3d1-01034c647ae6.abf8a0672d8fd588064d9b7176f00cbf.jpeg" });
  await createFlavor({ 
    name: "Dr Pepper Zero Sugar Creamy Coconut",
    description: "or a limited time only, indulge in the ultimate treat for summer 2024 – Dr Pepper Creamy Coconut Zero Sugar. We started with our unique blend of 23 flavors and combined that distinctive Dr Pepper flavor with the refreshing taste of coconut that will transcend you to a summer paradise.", 
    photo_URL: "https://www.kroger.com/product/images/large/back/0007800003873" });
  await createFlavor({ 
    name: "Diet Cherry Vanilla Dr Pepper",
    description: "On the first sip, you taste the splash of bold cherry. Then comes a light note of vanilla, and it's all wrapped in the authentic flavor of Dr Pepper. So where's the diet? Sorry, there's nothing diet about this delicious soda fountain blend. Until you read our handy nutrition facts and discover a blissful absence of calories. Enjoy it slow, like the uncompromising connoisseur you are.", 
    photo_URL: "https://www.kroger.com/product/images/large/right/0007800008916" });
  await createFlavor({ 
    name: "Dr Pepper Caffeine Free",
    description: "Maybe you don't need that extra pep of caffeine. Maybe you're plenty peppy just the way you are. You can still enjoy that same authentic Dr Pepper taste. Caffeine Free Dr Pepper delivers that original blend of 23 flavors you expect. Enjoy it slow, in that relaxed decaffeinated rhythm of yours, and you'll taste all 23. It's everything you love about Dr Pepper, without the caffeine.", 
    photo_URL: "https://i5.walmartimages.com/asr/64ba3b05-a891-4760-a95f-13dd04c8e750.6bd4fcfff89f2b81de25b8dfb6401ee7.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" });
  await createFlavor({ 
    name: "Diet Dr Pepper Caffeine Free",
    description: "Caffeine Free Diet Dr Pepper brings you the taste, and nothing but the taste. No calories, no caffeine, just the rich, bold refreshment of Dr Pepper. That signature blend is so rich and bold, you won't miss what's missing. Sip, don't chug: research shows slower is better. You'll see there's nothing diet (or caffeinated) about it.", 
    photo_URL: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcRo5BHtgzIgfs5FTyIQfREk1w8sSmuZJtAm80J9huvYRAm0hRCtb_dAsmMP8lNJEVg-VbK_DCcqRh9Fy9Z1dtYtnnJObODcfQ" });
  await createFlavor({ 
    name: "Dr Pepper Fantastic Chocolate",
    description: "New limited-edition Dr Pepper Fantastic Chocolate fuses the 23 flavors of classic Dr Pepper soda with chocolate.", 
    photo_URL: "https://i0.wp.com/www.theimpulsivebuy.com/wordpress/wp-content/uploads/2021/08/fanchocpepp.jpeg?resize=600%2C600&ssl=1" });
  await createFlavor({ 
    name: "Diet Dr Pepper Cherry Chocolate",
    description: "It had the taste of regular Dr Pepper mixed with Cherry and Chocolate flavoring.", 
    photo_URL: "https://simferopol.e-sweets.ru/wa-data/public/shop/products/66/02/266/images/251/251.970.jpg" });
  await createFlavor({ 
    name: "Dr Pepper Berries & Cream",
    description: "Dr Pepper Berries & Cream had a berry flavor with a punch of blueberry and rasberry with a creamy vanilla finish.", 
    photo_URL: "https://hips.hearstapps.com/hmg-prod/images/dr-pepper-berries-and-cream-flavored-soda-1644933954.jpg?resize=1024:*" });
  await createFlavor({ 
    name: "Heritage Dr Pepper",
    description: "Dr. Pepper Heritage Soda is a classic soda with a unique flavor that's made with 23 signature flavors. It comes in a vintage-inspired bottle wrap. ", 
    photo_URL: "https://candyfunhouse.ca/cdn/shop/files/dr-pepper-made-with-sugar-candy-funhouse.jpg?v=1695756241" });

   await createFlavor({
    name: "Dr Pepper Blackberry",
    description: "Brand new in 2025, blackberry flavor.",
    photo_URL:
      "https://i5.walmartimages.com/asr/51c42099-12c0-483c-bfb3-038ba62bbbea.2b60744e07277d0d4e88563b72c4c4a4.jpeg?odnHeight=117&odnWidth=117&odnBg=FFFFFF",
  });
  await createFlavor({
    name: "Dr Pepper Blackberry Zero Sugar",
    description: "Brand new in 2025, blackberry flavor. Zero sugar version.", 
    photo_URL: "https://i5.walmartimages.com/asr/cb9b5b59-6b26-4e47-9803-4ebce46ace68.f21321c5acf7ccf6fc5bebe4418c275a.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF" });

  await createReview({
    user_id: 1,
    flavor_id: 1,
    content: "very good",
    score: 5,
  });

  await createReview({
    user_id: 2,
    flavor_id: 1,
    content: "very good",
    score: 5,
  });
  await createReview({
    user_id: 2,
    flavor_id: 1,
    content: "very very good",
    score: 4,
  });
  await createReview({
    user_id: 2,
    flavor_id: 2,
    content: "very very good",
    score: 4,
  });
  await createComment({
    user_id: 2,
    review_id: 1,
    content: "So true",
  });
  await createComment({
    user_id: 4,
    review_id: 1,
    content: "Invalid opinion",
  });
};


const selectUserByUsername = async (username) => {
  const SQL = `SELECT * FROM users WHERE username = $1`;
  const response = await client.query(SQL, [username]);
  return response.rows[0];
};

const createUser = async ({ username, password, photo_URL, is_admin }) => {
  const SQL = `
      INSERT INTO users(username, password, photo_URL, is_admin) VALUES($1, $2, $3, $4) RETURNING *
    `;
  const response = await client.query(SQL, [
    username,
    await bcrypt.hash(password, 5),
    photo_URL,
    is_admin,
  ]);
  return response.rows[0];
};

const createFlavor = async ({ name, description, photo_URL }) => {
  const SQL = `
        INSERT INTO flavors(name, description, photo_URL) VALUES($1, $2, $3) RETURNING *
      `;
  const response = await client.query(SQL, [name, description, photo_URL]);
  return response.rows[0];
};

const createReview = async ({ user_id, flavor_id, content, score }) => {
  const SQL = `
        INSERT INTO reviews(user_id, flavor_id, content, score)
        VALUES($1, $2, $3, $4)
        ON CONFLICT (user_id, flavor_id)
        DO UPDATE SET content = EXCLUDED.content, score = EXCLUDED.score
        RETURNING *
      `;
  const response = await client.query(SQL, [
    user_id,
    flavor_id,
    content,
    score,
  ]);
  return response.rows[0];
};

const createComment = async ({ user_id, review_id, content }) => {
  const SQL = `
        INSERT INTO comments(user_id, review_id, content)
        VALUES($1, $2, $3)
        ON CONFLICT (user_id, review_id)
        DO UPDATE SET content = EXCLUDED.content
        RETURNING *
      `;
  const response = await client.query(SQL, [
    user_id,
    review_id,
    content,
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

const selectFlavorById = async (id) => {
  try {
    const SQL = `SELECT id, name, description, photo_URL, average_Score FROM flavors WHERE id = $1`;
    const response = await client.query(SQL, [id]);

    if (response.rows.length === 0) {
      return null;
    }

    return response.rows[0];
  } catch (error) {
    throw new Error(`Error fetching flavor: ${error.message}`);
  }
};

const fetchFlavors = async () => {
  const SQL = `
    SELECT * FROM flavors;
    `;
  const response = await client.query(SQL);
  return response.rows;
};

const updateFlavorScore = async (flavor_id) => {
  try {

    const reviews = await getReviewsByFlavor(flavor_id)
    const score = await (reviews.reduce((sum, cur) => {
      return sum + cur.score
    }, 0)) / reviews.length;

    console.log(score);

    if (typeof score !== "number" || score < 0 || score > 5) {
      return res.status(400).json({ error: "Score must be a number between 0 and 5." });
    }

    const roundedScore = Math.round(score);

    const sql = `
      UPDATE flavors
      SET average_Score = $1
      WHERE id = $2
      RETURNING average_Score;
      `;

    const result = await client.query(sql, [roundedScore, flavor_id]);
    return result.rows[0].roundedScore;
  } catch (ex) {
    throw new Error(ex.message)
  }
};

const getReviewsByFlavor = async (id) => {
  try {
    const SQL = `SELECT reviews.id, reviews.user_id, reviews.flavor_id, reviews.content, reviews.score,
    users.username, flavors.name as flavor
    FROM reviews
    INNER JOIN users ON reviews.user_id = users.id
    INNER JOIN flavors ON reviews.flavor_id = flavors.id
    WHERE flavor_id = $1;`;
    const response = await client.query(SQL, [id]);
    if (response.rows.length === 0) {
      return null;
    }
    return response.rows;
  } catch (error) { }
};

const getComments = async (id) => {
  try {
    const SQL = `SELECT comments.id, comments.user_id, comments.review_id, comments.content,
    users.username
    FROM comments
    INNER JOIN users ON comments.user_id = users.id
    INNER JOIN reviews ON comments.review_id = reviews.id
    WHERE review_id = $1;`;
    const response = await client.query(SQL, [id]);
    if (response.rows.length === 0) {
      return null;
    }
    return response.rows;
  } catch (error) { }
};

const deleteReview = async (review_id, user_id) => {
  try {
    const SQL = "DELETE FROM reviews WHERE id = $1 AND user_id = $2 RETURNING *"
    const response = await client.query(SQL, [review_id, user_id]);

    if (response.rowCount === 0) {
      throw new Error("The review did not have the user id or does not exist ")
    }

    return "Success"

  } catch (error) {
    throw new Error(error.message)
  }
}

const deleteComment = async (comment_id, user_id) => {
  try {
    const SQL = "DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *"
    const response = await client.query(SQL, [comment_id, user_id]);

    if (response.rowCount === 0) {
      throw new Error("The comment's user did not match given user or does not exist ")
    }

    return "Success"

  } catch (error) {
    throw new Error(error.message)
  }
}

const generateToken = (user) => {
  const payload = {
    user_id: user.id,
    username: user.username,
    is_admin: user.is_admin,
  };
  const options = { expiresIn: "1h" };
  const secret = process.env.JWT_SECRET || "default_secret";

  console.log(payload)

  return jwt.sign(payload, secret, options);
};

const authenticate = async (token, id) => {
  try {
    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const splitToken = token.split(" ")[1]

    console.log(splitToken)
    const payload = await jwt.verify(splitToken, "default_secret");
    if (payload.user_id != id) throw Error("Token does not match id")
    return payload
  } catch (ex) {
    const error = Error("not authorized", ex.message);
    error.status = 401;
    throw error;
  }
}

module.exports = {
  client,
  createTables,
  createUser,
  fetchUsers,
  createFlavor,
  fetchFlavors,
  generateToken,
  seedData,
  selectUserById,
  selectFlavorById,
  updateFlavorScore,
  getReviewsByFlavor,
  selectUserByUsername,
  createReview,

  createComment,
  deleteReview,
  deleteComment,
  getComments,
  authenticate
};
