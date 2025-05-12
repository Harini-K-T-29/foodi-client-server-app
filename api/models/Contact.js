const mongoose = require("mongoose");
const { Schema } = mongoose;

// create schema object for contact
const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    minLength: 3,
  },
  phone: {
    type: Number,
    required: true,
  },
  subject: String,
  message: {
    type: String,
    required: true,
  },
});

// create a model instance
const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
