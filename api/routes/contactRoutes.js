const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// verify token
const verifyToken = require("../middleware/verifyToken");
const Contact = require("../models/Contact");

router.post("/", verifyToken, async (req, res) => {
  const contactInfo = req.body;
  try {
    const result = await Contact.create(contactInfo);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", verifyToken, async (req, res) => {
  try {
    const contactInfos = await Contact.find({});
    res.status(200).json(contactInfos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  const requestId = req.params.id;
  try {
    const deleteRequest = await Contact.findByIdAndDelete(requestId);
    res.status(200).json({ message: "Request Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
