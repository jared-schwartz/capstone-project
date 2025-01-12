const { createTables } = require("./db");
const { client } = require("./server")

const express = require("express");

const app = express();

app.use(express.json());

// app routes go here............

app.get("/", (res, req, next) => {
  try {
  } catch (error) { }
});

const init = async () => {
  const port = process.env.PORT || 3000;

  await client.connect();

  console.log("connected to database");

  await createTables();

  console.log("tables created");

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
