const Contact = require("../models/Contact");
const Menu = require("../models/Menu");
const Payment = require("../models/Payments");
const User = require("../models/User");

// Get all basic stats
const getAllStats = async (req, res) => {
  try {
    const revenueAgg = await Payment.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const usersCount = await User.countDocuments();
    const menuCount = await Menu.countDocuments();
    const requestCount = await Contact.countDocuments();
    const confirmOrders = await Payment.countDocuments({ status: "confirmed" });
    const pendingOrders = await Payment.countDocuments({
      status: { $ne: "confirmed" },
    });

    res.status(200).json({
      revenue: totalRevenue.toFixed(2),
      users: usersCount,
      menuItems: menuCount,
      requests: requestCount,
      confirmOrders: confirmOrders,
      pendingOrders: pendingOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular items stats
const getPopularItemsStats = async (req, res) => {
  try {
    const result = await Payment.aggregate([
      // Uncomment the line below once data is verified
      // { $match: { status: "confirmed" } },
      { $unwind: "$menuItems" },
      {
        $group: {
          _id: "$menuItems.name",
          totalSold: { $sum: "$menuItems.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 6 },
    ]);

    // console.log("Popular Items Raw:", result);
    res.status(200).json(result);
  } catch (err) {
    console.error("Error in getPopularItemsStats:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get sales distribution by menu category
const getMenuCategoryStats = async (req, res) => {
  try {
    const stats = await Menu.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller function
const getRevenueDetails = async (req, res) => {
  try {
    const revenueDetails = await Payment.aggregate([
      { $unwind: "$menuItems" },
      {
        $group: {
          _id: "$menuItems.name",
          quantitySold: { $sum: "$menuItems.quantity" },
          pricePerUnit: { $first: "$menuItems.price" }, // assumes same price for all
          totalRevenue: {
            $sum: {
              $multiply: ["$menuItems.quantity", "$menuItems.price"],
            },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    res.status(200).json(revenueDetails);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllStats,
  getPopularItemsStats,
  getMenuCategoryStats,
  getRevenueDetails,
};
