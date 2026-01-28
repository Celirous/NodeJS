const mongoose = require("mongoose");
const { Schema } = require("mongoose");

courseSchema = new Schema(
  {
    title: { //Require title and description.
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    maxStudents: { // Default maxStudents and cost to 0, and disallow negative numbers.
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative number of students"],
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, "Course cannot have a negative cost"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Course", courseSchema);
