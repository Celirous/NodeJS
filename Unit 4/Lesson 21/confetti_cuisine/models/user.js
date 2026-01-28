const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Subscriber = require("./subscriber");

userSchema = new Schema(
  {
    name: {
      // Add first and last name attributes.
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999,
    },
    password: {
      type: String,
      required: true, // Require password.
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course", // Associate users with multiple courses.
      },
    ],
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber", // Associate users with subscribers.
    },
  },
  {
    timestamps: true, // Add timestamps property.
  }
);

userSchema.virtual("fullName").get(function() { // Add the fullName virtual attribute.
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", async function (next) { // Add a pre(‘save’) hook to link a subscriber.
  let user = this;
  
  if (user.subscribedAccount === undefined) { // Check for a linked subscribedAccount
    try {
      const subscriber = await Subscriber.findOne({
        email: user.email
      }); // Search the Subscriber model for documents that contain that user’s email.
      user.subscribedAccount = subscriber;
      next(); //Call the next middleware function.
    } catch (error) {
      console.log(`Error in connecting subscriber: ${error.message}`);
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
