module.exports = (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/auth/login");
  }

  const errors = req.flash('validationErrors');
  const data = req.flash('data')[0];
  const title = data ? data.title : '';
  const body = data ? data.body : '';

  return res.render("create", { errors, title, body, createPost: true });
};