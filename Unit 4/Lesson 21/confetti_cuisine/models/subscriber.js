const mongoose = require("mongoose"); //Require mongoose.
const { Schema } = mongoose; //Add schema properties.


subscriberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999,
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], //Associate multiple courses.
  },
  {
    timestamps: true,
  }
);

subscriberSchema.methods.getInfo = function () { //Add a getInfo instance method.
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

module.exports = mongoose.model("Subscriber", subscriberSchema); // Export the Subscriber model.
