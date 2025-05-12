const Menu = require("../models/Menu");
const router = require("../routes/paymentRoutes");

// GET all menu items (filtered to only include items with _id)
const getAllMenuItems = async (req, res) => {
  try {
    const menus = await Menu.find({}).sort({ createdAt: -1 });
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new menu item
const postMenuItem = async (req, res) => {
  const newItem = req.body;
  try {
    const result = await Menu.create(newItem);
    res.status(200).json(result);
  } catch (error) {
    console.error("Menu creation failed:", error);
    res.status(500).json({ message: error.message });
  }
};

// DELETE a menu item by ID
const deleteMenuItem = async (req, res) => {
  const menuId = req.params.id;
  try {
    const deletedItem = await Menu.findByIdAndDelete(menuId);
    if (!deletedItem) {
      return res.status(404).json({ message: "Menu Item not found!" });
    }
    res.status(200).json({ message: "Menu Item deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single menu item by ID
const singleMenuItem = async (req, res) => {
  const menuId = req.params.id;
  try {
    const menu = await Menu.findById(menuId);
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE a single menu item by ID
const updateMenuItem = async (req, res) => {
  const menuId = req.params.id;
  const { name, recipe, image, category, price } = req.body;
  try {
    const updatedMenu = await Menu.findByIdAndUpdate(
      menuId,
      { name, recipe, image, category, price },
      { new: true, runValidators: true }
    );
    if (!updatedMenu) {
      return res.status(404).json({ message: "Menu Item not found!" });
    }
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllMenuItems,
  postMenuItem,
  deleteMenuItem,
  singleMenuItem,
  updateMenuItem,
};
