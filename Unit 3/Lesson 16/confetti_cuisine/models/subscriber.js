// models/subscriber.js

const mongoose = require("mongoose");

// DEFINE THE SHAPE OF A SUBSCRIBER DOCUMENT
const subscriberSchema = mongoose.Schema({
  name: String,
  email: String,
  zipCode: Number
});

// CREATE + EXPORT THE MODEL
module.exports = mongoose.model("Subscriber", subscriberSchema);

// ===============================
// LEARNING NOTES
// ===============================
/*
- A Schema defines what fields a document has
- A Model gives us functions like:
  - Subscriber.find()
  - Subscriber.save()
  - Subscriber.findById()
*/
