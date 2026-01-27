const User = require("../models/user");


// module.exports = {
//   index: async (req, res) => {
//     try {
//       const users = await User.find({});
//       res.render("users/index", { users: users });
//     } catch (error) {
//       console.log(`Error fetching users: ${error.message}`);
//       res.redirect("/");
//     }
//   }
// };

//This is better because of the way it structors the code, it seperates the database query functions
module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find();
      res.locals.users = users;
      next();
    } catch (error) {
      console.log(`Error fetching users: ${error.message}`);
      next(error);
    }
  },
 indexView: (req, res) => {
res.render("users/index");
  }
};