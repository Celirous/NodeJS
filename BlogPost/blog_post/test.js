const mongoose = require("mongoose");
const BlogPost = require("./models/BlogPost");

async function run() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost/blog_post");
    console.log("Successfully connected to MongoDB using Mongoose!");

    // Create a new blog post
    const blogpost = await BlogPost.create({
      title: "The Mythbuster Guide to Saving Money on Energy Bills",
      body: "If you have been here a long time, you might remember when I went on ITV Tonight to dispense a masterclass in saving money on energy bills. Energy-saving is one of my favourite money topics, because once you get past the boring bullet-point lists, a whole new world of thrifty nerdery opens up.",
    });

    console.log("Blog post created:", blogpost);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Close the connection when done
    await mongoose.connection.close();
  }
}

run();
