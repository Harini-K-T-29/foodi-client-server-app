const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuControllers");

const verifyToken = require("../middleware/verifyToken");
const verfiyAdmin = require("../middleware/verifyAdmin");

// get all menu items

router.get("/", menuController.getAllMenuItems);

// post a new menu item
router.post("/", verifyToken, verfiyAdmin, menuController.postMenuItem);

// delete a menu item
router.delete("/:id", verifyToken, verfiyAdmin, menuController.deleteMenuItem);

// get single menu item
router.get("/:id", menuController.singleMenuItem);

// update single menu item
router.patch("/:id", verifyToken, verfiyAdmin, menuController.updateMenuItem);

module.exports = router;
