const BlogPost = require("../models/BlogPost.js");
const User = require("../models/User.js");
const path = require("path");

module.exports = (req, res) => {
  let image = req.files.image;

  image.mv(
    path.resolve(__dirname, "..", "public/assets/img", image.name),
    async (error) => {
      if (error) {
        console.error("Image upload error:", error);
        return res.redirect("/posts/new");
      }

      // Find the logged-in user
      const user = await User.findById(req.session.userId);

      await BlogPost.create({
        ...req.body,
        image: "/assets/img/" + image.name,
        username: user ? user.username : "Anonymous"
      });

      res.redirect("/");
    }
  );
};
