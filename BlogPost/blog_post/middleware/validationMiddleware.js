

module.exports = async (req, res) => {
    if (req.files == null || req.body.title == null) {
    return res.redirect("/posts/new");
  }
  next();
}