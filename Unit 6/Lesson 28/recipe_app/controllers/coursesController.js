// let courses = [
//   {
//     title: "Event Driven Cakes",
//     cost: 50,
//   },
//   {
//     title: "Asynchronous Artichoke",
//     cost: 25,
//   },
//   {
//     title: "Object Oriented Orange Juice",
//     cost: 10,
//   },
// ];

const Course = require("../models/course");
const httpStatus = require("http-status-codes");
const User = require("../models/user");

module.exports = {
  // showCourses: async (req, res) => {
  //   let courses = await Course.find({});

  //   // res.render("courses/index", {
  //   //   courses: courses,
  //   // });

  //   if (req.query.format === "json") {
  //     // if you add ?format=json to the end of the url, then it will be json.
  //     res.json(courses);
  //   } else {
  //     res.render("courses/index", {
  //       // if you go to the normal /courses url it will show the front end like usual.
  //       courses: courses,
  //     });
  //   }
  // },

  showCourses: async (req, res, next) => {
    let courses = await Course.find({});

    res.locals.courses = courses; // Always store in res.locals, this is tempory

    // If this is an API route, continue to respondJSON
    if (req.originalUrl.startsWith("/api")) {
      // e.g. localhost:300/api/courses
      next();
    } else {
      // Otherwise render the view for regular web route
      res.render("courses/index", {
        courses: courses,
      });
    }
  },

  new: (req, res) => {
    res.render("courses/new");
  },

  create: async (req, res, next) => {
    try {
      let courseParams = {
        title: req.body.title,
        description: req.body.description,
        cost: req.body.cost,
        items: req.body.items,
        zipCode: req.body.zipCode,
      };

      const course = await Course.create(courseParams);
      res.locals.redirect = "/courses";
      res.locals.course = course;
      next();
    } catch (error) {
      console.log(`Error saving course: ${error.message}`);
      next(error);
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: async (req, res, next) => {
    try {
      let courseId = req.params.id;
      const course = await Course.findById(courseId);
      res.locals.course = course;
      next();
    } catch (error) {
      console.log(`Error fetching course by ID: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render("courses/show");
  },

  edit: async (req, res, next) => {
    let courseId = req.params.id;

    try {
      let course = await Course.findById(courseId);
      res.render("courses/edit", { course: course });
    } catch (error) {
      console.log(`Error fetching course by ID: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    let courseId = req.params.id;

    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      cost: req.body.cost,
      items: req.body.items,
      zipCode: req.body.zipCode,
    };

    try {
      let course = await Course.findByIdAndUpdate(courseId, {
        $set: courseParams,
      });
      res.locals.redirect = `/courses/${courseId}`;
      res.locals.course = course;
      next();
    } catch (error) {
      console.log(`Error updating course by ID: ${error.message}`);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    let courseId = req.params.id;

    try {
      await Course.findByIdAndDelete(courseId);
      res.locals.redirect = "/courses";
      next();
    } catch (error) {
      console.log(`Error deleting course by ID: ${error.message}`);
      next(error);
    }
  },

  respondJSON: (req, res) => {
    // Handle the request from previous middleware, and submit response.
    res.json({
      status: httpStatus.StatusCodes.OK,
      data: res.locals,
    }); // Respond with the response’s local data in JSON format. because we say res.json it will save it in a json format
  },

  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR, // "Internal_Server_Error is 500: Respond with a 500 status code and error message in JSON format.
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.StatusCodes.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject); // this is taking the error code we get and it saves it in a json format
  },

  join: async (req, res, next) => {
    let courseId = req.params.id, // we grab the courseId whos join button we clicked and store it in a vat
      currentUser = req.user; // get the current user that is logged in

    if (currentUser) {
      //we check if we have a current user logged in
      try {
        await User.findByIdAndUpdate(currentUser, {
          // find the user using the id
          $addToSet: {
            courses: courseId, // we will now add that courseId to the  data inside of the user on the database. We do this, because you can only add something that is not already linked to the account
          },
        });

        res.locals.success = true; // did it work? yes
        next(); // run the next function within the route which in this case is respondJSON function above
      } catch (error) {
        next(error);
      }
    } else {
      next(new Error("User must log in.")); // this will output if no user is logged in
    }
  },

  filterUserCourses: (req, res, next) => {
    let currentUser = res.locals.currentUser; // this will grab the logged in Id

    if (currentUser) { //if there is a user logged in 
      let mappedCourses = res.locals.courses.map((course) => {  // this checks if the user has courses available 
        let userJoined = currentUser.courses.some((userCourse) => {
          return userCourse.equals(course._id);
        });
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      res.locals.courses = mappedCourses;
      next();
    } else {
      next();
    }
  },
};
