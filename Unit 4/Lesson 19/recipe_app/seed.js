const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");

mongoose.connect("mongodb://localhost:27017/recipe_db", {}); //Set up the connection to the database.

let db = mongoose.connection;

db.once("open", () => {
  console.log("Hey AJ, we are connected to the recipe_db successfully");
});

let contacts = [
  {
    name: "Jon Snow",
    email: "jon@snow.com",
    zipCode: 10016,
  },
  {
    name: "Chef Eggplant",
    email: "eggplant@recipeapp.com",
    zipCode: 20331,
  },
  {
    name: "Professor Souffle",
    email: "souffle@recipeapp.com",
    zipCode: 19103,
  },
];

// IMPORTANT: Delete all existing subscribers FIRST, THEN create new ones
// This prevents race conditions where old and new data mix together
Subscriber.deleteMany()
  .exec() // Remove all existing data using a function
  .then(() => {
    console.log("Subscriber data is empty!");

    // NOW create the new subscribers AFTER delete is complete
    // This code runs INSIDE the .then() so it waits for deletion to finish
    let commands = [];

    contacts.forEach((c) => {
      //Loop through subscriber objects to create promises.
      commands.push(
        // push is adding it to the empty array we have above, "commands"
        Subscriber.create({
          name: c.name,
          email: c.email,
          zipCode: c.zipCode, // Make sure this matches your schema (capital C in zipCode)
        })
      );
    });

    // Return the promise so it chains properly to the next .then()
    return Promise.all(commands);
  })
  .then((r) => {
    // Log confirmation after promises resolve.
    console.log(JSON.stringify(r));
    console.log("All subscribers created successfully!");
    mongoose.connection.close(); // Close the connection when done
  })
  .catch((error) => {
    console.log(`ERROR: ${error}`);
    mongoose.connection.close(); // Close connection even if there's an error
  });
