const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({ //Create a new schema with mongoose.Schema. A JavaScript object is what a schema is
  name: String, //Add schema properties. So the info we want as values in the keys
  email: String,
  zipCode: Number,
});

module.exports = mongoose.model("Subscriber", subscriberSchema); // "Subscriber" is what we are be going to call this "schema". We are also exporting this becaause we want to use it in different files