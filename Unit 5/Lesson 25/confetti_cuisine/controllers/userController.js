const User = require("../models/user");

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

module.exports = {
  index: async (req, res, next) => {
    try {
      const users = await User.find();
      res.locals.users = users;
      console.log(`Found users: ${users}`);
      next();
    } catch (error) {
      console.log(`Error fetching users: ${error.message}`);
      next(error);
    }
  },

  indexView: (req, res) => {
    res.render("users/index");
  },

  login: (req, res) => {
    res.render("users/login");
  },

  new: (req, res) => {
    res.render("users/new");
  },

  // create: async (req, res, next) => {
  //   try {
  //     let userParams = getUserParams(req.body);
  //     console.log(userParams);
  //     const user = await User.create(userParams);
  //     res.locals.redirect = "/users";
  //     res.locals.user = user;
  //     console.log(`Created user: ${user}`);
  //     next();
  //   } catch (error) {
  //     console.log(`Error saving user: ${error.message}`);
  //     next(error);
  //   }
  // },

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
        "error",
        `Failed to create user account because: ➥${error.message}.`,
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
      let userId = req.params.id;
      const user = await User.findById(userId);
      res.locals.user = user;
      console.log(`found user info: ${user}`);
      next();
    } catch (error) {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render("users/show");
  },

  edit: async (req, res, next) => {
    let userId = req.params.id;
    try {
      let user = await User.findById(userId);
      res.render("users/edit", {
        user: user,
      });
    } catch (error) {
      console.log(`Error fetching user by ID: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    let userId = req.params.id;
    let userParams = getUserParams(req.body);
    console.log(
      `userParams before: name:${userParams.name} | email:${userParams.email} | zipCode:${userParams.zipCode}`,
    );
    try {
      let user = await User.findByIdAndUpdate(userId, {
        $set: userParams,
      });
      res.locals.redirect = `/users/${userId}`;
      res.locals.user = user;
      console.log(`userParams after: ${user}`);
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
      console.log(`deleted User: ${userId}`);
      req.flash("success", `User deleted successfully!`);
      next();
    } catch (error) {
      console.log(`Error deleting user by ID: ${error.message}`);
      next(error);
    }
  },
  authenticate: async (req, res, next) => {
    try {
      // Check whether a user is found
      const user = await User.findOne({ email: req.body.email }); // we grab the email that was inputed and check if there is an email like that on our system.

      if (user) {
        // Call the password comparison method on the User model
        const passwordsMatch = await user.passwordComparison(req.body.password); // this compares the new hash password with the stored hash on the database

        if (passwordsMatch) {
          res.locals.redirect = `/users/${user._id}`;
          req.flash("success", `${user.fullName}'s logged in successfully!`);
          res.locals.user = user;
        } else {
          req.flash(
            "error",
            "Failed to log in user account: Incorrect Password.",
          );
          res.locals.redirect = "/users/login";
        }
        next();
      } else {
        // User account not found
        req.flash(
          "error",
          "Failed to log in user account: User account not found.",
        );
        res.locals.redirect = "/users/login";
        next();
      }
    } catch (error) {
      console.log(`Error logging in user: ${error.message}`);
      next(error);
    }
  },

  validate: async (req, res, next) => {
    // Validate and sanitize fields
    req.sanitizeBody("email").normalizeEmail({ all_lowercase: true });
    req.sanitizeBody("email").trim(); //this cleans up the code so that no matter how you input it, it always reads and saves the same

    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({ min: 5, max: 5 });
    req.check("password", "Password cannot be empty").notEmpty();

    try {
      // Collect the results of previous validations
      const error = await req.getValidationResult(); // if there are some validations that did not pass, we will store it in the error object.

      if (!error.isEmpty()) {
        //if there are errors, we will output each error out for us.
        let messages = error.array().map((e) => e.msg);
        req.skip = true; // Set skip property to true
        req.flash("error", messages.join(" and ")); // we take the error messages and join them into a string.
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    } catch (err) {
      console.log(`Error in validation: ${err.message}`);
      next(err);
    }
  },
};
