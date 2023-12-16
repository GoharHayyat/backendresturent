const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Ingredient = require("./Ingredient"); // Assuming you have a model for Ingredient

router.use(bodyParser.json());

router.post("/ingredients", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { name } = req.body;

    console.log("hi")

    // Validate if 'name' is present in the request body
    if (!name) {
      return res.status(400).json({ error: "Name is required for the ingredient." });
    }

    // Create a new ingredient
    const newIngredient = new Ingredient({ name });

    // Save the ingredient to the database
    const savedIngredient = await newIngredient.save();

    res.status(201).json(savedIngredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
