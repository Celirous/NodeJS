const router = require("express").Router();
const subscribersController = require("../controllers/subscribersController");


// ===============================
// Subscriber Routes
// ===============================

router.get(
  "/subscribers",
  subscribersController.index,
  subscribersController.indexView,
);
router.get("/subscribers/new", subscribersController.new);
router.post(
  "/subscribers/create",
  subscribersController.create,
  subscribersController.redirectView,
);
router.get(
  "/subscribers/:id",
  subscribersController.show,
  subscribersController.showView,
);
router.get("/subscribers/:id/edit", subscribersController.edit);
router.put(
  "/subscribers/:id/update",
  subscribersController.update,
  subscribersController.redirectView,
);
router.delete(
  "/subscribers/:id/delete",
  subscribersController.delete,
  subscribersController.redirectView,
);

module.exports = router;