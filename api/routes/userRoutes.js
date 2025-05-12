const express = require("express");
const router = express.Router();

const userControler = require("../controllers/userControllers");
const verifyToken = require("../middleware/verifyToken");
const verfiyAdmin = require("../middleware/verifyAdmin");

router.get("/", verifyToken, verfiyAdmin, userControler.getAllUsers);
router.post("/", userControler.createUser);
router.delete("/:id", verifyToken, verfiyAdmin, userControler.deleteUser);
router.patch("/:email", verifyToken, userControler.updateUser);
router.get("/admin/:email", verifyToken, userControler.getAdmin);
router.patch("/admin/:id", verifyToken, verfiyAdmin, userControler.makeAdmin);
router.patch(
  "/remove-admin/:id",
  verifyToken,
  verfiyAdmin,
  userControler.removeAdmin
);

module.exports = router;
