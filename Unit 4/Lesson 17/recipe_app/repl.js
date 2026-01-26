const mongoose = require("mongoose"); // Require Mongoose in REPL.
const Subscriber = require("./models/subscriber"); // Assign the Subscriber model to a variable, using the model name and local project file.
const Course = require("./models/course"); // This is requiring the course file we have in the models folder

mongoose.connect("mongodb://localhost:27017/recipe_db"); //Set up a database connection, using recipe_db.



// // Here we are going to create a new subscriber and then output their info into the console to make sure it was added.
// // =================================================================================

// Subscriber.create({
//   name: "Bhabha",
//   email: "bhabha@september.com",
//   zipCode: "12345",
// })
//   .then((subscriber) => console.log(subscriber))
//   .catch((error) => console.log(error.message)); // Create a new subscriber document.

// let subscriber; // Set up a variable to hold query results.

// Subscriber.findOne({
//   name: "Bhabha",
// }).then((result) => {
//   subscriber = result;
//   console.log(subscriber.getInfo());
// });

// We are now going to be adding courses to people
// =================================================================================
let testCourse, testSubscriber; // Set up two variables outside the promise chain.


// BROKEN CODE - so it breaks because everything wants to run at the same time. 
// Course.create({ 
//   title: "Potato Land",
//   description: "Locally farmed tomatoes only",
//   zipCode: 12345,
//   items: ["cherry", "heirloom"],
// }).then((course) => (testCourse = course)); // Create a new course instance.

// Subscriber.findOne({name: "Bhabha"}).then((subscriber) => (testSubscriber = subscriber)); // Find a subscriber.

// testSubscriber.courses.push(testCourse._id); //Push the testCourse course into the courses array of testSubscriber.

// testSubscriber.save(); // Save the model instance again.

// Subscriber.populate(testSubscriber, "courses")
//   .then(subscriber =>
//     console.log(subscriber) //Use populate on the model.
// );

// AI CODE - WORKING because this is making it run step by step. This, then this, then this. 
Course.create({
  title: "Tomato2 Land",
  description: "Locally farmed tomatoes only2",
  zipCode: 12345,
  items: ["cherry", "heirloom"]
})
.then(course => {
  return Subscriber.findOne({}).then(subscriber => {
    subscriber.courses.push(course._id);
    return subscriber.save();
  });
})
.then(subscriber => {
  return Subscriber.populate(subscriber, "courses");
})
.then(subscriber => {
  console.log(subscriber);
})
.catch(err => console.error(err));