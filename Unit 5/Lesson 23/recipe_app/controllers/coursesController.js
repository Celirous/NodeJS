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

module.exports = {
  //Export object literal with all controller actions. We are exporting all functions at once because we add them in one module.exports
  showCourses: async (req, res) => {
    let courses = await Course.find({});

    res.render("courses/index", {
      courses: courses,
    });
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
      };

      const course = await Course.create(courseParams);
      res.locals.redirect = "/courses";
      res.locals.course = course;
      next(); // we are adding this next because the route states after this function runs, the redirectView function needs to run
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
      let courseId = req.params.id; // when we click on the name it will save that id to this rn
      const course = await Course.findById(courseId); // it will now look for the course
      res.locals.course = course; // it will store that course in this local thing
      next(); // this will now run the showView below as per the routes we set in main.js
    } catch (error) {
      console.log(`Error fetching course by ID: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render("courses/show"); //this will render the show courses page with all the details on it
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
};
