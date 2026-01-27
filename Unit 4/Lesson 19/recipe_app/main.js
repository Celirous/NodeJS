const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeControllers");
const errorController = require("./controllers/errorController");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersControllers");
const usersController = require("./controllers/usersController");
const app = express();
const layouts = require("express-ejs-layouts");

const mongoose = require("mongoose"); // we are just setting that we require mongoose for this to work

mongoose.connect(
  "mongodb://localhost:27017/recipe_db" //setup the connection to the database
); //Connect to MongoDB using Mongoose (modern versions no longer need connection options)
const db = mongoose.connection; // assign the database to the var db

db.once("open", () => {
  console.log(
    "Hey AJ, we have successfully connected to MongoDB using Mongoose!!"
  );
});

// ================================================================
// We are commenting this out so that it doesnt make a new one each time we run the server

// // Option 1
// let subscriber1 = new Subscriber({
//   name: "Darrel P",
//   email: "p.darrel@example.com",
// }); //Instantiate a new subscriber manually

// // this one where we set the var, we are manually adding info
// subscriber1.save() //Save a subscriber to the database (returns a Promise)
// .then((savedDocument) => {
//     console.log(savedDocument); //Log saved data document
// }).catch((error) => {
//     console.log(error); // Catch and log potential errors
// });

// //Option 2
// // this is an automatic way of adding and saving the data in one step
// Subscriber.create({
//   name: "Malcolm",
//   email: "malcolm@mail.com",
// }) //Create and save a subscriber in one step (returns a Promise)
// .then((savedDocument) => {
//   console.log(savedDocument); //Log saved data document
// })
// .catch((error) => {
//   console.log(error); // Catch and log potential errors
// });

// ================================================================

// const MongoDB = require("mongodb").MongoClient;
// const dbURL = "mongodb://localhost:27017";
// const dbName = "recipe_db";

// MongoDB.connect(dbURL, (error, client) => {
//   if (error) throw error;
//   let db = client.db(dbName);
//   db.collection("contacts").insert(
//     {
//       name: "AJ Bellringer",
//       email: "aj@test.com",
//     },
//     (error, db) => {
//       if (error) throw error;
//       console.log(db);
//     }
//   );
//   db.collection("contacts")
//     .find()
//     .toArray((error, data) => {
//       if (error) throw error;
//       console.log(data);
//     });
// });

// We use function here to find and display data from the database to us in the console. This can be written as a function to find stuff on front ends when searching
// let myQuery = Subscriber.findOne({
//   name: "Darrel P",
// }).where("email", /darrel/);
// myQuery
//   .exec()
//   .then((data) => {
//     console.log(data.name);
//   })
//   .catch((error) => {
//     console.error(error); //Run a query with a callback function to handle errors and data.
//   });

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

app.use(express.static("public"));

app.use(errorController.logErrors);

app.get("/name/:myName", homeController.respondWithName); //grabs infor from homeController and run the function respondWithName

app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.get("/subscribers", subscribersController.getAllSubscribers, subscribersController.displaySubscribers);

app.get("/users", usersController.index, usersController.indexView)

// we are going to add  these at the end of our file,because this is the thing that needs to 'hit' after we put in a bad path request above.
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
