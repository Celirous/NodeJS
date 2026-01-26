const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res) => {
    Subscriber.find({})
        .exec()
        .then((subscribers) => {
            console.log("We are getting all your subs");
            res.render("subscribers", {
                subscribers: subscribers
            });
        })
        .catch((error) => {
            console.log(error.message);
            return [];
        })
        .then(() => {
            console.log("promise complete");
        });
};

exports.getSubscriptionPage = (req, res) => {
    res.render("contact");
};

exports.saveSubscriber = (req, res) => {
    let newSubscriber = new Subscriber({
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode
    });
    newSubscriber.save()
        .then(() => {
          console.log(`Here is all your contacts for the console log: ${newSubscriber}`);
            res.render("thanks");
        })
        .catch(error => {
            res.send(error);
        });
};

// ===============================
// CONTROLLER SUMMARY
// ===============================
/*
This controller handles all subscriber-related actions for the application.

It uses the Subscriber Mongoose model to:
- Retrieve all subscribers from MongoDB and render them on the subscribers page
- Display the contact (subscription) form
- Save a new subscriber to the database when the form is submitted

All database operations are asynchronous and use Promises with .then() and .catch()
to handle successful queries and errors.

Overall, this file connects the routes to the database logic and controls
what data is sent to each view.
*/
