
const Subscriber = require("../models/subscriber");

const getSubscriberParams = (body) => {
  return {
    name: body.name,
    email: body.email,
    zipCode: parseInt(body.zipCode)
  };
};

module.exports = {

  index: async (req, res, next) => {
    try {
      const subscribers = await Subscriber.find();
      res.locals.subscribers = subscribers;
      console.log(`Found subscribers: ${subscribers}`);
      next();
    } catch (error) {
      console.log(`Error fetching subscribers: ${error.message}`);
      next(error);
    }
  },

  indexView: (req, res) => {
    res.render("subscribers/index");
  },

  new: (req, res) => {
    res.render("subscribers/new");
  },

  create: async (req, res, next) => {
    try {
      let subscriberParams = getSubscriberParams(req.body);
      const subscriber = await Subscriber.create(subscriberParams);
      res.locals.redirect = "/subscribers";
      res.locals.subscriber = subscriber;
      console.log(`Created subscriber: ${subscriber}`);
      next();
    } catch (error) {
      console.log(`Error saving subscriber: ${error.message}`);
      next(error);
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: async (req, res, next) => {
    try {
      let subscriberId = req.params.id;
      const subscriber = await Subscriber.findById(subscriberId);
      res.locals.subscriber = subscriber;
      console.log(`found subscriber info: ${subscriber}`);
      next();
    } catch (error) {
      console.log(`Error fetching subscriber by ID: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render("subscribers/show");
  },

  edit: async (req, res, next) => {
    let subscriberId = req.params.id;
    try {
      let subscriber = await Subscriber.findById(subscriberId);
      res.render("subscribers/edit", {
        subscriber: subscriber
      });
    } catch (error) {
      console.log(`Error fetching subscriber by ID: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    let subscriberId = req.params.id;
    let subscriberParams = getSubscriberParams(req.body);
    console.log(`subscriberParams before: name:${subscriberParams.name} | email:${subscriberParams.email} | zipCode:${subscriberParams.zipCode}`);
    try {
      let subscriber = await Subscriber.findByIdAndUpdate(subscriberId, {
        $set: subscriberParams
      });
      res.locals.redirect = `/subscribers/${subscriberId}`;
      res.locals.subscriber = subscriber;
      console.log(`subscriberParams after: ${subscriber}`);
      next();
    } catch (error) {
      console.log(`Error updating subscriber by ID: ${error.message}`);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    let subscriberId = req.params.id;
    try {
      await Subscriber.findByIdAndDelete(subscriberId);
      res.locals.redirect = "/subscribers";
      console.log(`deleted Subscriber: ${subscriberId}`);
      next();
    } catch (error) {
      console.log(`Error deleting subscriber by ID: ${error.message}`);
      next(error);
    }
  }
};


// =================================== OLD CODE =============================================


// const Subscriber = require("../models/subscriber");

// module.exports = {
//   getAllSubscribers: async (req, res, next) => {
//     try {
//       const subscribers = await Subscriber.find({});
//       console.log("We are getting all your subs");
//       res.render("subscribers", {
//         subscribers: subscribers
//       });
//     } catch (error) {
//       console.log(`Error fetching subscribers: ${error.message}`);
//       next(error);
//     }
//   },

//   getSubscriptionPage: (req, res) => {
//     res.render("contact");
//   },

//   saveSubscriber: async (req, res, next) => {
//     try {
//       let newSubscriber = new Subscriber({
//         name: req.body.name,
//         email: req.body.email,
//         zipCode: req.body.zipCode
//       });
      
//       await newSubscriber.save();
//       console.log(`Here is all your contacts for the console log: ${newSubscriber}`);
//       res.render("thanks");
//     } catch (error) {
//       console.log(`Error saving subscriber: ${error.message}`);
//       next(error);
//     }
//   },
// };

// ===============================
// CONTROLLER SUMMARY
// ===============================
/*
This controller handles all subscriber-related actions for the application.
It uses the Subscriber Mongoose model to:
- Retrieve all subscribers from MongoDB and render them on the subscribers page
- Display the contact (subscription) form
- Save a new subscriber to the database when the form is submitted

All database operations are asynchronous and use async/await syntax with 
try/catch blocks to handle successful queries and errors.

Overall, this file connects the routes to the database logic and controls
what data is sent to each view.
*/