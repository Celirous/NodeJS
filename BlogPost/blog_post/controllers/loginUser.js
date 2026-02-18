const bcrypt = require('bcrypt')
const User = require('../models/User')


module.exports = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (!user) return res.redirect('/auth/login');

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) return res.redirect('/auth/login');

    req.session.userId = user._id;

    console.log("Succesfull login");
    res.redirect('/');
  } catch (err) {
    console.log(err);
    res.redirect('/auth/login');
  }
};