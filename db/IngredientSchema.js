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
    default: false, 
  },
  inrestock: {
    type: Boolean,
    default: false,
  },
});

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;
