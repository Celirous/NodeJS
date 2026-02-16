const express = require("express");
const path = require("path");

const app = new express();
const mongoose = require("mongoose");

const BlogPost = require("./models/BlogPost.js");

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

// ===============================
// Routes
// ===============================

app.get("/", async (req, res) => {
  const blogposts = await BlogPost.find({});
//   console.log(blogposts);
  res.render("index", {
    blogposts,
  });
});

app.get("/about", (req, res) => {
  res.render("about");
  //   res.sendFile(path.resolve(__dirname, "pages/about.html"));
});

app.get("/contact", (req, res) => {
  res.render("contact");
  //   res.sendFile(path.resolve(__dirname, "pages/contact.html"));
});

app.get("/post/:id", async (req, res) => {
  const blogpost = await BlogPost.findById(req.params.id);
  res.render("post", {
    blogpost,
  });
});

app.get("/posts/new", (req, res) => {
  res.render("create");
});

app.post("/posts/store", async (req, res) => {
  await BlogPost.create(req.body);
  res.redirect("/");
});

// ===============================
// Starting the app
// ===============================

app.listen(4000, () => {
  console.log("App listening on port 4000");
});
