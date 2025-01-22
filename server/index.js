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
    createFlavor({ name: "Dr Pepper Original", description: "good", photo_URL: "https://i5.walmartimages.com/seo/Doctor-Pepper-Soda-12oz-Cans-Pack-of-48_f311a391-8c1c-4b38-b7f7-788d26359f44.4eb13d8fade9191d2c4f05fdc7cca03f.jpeg?odnHeight=2000&odnWidth=2000&odnBg=FFFFFF" }),
    createFlavor({ name: "Dr Pepper Vanilla Float", description: "good", photo_URL: "https://i5.walmartimages.com/asr/1e49efb6-01c2-415f-9965-29e15fc3432d.cc510533258805a04cb12e8d5501ca94.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" }),
    createFlavor({ name: "Dr Pepper Cherry", description: "good", photo_URL: "https://images.albertsons-media.com/is/image/ABS/960022623-R001?$ng-ecom-pdp-mobile$&defaultImage=Not_Available" }),
    createFlavor({ name: "Diet Dr Pepper",description: "good", photo_URL: "https://i5.walmartimages.com/asr/097a28e0-cb1d-4ce9-916c-16b4b8d395a9.1e4e4705ac25584781fadea7ee4768d1.jpeg?odnHeight=768&odnWidth=768&odnBg=FFFFFF" }),
    createFlavor({ name: "Dr Pepper Strawberries & Cream",description: "good", photo_URL: "https://i5.walmartimages.com/asr/028be2fd-151e-4a7a-9438-c6d140e76001.4a9f1df900d85b116abb7b8cde88ed47.jpeg" }),
    createFlavor({ name: "Dr Pepper Creamy Coconut",description: "good", photo_URL: "https://www.kroger.com/product/images/large/back/0007800003871" }),
    createFlavor({ name: "Dr Pepper Dark Berry",description: "good", photo_URL: "https://i5.walmartimages.com/asr/e663d659-1a5f-422e-94b7-1f5abd3c60fb.0358507f00c74fb01e767a15ea6fa417.jpeg" }),
    createFlavor({ name: "Dr Pepper Cherry Vanilla",description: "good", photo_URL: "https://sweetkingdoms.com/wp-content/uploads/2023/11/DR-PEPPER-CHERRY-VANILLA.webp" }),
    createFlavor({ name: "Dr Pepper Cream Soda",description: "good", photo_URL: "https://i.ebayimg.com/images/g/3k4AAOSwSAFhKJAQ/s-l1200.jpg" }),
    createFlavor({ name: "Dr Pepper Original (Real Sugar)",description: "good", photo_URL: "https://m.media-amazon.com/images/I/61kw9c37qRL.jpg" }),
  ]);

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
