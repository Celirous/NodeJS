const bcrypt = require('bcrypt')
const User = require('../models/User')

module.exports = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      req.flash('validationErrors', ['Invalid username or password.']);
      req.flash('data', req.body);
      return res.redirect('/auth/login');
    }

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      req.flash('validationErrors', ['Invalid username or password.']);
      req.flash('data', req.body);
      return res.redirect('/auth/login');
    }

    req.session.userId = user._id;

    console.log("Succesfull login");
    res.redirect('/');
  } catch (err) {
    console.log(err);
    req.flash('validationErrors', ['Something went wrong. Please try again.']);
    req.flash('data', req.body);
    res.redirect('/auth/login');
  }
};