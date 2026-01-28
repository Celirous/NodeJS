const mongoose = require("mongoose"); // Require Mongoose in REPL.
const Subscriber = require("./models/subscriber"); // Assign the Subscriber model to a variable, using the model name and local project file.
const Course = require("./models/course"); // This is requiring the course file we have in the models folder
const User = require("./models/user")

mongoose.connect("mongodb://localhost:27017/recipe_db"); //Set up a database connection, using recipe_db.

// Creating a new user: Using promises, but we wont use this
//Using promises, but we wont use this
// ============================
// var testUser;
// User.create({
//   name: {
//     first: "Jon",
//     last: "Wexler",
//   },
//   email: "jon@jonwexler.com",
//   password: "pass123",
// })
//   .then((user) => (testUser = user))
//   .catch((error) => console.log(error.message));

// We are going to make a user, link it to subscribers and then output this info for us 
// =============================================

async function createAndLinkUser() {
  try {
    const testUser = await User.create({
      name: {
        first: "Professor",
        last: "Souffle"
      },
      email: "souffle@recipeapp.com",
      password: "pass123"
    });
    
    const subscriber = await Subscriber.findOne({ email: testUser.email });
    
    testUser.subscribedAccount = subscriber;
    await testUser.save();
    
    console.log("user updated");
    return testUser;
  } catch (error) {
    console.log(error.message);
  }
}
createAndLinkUser();


// This is using the Async and Await. So that one function can run at a time, promises all run at once 
// =============================================
// async function createTestUser() { //we specify that it is going to be a async function. This means we tell the code to wait before it can do certain things
//   try { //we say try because it needs to try this first 
//     const testUser = await User.create({ //we tell the code to wait, action this before moving on. 
//       name: {
//         first: "Jannet",
//         last: "Status"
//       },
//       email: "jannet@status.com",
//       password: "pass123"
//     });
//     console.log(testUser); 
//     return testUser;
//   } catch (error) { // if the try failed, it will output the error for us. It "catches" the failure
//     console.log(error.message);
//   }
// }
// createTestUser(); // We now actually call on the function to run

// // ======================================

// Subscriber.create({
//   name: "Jannet Status",
//   email: "jannet@status.com",
//   zipCode: "12345",
// })
//   .then((subscriber) => console.log(subscriber))
//   .catch((error) => console.log(error.message)); // Create a new subscriber document.



// async function findSubscriber() {
//   try {
//     const targetSubscriber = await Subscriber.findOne({ email: testUser.email });
//     console.log(targetSubscriber);
//     return targetSubscriber;
//   } catch (error) {
//     console.log(error.message);
//   }
// }
// findSubscriber();


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

// // AI CODE - WORKING because this is making it run step by step. This, then this, then this.
// Course.create({
//   title: "Tomato2 Land",
//   description: "Locally farmed tomatoes only2",
//   zipCode: 12345,
//   items: ["cherry", "heirloom"]
// })
// .then(course => {
//   return Subscriber.findOne({}).then(subscriber => {
//     subscriber.courses.push(course._id);
//     return subscriber.save();
//   });
// })
// .then(subscriber => {
//   return Subscriber.populate(subscriber, "courses");
// })
// .then(subscriber => {
//   console.log(subscriber);
// })
// .catch(err => console.error(err));
