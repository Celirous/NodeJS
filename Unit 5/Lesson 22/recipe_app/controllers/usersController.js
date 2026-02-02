const User = require("../models/user");

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
    res.render("users/index", {
      flashMessages: {
        success: "Loaded all users!"
      }
    })
  },

  new: (req, res) => {
    res.render("users/new");
  },

  create: async (req, res, next) => {
    const getUserParams = (body) => {
      return {
        name: {
          first: body.first,
          last: body.last,
        },
        email: body.email,
        password: body.password,
        zipCode: body.zipCode,
      };
    };

    try {
      let userParams = getUserParams(req.body);

      const user = await User.create(userParams);
      req.flash("success", `${user.fullName}'s account created successfully!`);

      res.locals.redirect = "/users";
      res.locals.user = user;
      next();
    } catch (error) {
      console.log(`Error saving user: ${error.message}`);

      res.locals.redirect = "/users/new";
      req.flash(
        "error", `Failed to create user account because: ➥${error.message}.`
      );

      next();
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: async (req, res, next) => {
    try {
      let userId = req.params.id; // when we click on the name it will save that id to this rn
      const user = await User.findById(userId); // it will now look for the user
      res.locals.user = user; // it will store that user in this local thing
      next(); // this will now run the showView below
    } catch (error) {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render("users/show"); //this will render the show user page with all the details on it
  },

  edit: async (req, res, next) => {
    let userId = req.params.id;

    try {
      let user = await User.findById(userId);
      res.render("users/edit", { user: user });
    } catch (error) {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    let userId = req.params.id;
    let userParams = {
      name: {
        first: req.body.first,
        last: req.body.last,
      },
      email: req.body.email,
      password: req.body.password,
      zipCode: req.body.zipCode,
    };

    try {
      let user = await User.findByIdAndUpdate(userId, { $set: userParams });
      res.locals.redirect = `/users/${userId}`;
      res.locals.user = user;
      next();
    } catch (error) {
      console.log(`Error updating user by ID: ${error.message}`);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    let userId = req.params.id;

    try {
      await User.findByIdAndDelete(userId);
      res.locals.redirect = "/users";
      next();
    } catch (error) {
      console.log(`Error deleting user by ID: ${error.message}`);
      next(error);
    }
  },
};
