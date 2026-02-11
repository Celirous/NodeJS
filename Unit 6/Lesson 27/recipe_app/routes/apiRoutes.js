const router = require("express").Router();
const coursesController = require("../controllers/coursesController"); // Require courses controller.


router.get(
  "/courses",
  coursesController.showCourses,
  coursesController.filterUserCourses,
  coursesController.respondJSON, //Add the API route to the Express.js Router.
  
);
router.get(
    "/courses/:id/join",
     coursesController.join, 
     coursesController.respondJSON
);

router.use(coursesController.errorJSON); //Add API error-handling middleware.

module.exports = router;
