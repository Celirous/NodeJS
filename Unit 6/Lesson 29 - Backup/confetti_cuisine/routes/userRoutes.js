const router = require("express").Router();
const userController = require("../controllers/userController");


// ===============================
// User Routes
// ===============================

router.get("/users/login", userController.login);
router.post("/users/login", userController.authenticate);

router.get(
  "/users/logout",
  userController.logout,
  userController.redirectView,
);

router.get("/users", userController.index, userController.indexView);
router.get("/users/new", userController.new);

router.post(
  "/users/create",
  userController.validate,
  userController.create,
  userController.redirectView,
);
router.get("/users/:id", userController.show, userController.showView);
router.get("/users/:id/edit", userController.edit);
router.put(
  "/users/:id/update",
  userController.update,
  userController.redirectView,
);
router.delete(
  "/users/:id/delete",
  userController.delete,
  userController.redirectView,
);


module.exports = router;