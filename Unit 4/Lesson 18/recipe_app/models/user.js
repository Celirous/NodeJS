const mongoose = require("mongoose"),
  { Schema } = mongoose, // from here we are grabing the Schema class from mongoose 

  userSchema = new Schema({ //Create the user schema. When you sprecify a new key word, we are telling it that this is a new one and it should not use other data
      name: {
        first: { //Add first and last name properties.
          type: String,
          trim: true, // this will trim the white spaces in the begining and end, so that if you incert 2 names, it wont break. 
        },
        last: {
          type: String,
          trim: true, // by trimming it, it has no spaces and we can edit it as we need when incerting it or outputting it as a log or something. 
        },
      },
      email: { // Adding email properties
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },
      zipCode: { // Adding zipCode properties
        type: Number,
        min: [10000, "Zip code too short"],
        max: 99999,
      },
      password: { // Adding password properties
        type: String,
        required: true,
      },
      courses: [{ type: Schema.Types.ObjectId, ref: "Course" }], // Add a courses property to connect users to courses. By using ref: Course, we are telling it, it needs to get this info from the course.js model. This has [] because it is an array, so a user can be assosiated with mutiple courses
      subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" }, //Add a subscribedAccount to connect users to subscribers. The reason it is not in [] is because we only want this to be assosiated with one user for now. So it is not looking at user array, just this one now. If you only want to assosiate this subscriber to one account. 
    },
    {
      timestamps: true, // Add a timestamps property to record createdAt and updatedAt dates. This way we can keep record of when the account was made. There is no user input, mongoose does this. Mongoose will make 2 fields, 1) CreatedAt field and when you update info it will say 2) UpdatedAt. 
    }
  );

userSchema.virtual("fullName").get(function() { //the .virtual does not get saved in the database, we can see the result because we are returning it, but the data does not get saved.
    return `${this.name.first} ${this.name.last}`;
});

module.exports = mongoose.model("User", userSchema);