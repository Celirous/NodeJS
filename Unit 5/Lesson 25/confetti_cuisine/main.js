// main.js

const express = require("express");
const homeController = require("./controllers/homeController");
const layouts = require("express-ejs-layouts");
const errorController = require("./controllers/errorController");
const mongoose = require("mongoose");
const subscribersController = require("./controllers/subscribersController");
const userController = require("./controllers/userController");
const courseController = require("./controllers/coursesController");
const methodOverride = require("method-override");
const connectFlash = require("connect-flash")
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
// const expressValidator = require("express-validator")
const User = require("./models/user");
const passport = require("passport");

const app = express();
const router = express.Router();

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

router.use(cookieParser("secretCuisine123"));

router.use(
  expressSession({
    secret: "secretCuisine123",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  }),
);

router.use(connectFlash());

router.use(passport.initialize());
router.use(passport.session());

router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated(); // Passport method to check if user is logged in
  res.locals.currentUser = req.user; // The logged-in user object
  next();
});


router // Method override for PUT and DELETE requests via forms
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
// ROUTES
// ===============================

// ===============================
// Home Routes
// ===============================
app.get("/", homeController.displayHomePage);
app.get("/courses", homeController.showCourses);

// ===============================================================================================================
//                    COURSE ROUTES
// ===============================================================================================================

router.get("/courses", courseController.showCourses);
router.get("/courses/new", courseController.new);
router.post(
  "/courses/create",
  courseController.create,
  courseController.redirectView,
);
router.get("/courses/:id", courseController.show, courseController.showView);
router.get("/courses/:id/edit", courseController.edit);
router.put(
  "/courses/:id/update",
  courseController.update,
  courseController.redirectView,
);
router.delete(
  "/courses/:id/delete",
  courseController.delete,
  courseController.redirectView,
);

// ===============================
// Subscriber Routes
// ===============================

router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView,
);
router.get("/subscribers/new", subscribersController.new);
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView,
);
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView,
);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView,
);
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView,
);

// ===============================
// User Routes
// ===============================

router.get("/users/login", userController.login);
router.post("/users/login", userController.authenticate);

router.get(
  "/users/logout",
  userController.logout,
  userController.redirectView,
);

router.get("/users", userController.index, userController.indexView);
router.get("/users/new", userController.new);

router.post(
  "/users/create",
  userController.validate,
  userController.create,
  userController.redirectView,
);
router.get("/users/:id", userController.show, userController.showView);
router.get("/users/:id/edit", userController.edit);
router.put(
  "/users/:id/update",
  userController.update,
  userController.redirectView,
);
router.delete(
  "/users/:id/delete",
  userController.delete,
  userController.redirectView,
);

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
