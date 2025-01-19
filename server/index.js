const {
  client,
  createTables,
  createUser,
  fetchUsers,
  createFlavor,
  fetchFlavors,
} = require("./db");

const express = require("express");

const app = express();

app.use(express.json());
//api routes....
const path = require('path');
app.get('/', (req, res)=> res.sendFile(path.join(__dirname, '../client/dist/index.html')));
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

const init = async () => {
  const port = process.env.PORT || 3000;

  await client.connect();

  console.log("connected to database");

  await createTables();

  console.log("tables created");

  const [jesse, jared, karl, joanathan] = await Promise.all([
    createUser({ username: "jesse", password: "j", photo_URL: "" }),
    createUser({ username: "jared", password: "j", photo_URL: "" }),
    createUser({ username: "karl", password: "k", photo_URL: "" }),
    createUser({ username: "joanathan", password: "j", photo_URL: "" }),
    createFlavor({ name: "original", description: "good", photo_URL: "" }),
    createFlavor({ name: "vanilla", description: "good", photo_URL: "" }),
    createFlavor({ name: "cherry", description: "good", photo_URL: "" }),
    createFlavor({ name: "diet", description: "good", photo_URL: "" }),
  ]);

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
