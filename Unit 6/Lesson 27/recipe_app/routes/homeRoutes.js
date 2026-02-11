const router = require("express").Router();
const homeController = require("../controllers/homeController");


// ===============================================================================================================
//                    HOME ROUTE
// ===============================================================================================================

router.get("/", homeController.displayHomePage);


module.exports = router;