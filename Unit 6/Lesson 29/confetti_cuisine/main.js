// main.js

const express = require("express");

const layouts = require("express-ejs-layouts");

const mongoose = require("mongoose");
const methodOverride = require("method-override");
const connectFlash = require("connect-flash")
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
// const expressValidator = require("express-validator")

const User = require("./models/user");
const passport = require("passport");

const router = require("./routes/index");
const app = express();
// const router = express.Router();

// ===============================
// DATABASE CONNECTION
// ===============================

// We connect to MongoDB before handling any routes
// This ensures Mongoose can actually run queries like Subscriber.find() and User.find()
mongoose.connect("mongodb://localhost:27017/confetti_cuisine");

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB successfully");
});

mongoose.connection.on("error", (error) => {
  console.log(`MongoDB connection error: ${error.message}`);
});

// ===============================
// APP CONFIG
// ===============================

// Middleware to parse form data
app.use(
  express.urlencoded({
    extended: false,
  }),
);

// Middleware to parse JSON
app.use(express.json());

// Static files (CSS, images, etc.)
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);
app.set("view engine", "ejs");

// Layout support
app.use(layouts);

app.use(cookieParser("secretCuisine123"));

app.use(
  expressSession({
    secret: "secretCuisine123",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(connectFlash());

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated(); // Passport method to check if user is logged in
  res.locals.currentUser = req.user; // The logged-in user object
  next();
});


app // Method override for PUT and DELETE requests via forms
  .use(
    methodOverride("_method", {
      methods: ["POST", "GET"],
    }),
  );

// router.use(expressValidator())

passport.use(User.createStrategy()); // this is how we are going to authenticate user. This is a passport method
passport.serializeUser(User.serializeUser()); // this is going to take the login info, store it in the session cookie and verify it with the current user cookie. This is for making sure that requests we make (form updates and stuff).
passport.deserializeUser(User.deserializeUser()); // this will take the user session cookie and then compare it to the current user to confirm it is the correct user making these changes

app.use("/", router);


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
using Mongoose so that subscriber and user data can be stored and retrieved.

The application is structured using the MVC pattern:
- Models handle database structure and queries (Mongoose schemas)
- Controllers handle business logic and responses
- Views (EJS files) handle what the user sees in the browser

Key features in this file:
- Connects to MongoDB before handling any routes
- Sets up middleware for form data, JSON, layouts, static files, and method override
- Defines routes for:
  - Home page
  - Courses page
  - Viewing, creating, editing, and deleting subscribers
  - Viewing, creating, editing, and deleting users
- Uses centralized error handling for 404 and 500 errors
- Starts the server on port 3000 (or an environment-defined port)

Overall, this file wires together the database, middleware, routes,
controllers, and error handling to run the full web application.
*/
