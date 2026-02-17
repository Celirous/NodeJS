const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const BlogPostSchema = new Schema({
  title: String,
  body: String,

  datePosted:{
    type: Date,
    default: new Date()
  },

  image: String,
  username: String,
});

const BlogPost = mongoose.model('BlogPost',BlogPostSchema);

module.exports = BlogPost