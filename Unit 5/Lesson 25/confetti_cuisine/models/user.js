const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const bcrypt = require("bcrypt");

const Subscriber = require("./subscriber");

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
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [10000, "Zip code too short"],
      max: 99999,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", async function (next) {
  let user = this;

  if (user.subscribedAccount === undefined) {
    try {
      const subscriber = await Subscriber.findOne({
        email: user.email,
      });
      user.subscribedAccount = subscriber;
      //   next();
    } catch (error) {
      console.log(`Error in connecting subscriber: ${error.message}`);
      //   next(error);
    }
  } else {
    // next();
  }
});

userSchema.pre("save", async function (next) {
  let user = this; // we are going to grab "this" user and save it in the var user to use it in the function

  try {
    // Hash the user's password
    const hash = await bcrypt.hash(user.password, 10); // we grab the password of the user.password, then we hash it 10(thousand) times and save it in the var hash
    user.password = hash; // we take the user password and we update it on the system to be the hash
    // next();
  } catch (error) {
    console.log(`Error in hashing password: ${error.message}`);
    next(error);
  }
});

// Add a function to compare hashed passwords
userSchema.methods.passwordComparison = function (inputPassword) {
  let user = this; // it grabs the user trying to login info and save it in the var user
  return bcrypt.compare(inputPassword, user.password); // with this, we are taking the input password, hash it again, then compare this hash with the internal saved hash.
};

module.exports = mongoose.model("User", userSchema);
