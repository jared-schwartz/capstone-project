const {
  client,
  createTables,
  createUser,
  fetchUsers,
  selectUserById,
  createFlavor,
  fetchFlavors,
  fetchReviews,
  createReview,
  createComment,
  generateToken,
  seedData,
  selectFlavorById,
  selectUserByUsername,
  authenticate,
  getReviewsByFlavor,
  deleteReview,
  deleteComment,
  updateFlavorScore,
  getCommentsByReview,
  getReviewsByUser,
  getCommentsByUser
} = require("./db");

const bcrypt = require("bcrypt");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// Serve frontend
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

// Fetch all users
app.get("/api/users", async (req, res, next) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (ex) {
    next(ex);
  }
});
// Fetch all reviews
app.get("/api/reviews", async (req, res, next) => {
  try {
    const users = await fetchReviews();
    res.json(reviews);
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

//Fetch single flavor

app.get("/api/flavor/:id", async (req, res, next) => {
  try {
    console.log("Flavor ID:", req.params.id);
    const flavor = await selectFlavorById(req.params.id);
    res.json(flavor);
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

app.get("/api/flavors/:id", async (req, res, next) => {
  try {
    console.log("Flavor ID:", req.params.id);
    const flavor = await selectFlavorById(req.params.id);
    res.json(flavor);
  } catch (error) {
    next(error);
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

//Update Flavor Score
app.put("/api/flavors/score/:id", async (req, res) => {
  try {
    const id = req.params.id

    const reviews = await getReviewsByFlavor(id)

    const average_score = await (reviews.reduce((sum, cur) => {
      return sum + cur.score
    }, 0)) / reviews.length;

    console.log(average_score);

    if (typeof average_score !== "number" || average_score < 0 || average_score > 5) {
      return res.status(400).json({ error: "Score must be a number between 0 and 5." });
    }

    const updatedScore = await updateFlavorScore(id, average_score);

    res.json({ "average_score": updatedScore });

  } catch (error) {
    console.error("Error updating flavor score:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Fetch Reviews for Flavor
app.get("/api/flavors/reviews/:id", async (req, res, next) => {
  try {
    const reviews = await getReviewsByFlavor(req.params.id)
    res.json(reviews);
  } catch (error) {
    next(ex);
  }
});

// Fetch Reviews for Use
app.get("/api/users/reviews/:id", async (req, res, next) => {
  try {
    const reviews = await getReviewsByUser(req.params.id)
    res.json(reviews);
  } catch (error) {
    next(ex);
  }
});

app.get("/api/reviews/comments/:id", async (req, res, next) => {
  try {
    const comment = await getCommentsByReview(req.params.id);
    res.json(comment);
  } catch (error) {
    next(ex);
  }
});

app.get("/api/users/comments/:id", async (req, res, next) => {
  try {
    const comment = await getCommentsByUser(req.params.id);
    console.log(comment)
    res.json(comment);
  } catch (error) {
    next(ex);
  }
});

app.get("/api/authorize", async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const id = req.body.id

    const response = await authenticate(token, id)

    res.json({ "authorized?": response })

  } catch (error) {
    res.status(401).json({ error: "Invalid Token" })
  }
})


// Post a review
app.post("/api/reviews", async (req, res, next) => {
  try {
    const { user_id, flavor_id, content, score } = req.body;
    const token = req.headers.authorization;

    if (!user_id || !flavor_id || !content || !score) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const authorized = await authenticate(token, user_id);

    if (!authorized) { res.status(401).json({ error: "Invalid Token" }) }

    const newReview = await createReview({
      user_id,
      flavor_id,
      content,
      score
    });

    const average_Score = await updateFlavorScore(flavor_id)
    console.log(average_Score)

    res.status(201).json(newReview);
  } catch (ex) {
    next(ex);
  }
});

// Post a comment
app.post("/api/comments", async (req, res, next) => {
  try {
    const { user_id, review_id, content } = req.body;
    const token = req.headers.authorization;

    if (!user_id || !review_id || !content) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const authorized = await authenticate(token, user_id);

    if (!authorized) { res.status(401).json({ error: "Invalid Token" }) }

    const neComment = await createComment({
      user_id,
      review_id,
      content
    });
    res.status(201).json(neComment);
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

    const token = generateToken(user);
    res.json({ token, user });

    res.status(201).json({
      message: "User registered successfully",
    });
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

app.delete("/api/reviews", async (req, res, next) => {
  try {
    const { user_id, review_id } = req.body;
    const token = req.headers.authorization;

    console.log(user_id, review_id, token)
    if (!user_id || !review_id || !token) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const authorized = await authenticate(token, user_id);

    if (!authorized) { res.status(401).json({ error: "Invalid Token" }) }

    const response = await deleteReview(review_id, user_id)

    res.status(201).json({ "response": response });

  } catch (ex) {
    next(ex);
  }
})

app.delete("/api/comments", async (req, res, next) => {
  try {
    const { user_id, comment_id } = req.body;
    const token = req.headers.authorization;

    console.log(user_id, comment_id, token)
    if (!user_id || !comment_id || !token) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const authorized = await authenticate(token, user_id);

    if (!authorized) { res.status(401).json({ error: "Invalid Token" }) }

    const response = await deleteComment(comment_id, user_id)

    res.status(201).json({ "response": response });

  } catch (ex) {
    next(ex);
  }
})



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
