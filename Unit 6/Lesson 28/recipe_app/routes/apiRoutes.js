const router = require("express").Router();
const coursesController = require("../controllers/coursesController"); // Require courses controller.
const usersController = require("../controllers/usersController");



router.use(usersController.verifyToken); // we add this at the top because it is the first thing that needs to be checked when someone makes an api request, make sure their token matches


// We are commenting this out to make sure out modal still works 

// router.post("/login", usersController.apiAuthenticate) //this will make sure we check the token before allowing a login
// router.use(usersController.verifyJWT) //this make sure your token is fine, expired, deleted or you need to login again.

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
