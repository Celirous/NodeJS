const BlogPost = require("../models/BlogPost.js");
const User = require("../models/User.js");
const path = require("path");

module.exports = (req, res) => {
  // Validate required fields before attempting image upload
  const errors = [];
  if (!req.body.title || req.body.title.trim() === '') errors.push('A title is required.');
  if (!req.body.body || req.body.body.trim() === '') errors.push('A body is required.');
  if (!req.files || !req.files.image) errors.push('An image is required.');

  if (errors.length > 0) {
    req.flash('validationErrors', errors);
    req.flash('data', req.body);
    return res.redirect('/posts/new');
  }

  let image = req.files.image;

  image.mv(
    path.resolve(__dirname, "..", "public/assets/img", image.name),
    async (error) => {
      if (error) {
        console.error("Image upload error:", error);
        req.flash('validationErrors', ['Failed to upload image. Please try again.']);
        req.flash('data', req.body);
        return res.redirect("/posts/new");
      }

      // Find the logged-in user
      const user = await User.findById(req.session.userId);

      await BlogPost.create({
        ...req.body,
        image: "/assets/img/" + image.name,
        userid: req.session.userId
      });

      res.redirect("/");
    }
  );
};