const {
  client,
  createTables,
  createUser,
  fetchUsers,
  createFlavor,
  fetchFlavors,
  createReview,
  seedData
} = require("./db");

const bcrypt = require("bcrypt");

const express = require("express");

const app = express();

app.use(express.json());
//api routes....
const path = require('path');
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../client/dist/index.html')));
app.use('/assets', express.static(path.join(__dirname, '../client/dist/assets')));

app.get("/api/users", async (req, res, next) => {
  try {
    console.log("trying users");
    const users = await fetchUsers();
    console.log(users);
    res.send(await fetchUsers());
  } catch (ex) {
    console.log(ex);
    next(ex);
  }
});


app.get("/api/flavors", async (req, res, next) => {
  try {
    const flavors = await fetchFlavors();
    console.log(flavors);
    res.send(flavors);
  } catch (ex) {
    next(ex);
  }
});

app.post("/api/review", async (req, res, next) => {
  try {
    const { user_id, flavor_id, content, score } = req.body;

    if (!user_id || !flavor_id || !content || !score) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newReview = await createReview({ user_id, flavor_id, content, score });
    res.status(201).json(newReview);
  } catch (ex) {
    next(ex);
  }
});


app.post('/api/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    createUser({ username: username, password: password, photo_URL: "" });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: "Email already in use" });
    }
    next(error);
  }
});


const init = async () => {
  const port = process.env.PORT || 3000;

  await client.connect();

  console.log("connected to database");

  await createTables();

  await seedData();

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
