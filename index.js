const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();

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

    app.get("/education", async (req, res) => {
      const cursor = educationCollection.find({});
      const tours = await cursor.toArray();

      res.send(tours);
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
