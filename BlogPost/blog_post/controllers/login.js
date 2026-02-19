module.exports = (req, res) => {
  const data = req.flash('data')[0];
  const username = data ? data.username : '';

  res.render("login", {
    errors: req.flash('validationErrors'),
    username: username,
  });
};