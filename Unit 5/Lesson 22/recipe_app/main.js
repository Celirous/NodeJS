const port = 3000;
const express = require("express");
const homeController = require("./controllers/homeController");
const errorController = require("./controllers/errorController");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersControllers");

const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");

const methodOverride = require("method-override");

const router = express.Router()
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

// =================== MIDDLE WARE =======================



// ====== not middleware ======
app.set("view engine", "ejs"); //this is now the engine we will use for template displaying. "view engine" is the function, the "ejs" is what the engine we are going to use to show this template in views folder
// ====== end of not middleware ======


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

router.use(methodOverride("_method", {
  methods: ["POST", "GET"] //Configure the application router to use methodOverride as middleware.
})); 

app.use("/", router)

app.use(errorController.logErrors);

// router.get("/name/:myName", homeController.respondWithName); //grabs infor from homeController and run the function respondWithName


// =================== HOME PAGE ROUTES =======================

router.get("/", homeController.displayHomePage)

// =================== COURSES ROUTES =======================

router.get('/courses', coursesController.showCourses);
router.get("/courses/new", coursesController.new);
router.post("/courses/create", coursesController.create,coursesController.redirectView);
router.get("/courses/:id", coursesController.show, coursesController.showView)

router.get("/courses/:id/edit", coursesController.edit);
router.put("/courses/:id/update", coursesController.update, coursesController.redirectView);

router.delete("/courses/:id/delete", coursesController.delete, coursesController.redirectView)

// =================== SUBSCRIBER ROUTES =======================

router.get("/subscribers", subscribersController.showSubscribers);
router.get("/subscribers/new", subscribersController.new);
router.post("/subscribers/create", subscribersController.create,subscribersController.redirectView);
router.get("/subscribers/:id", subscribersController.show, subscribersController.showView)

router.get("/subscribers/:id/edit", subscribersController.edit);
router.put("/subscribers/:id/update", subscribersController.update, subscribersController.redirectView);

router.delete("/subscribers/:id/delete", subscribersController.delete, subscribersController.redirectView)

// =================== USER ROUTES =======================

router.get("/users", usersController.index, usersController.indexView)
router.get("/users/new", usersController.new);
router.post("/users/create", usersController.create, usersController.redirectView);
router.get("/users/:id", usersController.show, usersController.showView)

router.get("/users/:id/edit", usersController.edit);
router.put("/users/:id/update", usersController.update, usersController.redirectView);

router.delete("/users/:id/delete", usersController.delete, usersController.redirectView)



// we are going to add  these at the end of our file,because this is the thing that needs to 'hit' after we put in a bad path request above.
app.use(errorController.respondNoResourceFound);
app.use(errorController.respondInternalError);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
