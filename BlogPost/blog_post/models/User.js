const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require('mongoose-unique-validator').default;

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a Username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a Password"],
  },
});

UserSchema.plugin(uniqueValidator);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
