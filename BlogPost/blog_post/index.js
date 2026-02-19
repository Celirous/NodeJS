const express = require("express");
// const path = require("path");

const fileUpload = require("express-fileupload");
const app = new express();
const mongoose = require("mongoose");
// const BlogPost = require("./models/BlogPost.js");
const flash = require('connect-flash');

const newPostController = require("./controllers/newPost");
const homeController = require("./controllers/home");
const storePostController = require("./controllers/storePost");
const getPostController = require("./controllers/getPost");
const aboutController = require("./controllers/about");
const contactController = require("./controllers/contact");
const newUserController = require("./controllers/newUser");
const storeUserController = require("./controllers/storeUser");
const loginController = require("./controllers/login");
const loginUserController = require("./controllers/loginUser");
const logoutController = require('./controllers/logout');


// const validateMiddleWare = require("./middleware/validationMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");

const expressSession = require("express-session");

// const validateMiddleWare = (req, res, next) => {
//   if (req.files == null || req.body.title == null) {
//     return res.redirect("/posts/new");
//   }
//   next();
// };

app.set("view engine", "ejs");

// ===============================
// DATABASE CONNECTION
// ===============================

mongoose.connect("mongodb://localhost/blog_post");

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// ===============================
// Middle Ware
// ===============================

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded());

app.use(
  expressSession({
    secret: "keyboard cat",
  }),
);

app.use(fileUpload());
app.use(flash());

global.loggedIn = null;

app.use((req, res, next) => {
  global.loggedIn = req.session.userId;
  next();
});

// ===============================
// Routes
// ===============================

// app.get("/", async (req, res) => {
//   const blogposts = await BlogPost.find({});
//   //   console.log(blogposts);
//   res.render("index", {
//     blogposts,
//   });
// });

// app.get("/about", (req, res) => {
//   res.render("about");
//   //   res.sendFile(path.resolve(__dirname, "pages/about.html"));
// });

// app.get("/contact", (req, res) => {
//   res.render("contact");
//   //   res.sendFile(path.resolve(__dirname, "pages/contact.html"));
// });

// app.get("/post/:id", async (req, res) => {
//   const blogpost = await BlogPost.findById(req.params.id);
//   res.render("post", {
//     blogpost,
//   });
// });

// app.post("/posts/store", (req, res) => {
//   let image = req.files.image;

//   image.mv(
//     path.resolve(__dirname, "public/assets/img", image.name),
//     async (error) => {
//       await BlogPost.create({
//         ...req.body,
//         image: "/assets/img/" + image.name,
//       });
//       res.redirect("/");
//     },
//   );
// });

app.get("/", homeController);
app.get("/post/:id", getPostController);
app.post("/posts/store", authMiddleware, storePostController);
app.get("/posts/new", authMiddleware, newPostController);
app.get("/about", aboutController);
app.get("/contact", contactController);
app.get("/auth/register", redirectIfAuthenticatedMiddleware, newUserController);
app.post(
  "/users/register",
  redirectIfAuthenticatedMiddleware,
  storeUserController,
);
app.get("/auth/login", redirectIfAuthenticatedMiddleware, loginController);
app.post(
  "/users/login",
  redirectIfAuthenticatedMiddleware,
  loginUserController,
);
app.get('/auth/logout', logoutController);

app.use((req, res) => res.render('notfound'));

// ===============================
// Starting the app
// ===============================

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
