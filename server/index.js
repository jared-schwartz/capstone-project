const {
  client,
  createTables,
  createUser,
  fetchUsers,
  createFlavor,
  fetchFlavors,
  createReview,
  fetchFlavorReview,
  fetchUserReview,
  createComment,
  fetchReviewComment
} = require("./db");

const express = require("express");

const app = express();

app.use(express.json());

// app routes go here............

app.get("./api/users", async (res, req, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

app.get("./api/flavors", async (res, req, next) => {
  try {
    res.send(await fetchFlavors());
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  const port = process.env.PORT || 3000;

  await client.connect();

  console.log("connected to database");

  await createTables();

  console.log("tables created");

  const [jesse, jared, karl, joanathan, original, vanilla, cherry, diet] = await Promise.all([
    createUser({ username: "jesse", password: "j", photo_URL: "" }),
    createUser({ username: "jared", password: "j", photo_URL: "" }),
    createUser({ username: "karl", password: "k", photo_URL: "" }),
    createUser({ username: "joanathan", password: "j", photo_URL: "" }),
    createFlavor({ name: "original", description: "good", photo_URL: "" }),
    createFlavor({ name: "vanilla", description: "good", photo_URL: "" }),
    createFlavor({ name: "cherry", description: "good", photo_URL: "" }),
    createFlavor({ name: "diet", description: "good", photo_URL: "" }),
  ]);

  console.log("Users and flavors created");

  const [review1, review2, review3, review4] = await Promise.all([
    createReview({ user_id: karl.id, flavor_id: cherry.id, content: "It tastes like my grandma's ashes", score: 1 }),
    createReview({ user_id: jared.id, flavor_id: original.id, content: "Nothing beats the original", score: 5 }),
    createReview({ user_id: joanathan.id, flavor_id: vanilla.id, content: "Reminds me of my childhood", score: 4 }),
    createReview({ user_id: jesse.id, flavor_id: diet.id, content: "", score: 3 })
  ]);

  console.log("Reviews created");

  const [comment1, comment2, comment3, comment4] = await Promise.all([
    createComment({ user_id: jared.id, review_id: review1.id, content: "Think about this, your going to be showing future employers this website. Do you REALLY want to put that into the project?" }),
    createComment({ user_id: joanathan.id, review_id: review2.id, content: "Based" }),
    createComment({ user_id: jesse.id, review_id: review3.id, content: "Same here, vanilla is such an underated flavor" }),
    createComment({ user_id: karl.id, review_id: review4.id, content: "I feel sad whenever I drink diet anything. Either drink soda or don't" })
  ]);

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
