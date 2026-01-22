const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeControllers");
const errorController = require("./controllers/errorController");
const app = express();
const layouts = require("express-ejs-layouts");
const MongoClient = require("mongodb/lib/mongo_client");

const MongoDB = require("mongodb").MongoClient;
const dbURL = "mongodb://localhost:27017";
const dbName = "recipe_db";

MongoDB.connect(dbURL, (error, client) => {
  if (error) throw error;
  let db = client.db(dbName);
  db.collection("contacts").insert(
    {
      name: "AJ Bellringer",
      email: "aj@test.com",
    },
    (error, db) => {
      if (error) throw error;
      console.log(db);
    }
  );
  db.collection("contacts")
    .find()
    .toArray((error, data) => {
      if (error) throw error;
      console.log(data);
    });
});

app.set("view engine", "ejs"); //this is now the engine we will use for template displaying. "view engine" is the function, the "ejs" is what the engine we are going to use to show this template in views folder
app.use((req, res, next) => {
  console.log(
    `This is the second middleware that will be running. Request made to: ${req.url}`
  );
  next();
});

app.use(
  express.urlencoded({
    // this takes the data from raw binary data into a javascript object so that it is readable.
    extended: false,
  })
);
app.use(express.json());

app.use(layouts);

app.use(express.static("/public"));

app.use(errorController.logErrors);

app.get("/name/:myName", homeController.respondWithName); //grabs infor from homeController and run the function respondWithName

// we are going to add  these at the end of our file,because this is the thing that needs to 'hit' after we put in a bad path request above.
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
