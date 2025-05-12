const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const verfiyAdmin = require("../middleware/verifyAdmin");
const statsController = require("../controllers/statsControllers");

router.get("/", verifyToken, verfiyAdmin, statsController.getAllStats);
router.get(
  "/menu-category-stats",
  verifyToken,
  verfiyAdmin,
  statsController.getMenuCategoryStats
);
router.get(
  "/popular-items",
  verifyToken,
  verfiyAdmin,
  statsController.getPopularItemsStats
);
router.get(
  "/revenue-details",
  verifyToken,
  verfiyAdmin,
  statsController.getRevenueDetails
);

module.exports = router;
