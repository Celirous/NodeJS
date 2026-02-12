const mongoose = require("mongoose");
const { Schema } = mongoose;
const Subscriber = require("./subscriber");
// const bcrypt = require("bcrypt");
const passportLocalMongoose = require("passport-local-mongoose").default;
const randToken = require("rand-token");

const userSchema = new Schema(
  {
    name: {
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
      lowercase: true,
      unique: true,
    },

    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999,
    },

    apiToken: {
      type: String,
    },

    // password: { // we are commenting this out because passport has functions for passwords
    //   type: String,
    //   required: true,
    // },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
  },
  { timestamps: true },
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.plugin(passportLocalMongoose, { //by linking the plugin, you can access all the package built-in methods and functions. 
  usernameField: "email", //this will grab that info from the user with the name of email. Then it will read that email as the user name. 
});

// ====================== we are commenting this out because passport has functions for passwords =====================
// userSchema.pre("save", async function () {
//   let user = this;

//   try {
//     // Hash the user's password
//     const hash = await bcrypt.hash(user.password, 10); // we are taking the user.password that was entered and hashing it for 10 rounds.
//     user.password = hash; // then we update the password value with this new hash value. The hash value is saved on the database so the password will always hash the same for this user
//     // next();
//   } catch (error) {
//     console.log(`Error in hashing password: ${error.message}`);
//     next(error);
//   }
// });

// // Add a function to compare hashed passwords
// userSchema.methods.passwordComparison = function (inputPassword) {
//   let user = this;
//   return bcrypt.compare(inputPassword, user.password);
// };

// ====================== we are commenting this out because passport has functions for passwords =====================

userSchema.pre("save", async function () {
  let user = this;

  if (user.subscribedAccount === undefined) { //if a user is not a subscriber here
    try {
      const subscriber = await Subscriber.findOne({ email: user.email }); //grab the subscribers and look for the user email in there
      user.subscribedAccount = subscriber; //take this subscriber info and save it in the user subscribed account 
      console.log("Pre-save hook ran successfully!");
    } catch (error) {
      console.log(`Error in connecting subscriber: ${error.message}`);
      next(error);
    }
  } else {
    console.log("User linked to subscriber...");
  }
});

userSchema.pre("save", function() { 
  let user = this; // we grab "this" user, the one trying to make an account
  if (!user.apiToken) user.apiToken = randToken.generate(16); //if there is no apiToken linked to this account, we generate one for them and add it to the user.apiToken 
  
  });

module.exports = mongoose.model("User", userSchema);
