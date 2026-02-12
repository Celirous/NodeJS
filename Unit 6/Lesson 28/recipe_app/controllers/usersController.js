const User = require("../models/user");
const validator = require("express-validator");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const token = process.env.TOKEN || "recipeT0k3n"; // the .env is where you add all the sensitive data and private data. API keys, tokens and passwords. We will then set const for this so that we can access this info. In this case we are not making an .env, we are hard coding a token here because if the process.env.TOKEN is not available, so we have an or (||) with the hard codede value
const jsonWebToken = require("jsonwebtoken"); //each time you login, it will make a new webtoken. This is because if an account is hacked, it will not allow the hacker to access the account because it will change. It is to make sure your API token cannot be missused.
const httpStatus = require("http-status-codes");

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
        success: "Loaded all users!",
      },
    });
  },

  new: (req, res) => {
    res.render("users/new", {
      user: res.locals.user || {
        name: { first: "", last: "" },
        email: "",
        zipCode: "",
      },
    });
  },

  create: async (req, res, next) => {
    const getUserParams = (body) => {
      return {
        name: {
          first: body.first,
          last: body.last,
        },
        email: body.email,
        zipCode: body.zipCode,
      };
    };

    try {
      let userParams = getUserParams(req.body);

      // Create a new user instance (without password)
      const newUser = new User(userParams);

      // Use passport-local-mongoose's register method to hash the password
      const user = await User.register(newUser, req.body.password); //the register method now adds that user to the database, then it will hash the password and the salt value, those will then be stored into the database
      // Salt - Random string added to password
      // Salt rounds - number of times to run hashing algorithm

      req.flash("success", `${user.fullName}'s account created successfully!`); // we just giving a flash message to let us know the user has been made.

      res.locals.redirect = "/users";
      res.locals.user = user;
      next();
    } catch (error) {
      console.log(`Error saving user: ${error.message}`);

      res.locals.redirect = "/users/new";
      req.flash(
        "error",
        `Failed to create user account because: ${error.message}.`,
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
      const user = await User.findById(userId).populate("courses");
      res.locals.user = user;
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

  login: (req, res) => {
    res.render("users/login");
  },

  authenticate: (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("error", "Failed to login.");
        return res.redirect("/users/login");
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", `${user.fullName}'s logged in successfully!`);
        return res.redirect("/");
      });
    })(req, res, next);
  },

  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have been logged out!");
      res.locals.redirect = "/";
      next();
    });
  },

  // validate: async (req, res, next) => {
  //   // Validate and sanitize fields
  //   req.sanitizeBody("email").normalizeEmail({ all_lowercase: true }).trim();
  //   req.check("email", "Email is invalid").isEmail();
  //   req
  //     .check("zipCode", "Zip code is invalid")
  //     .notEmpty()
  //     .isInt()
  //     .isLength({ min: 5, max: 5 })
  //   req.check("password", "Password cannot be empty").notEmpty();

  //   try {
  //     // Collect the results of previous validations
  //     const error = await req.getValidationResult();

  //     if (!error.isEmpty()) {
  //       let messages = error.array().map((e) => e.msg);
  //       req.skip = true; // Set skip property to true
  //       req.flash("error", messages.join(" and "));
  //       res.locals.redirect = "/users/new";
  //       next();
  //     } else {
  //       next();
  //     }
  //   } catch (err) {
  //     console.log(`Error in validation: ${err.message}`);
  //     next(err);
  //   }
  // },

  validate: [
    // Validation and sanitization chains
    body("email")
      .trim()
      .normalizeEmail({ all_lowercase: true })
      .isEmail()
      .withMessage("Email is invalid"),

    body("zipCode")
      .notEmpty()
      .withMessage("Zip code is invalid")
      .isInt()
      .withMessage("Zip code is invalid")
      .isLength({ min: 5, max: 5 })
      .withMessage("Zip code is invalid"),

    body("password").notEmpty().withMessage("Password cannot be empty"),

    // Validation result handler
    (req, res, next) => {
      try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          let messages = errors.array().map((e) => e.msg);
          req.skip = true;
          req.flash("error", messages.join(" and "));

          res.locals.user = {
            name: {
              first: req.body.first || "",
              last: req.body.last || "",
            },
            email: req.body.email || "",
            zipCode: req.body.zipCode || "",
            // Don't send password back for security
          };

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
  ],

  // apiAuthenticate: (req, res, next) => {
  //   // the reason we add this extra layer of security is because the api can be access from outside the front end so we have to make sure it is safe and the user is actually who they say they are
  //   passport.authenticate("local", (errors, user) => {
  //     //this is going to use passport to make sure the account is who they are by authenticating it using password, email (user name) and info like that. The local means it uses the email and pass strategy that is part of passport
  //     if (user) {
  //       let signedToken = jsonWebToken.sign(
  //         {
  //           data: user._id,
  //           exp: new Date().setDate(new Date().getDate() + 1), //this exp (expiration), means that the token will exprire in one day so when you login it will ask for pass again. Think of a remember me button, when you press that, you dont need to login again because the token remembers, but because we make the token expire, a hacker cannot access your account without login info
  //         },
  //         "secret_encoding_passphrase", //this is the second argument, this is the secret key.
  //       );
  //       res.json({
  //         success: true,
  //         token: signedToken,
  //       });
  //     } else
  //       res.json({
  //         success: false,
  //         message: "Could not authenticate user.",
  //       });
  //   })(req, res, next);
  // },

  // generateTooken: (req, res, next) => {
  //   if (req.user.apiToken == null) {
  //     user.apiToken = randToken.generate(16);
  // },

  // We are bring this one back instead of the verifyJWT so that we can access the Modal info 
  verifyToken: (req, res, next) => { //Create the verifyToken middleware function with the next parameter.
    if (req.query.apiToken === token) next(); // if they have a token when they login, and it matches with our token, move to the next function
    else next(new Error("Invalid API token.")); // else give an error
  },

  // verifyToken: async (req, res, next) => {
  //   let token = req.query.apiToken;

  //   if (token) {
  //     try {
  //       const user = await User.findOne({ apiToken: token });

  //       if (user) {
  //         next();
  //       } else {
  //         next(new Error("No user found with such token"));
  //       }
  //     } catch (error) {
  //       next(new Error(error.message));
  //     }
  //   } else {
  //     next(new Error("No token found in URL"));
  //     // user.apiToken = randToken.generate(16);
  //   }
  // },


  // We are commenting this out not because it doesnt work, but you wont be able to see and join courses with the Modal with this functions
//==========================================
  // verifyJWT: async (req, res, next) => {
  //   let token = req.headers.token; // each time you make a token request and save it in the header. It generates a new token each time you login (when the token expires)

  //   if (token) { // if you can find it 
  //     jsonWebToken.verify( //verify that it is the real token 
  //       token, // this is the actual token that we can recieve from the request header 
  //       "secret_encoding_passphrase", //this is the passcode that signed the token 
  //       async (errors, payload) => { //this is the third argument it takes in 
  //         if (payload) { // it checkes the payload we are getting from the JWT
  //           try {
  //             const user = await User.findById(payload.data); //if there is a payload in the token and find a user that has a matching jwt to verify it is the actual user 

  //             if (user) {
  //               next();
  //             } else {
  //               res.status(httpStatus.StatusCodes.FORBIDDEN).json({ // if we cannot find a person with a matching token, it will say naahh, this could run because the token does exist on the database but the user was deleted or something like that 
  //                 error: true,
  //                 message: "No User account found.",
  //               });
  //             }
  //           } catch (error) {
  //             res.status(httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
  //               error: true,
  //               message: "Database error.",
  //             });
  //           }
  //         } else {
  //           res.status(httpStatus.StatusCodes.UNAUTHORIZED).json({ // this will run because it is an expired token and you need to login again
  //             error: true,
  //             message: "Cannot verify API token.",
  //           });
  //         }
  //       },
  //     );
  //   } else { // if you cant find the token, output this error with a message 
  //     res.status(httpStatus.StatusCodes.UNAUTHORIZED).json({
  //       error: true,
  //       message: "Provide Token",
  //     });
  //   }
  // },
};
