const {
  client,
  createTables,
  createUser,
  fetchUsers,
  createFlavor,
  fetchFlavors,
  createReview,
  seedData,
} = require("./db");

const express = require("express");

const app = express();

app.use(express.json());

// app routes go here............

app.get("/api/users", async (res, req, next) => {
  try {
    res.json(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("/api/flavors", async (res, req, next) => {
  try {
    res.json(await fetchFlavors());
    console.log(flavors);
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
    const newReview = await createReview({
      user_id,
      flavor_id,
      content,
      score,
    });
    res.status(201).json(newReview);
  } catch (ex) {
    next(ex);
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
