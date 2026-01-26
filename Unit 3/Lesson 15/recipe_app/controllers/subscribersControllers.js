const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber"); // this is telling us we require the subscriber module

exports.getAllSubscribers = (req, res, next) => {
  // Export getAllSubscribers to pass data from the database to the next middleware function.
  Subscriber.find({}) // the "{}" is blank so it will show us all the data in the Subscribers database.
    .exec() // this is better than .save because it makes a TRUE PROMISE. .save just saves the file but does not make a true promise. 
    .then((subscribers) => {
      req.data = subscribers;
      next();
    })
    .catch((error) => {
      console.log(error.message);
      next(error);
    })
    .then(() => {
        console.log("promise complete");
    });
};

exports.displaySubscribers = (req, res, next) => {
  console.log(req.data);
  // res.send(req.data);
  res.render("subscribers", { subscribers: req.data });
};

exports.getSubscriptionPage = (req, res) => { //Add an action to render the contact page.
  res.render("contact");
};
exports.saveSubscriber = (req, res) => { // Add an action to save subscribers.
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  }); // Create a new subscriber.
  newSubscriber
    .save() // No callback - returns a Promise. This can take a while 
    .then((result) => { // "then", if the files exists, it will then return
      res.render("thanks");
    })
    .catch((error) => {
      res.send(error);
    });
};
