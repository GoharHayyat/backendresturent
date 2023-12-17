const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: String,
  stock: Number,
  price: Number,
  total: Number,
  check: {
    type: Boolean,
    default: false, // Set a default value if not provided
  },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
