const User = require("../models/User.js");
const path = require("path");

module.exports = async (req, res) => {
  try {
    await User.create(req.body);
    console.log("User has been registered succesfully")
    res.redirect("/");
  } catch (error) {
    console.log(error);
    res.redirect("/auth/register");
  }
};