const mongoose = require("mongoose");

const favSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Favorito", favSchema);
