const router = require("express").Router();
const courseController = require("../controllers/coursesController");


// ===============================
// Course Routes
// ===============================

router.get("/courses", courseController.showCourses);
router.get("/courses/new", courseController.new);
router.post(
  "/courses/create",
  courseController.create,
  courseController.redirectView,
);
router.get("/courses/:id", courseController.show, courseController.showView);
router.get("/courses/:id/edit", courseController.edit);
router.put(
  "/courses/:id/update",
  courseController.update,
  courseController.redirectView,
);
router.delete(
  "/courses/:id/delete",
  courseController.delete,
  courseController.redirectView,
);

module.exports = router;