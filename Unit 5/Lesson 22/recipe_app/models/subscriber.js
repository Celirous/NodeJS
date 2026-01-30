const mongoose = require("mongoose");

//This section is for adding new people in the database
const subscriberSchema = new mongoose.Schema({
  name: {
    //Require the name property.
    type: String,
    required: true,
  },
  email: {
    // Require the email property, and add the lowercase property.
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  zipCode: {
    //Set up the zipCode property with a custom error message.
    type: Number,
    min: [100, "Zip code too short"],
    max: 99999,
  },
  courses: [{type: mongoose.Schema.Types.ObjectId, ref: "Course"}]
});


//This section is for searching(Querying) your current database
subscriberSchema.methods.getInfo = function () { //Add an instance method to get the full name of a subscriber.
  return `Name: ${this.name} Email: ${this.email} Zip Code:${this.zipCode}`;
};
subscriberSchema.methods.findLocalSubscribers = function () { // Add an instance method to find subscribers with the same ZIP code.
  return this.model("Subscriber").find({ zipCode: this.zipCode }).exec(); //Access the Subscriber model to use the find method.
};

module.exports = mongoose.model("Subscriber", subscriberSchema); // "Subscriber" is what we are be going to call this "schema". We are also exporting this becaause we want to use it in different files
