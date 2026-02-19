const User = require("../models/User.js");
const path = require("path");

module.exports = async (req, res) => {
  try {
    await User.create(req.body);
    return res.redirect('/');
  } catch (error) {
    const validationErrors = Object.keys(error.errors).map(
      key => error.errors[key].message
    );
    req.flash('validationErrors', validationErrors)
    req.flash('data', req.body)
    // req.session.validationErrors = validationErrors;

    return res.redirect('/auth/register');
  }
};