const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9tg9f.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Connection Established");

    const database = client.db("portfolio");
    const educationCollection = database.collection("education");
    const workCollection = database.collection("workexperience");
    const projectsCollection = database.collection("projects");

    // get education api
    app.get("/education", async (req, res) => {
      const educations = await educationCollection.find({}).toArray();

      res.send(educations);
    });

    // get works api
    app.get("/works", async (req, res) => {
      const works = await workCollection.find({}).toArray();

      res.send(works);
    });

    // get project by category
    app.get("/projects/:category", async (req, res) => {
      const param = req.params.category;
      const category = param.toLowerCase();
      let result;

      if (category === "All") {
        result = await projectsCollection.find({}).toArray();
      } else {
        const query = { category: category };
        result = await projectsCollection.find(query).toArray();
      }

      res.send(result);
    });

    // get single project
    app.get("/project/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };

      const result = await projectsCollection.findOne(query);
      console.log(result);

      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Welcome to the Server Admin!");
});
app.listen(port, () => {
  console.log("Running on port : ", port);
});
