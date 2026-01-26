// main.js

const express = require("express");
const app = express();
const layouts = require("express-ejs-layouts");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const subscribersController = require("./controllers/subscribersController");
const mongoose = require("mongoose");

// ===============================
// DATABASE CONNECTION
// ===============================

// We connect to MongoDB before handling any routes
// This ensures Mongoose can actually run queries like Subscriber.find()
mongoose.connect("mongodb://localhost:27017/confetti_cuisine");

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
});

mongoose.connection.on("error", error => {
  console.log(`MongoDB connection error: ${error.message}`);
});

// ===============================
// APP CONFIG
// ===============================

app.set("view engine", "ejs");
app.set("port", process.env.PORT || 3000);

// Middleware to parse form data
app.use(
  express.urlencoded({
    extended: false
  })
);

// Middleware to parse JSON
app.use(express.json());

// Layout support
app.use(layouts);

// Static files (CSS, images, etc.)
app.use(express.static("public"));

// ===============================
// ROUTES
// ===============================

app.get("/", (req, res) => {
  res.render("index");
});

// Subscriber routes
app.get("/subscribers", subscribersController.getAllSubscribers);
app.get("/contact", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

// Course + contact routes
app.get("/courses", homeController.showCourses);
// app.get("/contact", homeController.showSignUp);
// app.post("/contact", homeController.postedSignUpForm);

// ===============================
// ERROR HANDLERS
// ===============================

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

// ===============================
// START SERVER
// ===============================

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

// ===============================
// APPLICATION SUMMARY
// ===============================
/*
This file is the main entry point for the Confetti Cuisine web application.

It uses Express.js to create a web server and EJS as the templating engine
to render dynamic HTML pages. The app connects to a local MongoDB database
using Mongoose so that subscriber data can be stored and retrieved.

The application is structured using the MVC pattern:
- Models handle database structure and queries (Mongoose schemas)
- Controllers handle business logic and responses
- Views (EJS files) handle what the user sees in the browser

Key features in this file:
- Connects to MongoDB before handling any routes
- Sets up middleware for form data, JSON, layouts, and static files
- Defines routes for:
  - Home page
  - Courses page
  - Contact / subscription form
  - Viewing all subscribers
- Uses centralized error handling for 404 and 500 errors
- Starts the server on port 3000 (or an environment-defined port)

Overall, this file wires together the database, middleware, routes,
controllers, and error handling to run the full web application.
*/
