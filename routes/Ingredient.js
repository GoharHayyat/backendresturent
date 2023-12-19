const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Ingredient = require("../db/IngredientSchema");

router.use(bodyParser.json());

router.post("/ingredients", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { name, type, stock, price, total, check } = req.body;

    // Validate if 'name' is present in the request body
    if (!name) {
      return res.status(400).json({ error: "Name is required for the ingredient." });
    }

    // Check if the ingredient with the same name already exists
    const existingIngredient = await Ingredient.findOne({ name });

    if (existingIngredient) {
      return res.status(400).json({ error: "Ingredient with this name already exists." });
    }

    // Create a new ingredient
    const newIngredient = new Ingredient({
      name,
      type,
      stock,
      price,
      total,
      check,
    });

    // Save the ingredient to the database
    const savedIngredient = await newIngredient.save();

    res.status(201).json(savedIngredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/ingredients", async (req, res) => {
  try {
    // Fetch all ingredients from the database
    const allIngredients = await Ingredient.find();

    res.status(200).json(allIngredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
