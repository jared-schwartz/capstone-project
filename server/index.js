const {
  client,
  createTables,
  createUser,
  fetchUsers,
  selectUserById,
  createFlavor,
  fetchFlavors,
  createReview,
  generateToken,
  seedData,
  selectFlavorById,
  selectUserByUsername
} = require("./db");

const bcrypt = require("bcrypt");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// Serve frontend
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../client/dist/index.html")));
app.use("/assets", express.static(path.join(__dirname, "../client/dist/assets")));

// Fetch all users 
app.get("/api/users", async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (ex) {
    next(ex);
  }
});
// Fetch Single User
app.get("/api/user/:id", async (req, res, next) => {
  try {
    console.log("User ID:", req.params.id);
    const user = await selectUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});
// Fetch all flavors 
app.get("/api/flavors", async (req, res, next) => {
  try {
    const flavors = await fetchFlavors();
    res.json(flavors);
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/flavor/:id", async (req, res, next) => {
  try {
    console.log("Flavor ID:", req.params.id);
    const flavor = await selectFlavorById(req.params.id);
    res.json(flavor);
  } catch (error) {
    next(error);
  }
});


// Post a review
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

// User login

app.post("/api/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await selectUserByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
});


app.post("/api/users", async (req, res, next) => {
  try {
    const { username, password, photo_URL = "" } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await createUser({ username, password, photo_URL });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(400).json({ error: "Username already in use" });
    }
    next(error);
  }
});





const init = async () => {
  const port = process.env.PORT || 3000;

  await client.connect();
  console.log("Connected to database");

  await createTables();
  await seedData();
  console.log("Tables created");

  app.listen(port, () => console.log(`Listening on port ${port}`));
};

init();

