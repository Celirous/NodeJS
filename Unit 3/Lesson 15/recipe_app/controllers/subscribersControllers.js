const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber"); // this is telling us we require the subscriber module

exports.getAllSubscribers = (req, res, next) => {
  // Export getAllSubscribers to pass data from the database to the next middleware function.
  Subscriber.find({}) // the "{}" is blank so it will show us all the data in the Subscribers database.
    .then((subscribers) => {
      req.data = subscribers;
      next();
    })
    .catch((error) => {
      next(error);
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
  newSubscriber.save() // No callback - returns a Promise
    .then((result) => {
      res.render("thanks");
    })
    .catch((error) => {
      res.send(error);
    });
};
