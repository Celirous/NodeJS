const express = require("express");
// const path = require("path");

const fileUpload = require("express-fileupload");
const app = new express();
const mongoose = require("mongoose");
// const BlogPost = require("./models/BlogPost.js");


const newPostController = require('./controllers/newPost');
const homeController = require('./controllers/home');
const storePostController = require('./controllers/storePost');
const getPostController = require('./controllers/getPost');
const aboutController = require('./controllers/about')
const contactController = require('./controllers/contact')

const validateMiddleWare = require('./middleware/validationMiddleware');

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

app.use('/posts/store',validateMiddleWare)

app.use(fileUpload());

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

app.get('/',homeController)
app.get('/post/:id',getPostController)
app.post('/posts/store', storePostController)
app.get('/posts/new',newPostController);
app.get('/about',aboutController);
app.get('/contact', contactController);

// ===============================
// Starting the app
// ===============================

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
