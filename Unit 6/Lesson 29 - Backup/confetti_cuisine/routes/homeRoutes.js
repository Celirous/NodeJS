const router = require("express").Router();
const homeController = require("../controllers/homeController");


// ===============================
// Home Routes
// ===============================

router.get("/", homeController.displayHomePage);
router.get("/courses", homeController.showCourses);


module.exports = router;