const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5500;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g5ktv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("Connection err", err);
  const AdminCollection = client.db("gerez").collection("admins");
  const ServiceCollection = client.db("gerez").collection("services");
  const OrderCollection = client.db("gerez").collection("orders");

  app.get("/isAdmin", (req, res) => {
    AdminCollection.find({ email: req.query.email }).toArray((err, docs) => {
      res.send(!!docs.length);
    });
  });

  app.get("/order", (req, res) => {
    AdminCollection.find({ email: req.query.email }).toArray((err, docs) => {
      if (docs.length) {
        OrderCollection.find().toArray((err, docs) => {
          res.send(docs);
        });
      } else {
        OrderCollection.find({ email: req.query.email }).toArray(
          (err, docs) => {
            res.send(docs);
          }
        );
      }
    });
  });

  app.get("/services", (req, res) => {
    ServiceCollection.find().toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.post("/addAdmin", (req, res) => {
    AdminCollection.insertOne(req.body).then((result) => {
      res.send(!!result.insertedCount > 0);
    });
  });

  app.post("/addService", (req, res) => {
    ServiceCollection.insertOne(req.body).then((result) => {
      res.send(!!result.insertedCount > 0);
    });
  });

  app.post("/addOrder", (req, res) => {
    OrderCollection.insertOne(req.body).then((result) => {
      res.send(!!result.insertedCount > 0);
    });
  });

  app.patch("/update:id", (req, res) => {
    ServiceCollection.updateOne(
      {
        _id: ObjectId(req.params.id),
      },
      {
        $set: req.body,
      }
    ).then((result) => {
      res.send(!!result.modifiedCount);
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
