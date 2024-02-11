const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const Ingredient = require("../db/IngredientSchema");

router.use(bodyParser.json());

router.post("/ingredients", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { name, type, stock, price, total, check, inrestock, tempstock } =
      req.body;

    // Validate if 'name' is present in the request body
    if (!name) {
      return res
        .status(400)
        .json({ error: "Name is required for the ingredient." });
    }

    // Check if the ingredient with the same name already exists
    const existingIngredient = await Ingredient.findOne({ name });

    if (existingIngredient) {
      return res
        .status(400)
        .json({ error: "Ingredient with this name already exists." });
    }

    // Create a new ingredient
    const newIngredient = new Ingredient({
      name,
      type,
      stock,
      tempstock,
      price,
      total,
      check,
      inrestock,
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

// Delete ingredient by ID
router.delete("/ingredients/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { id } = req.params;
    // console.log(id);
    // Check if the ID is valid
    if (!id) {
      return res.status(400).json({ error: "Invalid ID provided." });
    }

    // Find and delete the ingredient by ID
    const deletedIngredient = await Ingredient.findByIdAndDelete(id);

    if (!deletedIngredient) {
      return res.status(404).json({ error: "Ingredient not found." });
    }

    res.status(200).json({ message: "Ingredient deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/ingredients/:id/updateInrestock", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const productId = req.params.id;

    // console.log(productId);
    // Find the ingredient by ID
    const ingredient = await Ingredient.findById(productId);

    // Check if the ingredient with the given ID exists
    if (!ingredient) {
      return res
        .status(404)
        .json({ error: "Ingredient not found with the provided ID." });
    }

    // Update the 'inrestock' field to true
    ingredient.inrestock = true;

    // Save the updated ingredient to the database
    const updatedIngredient = await ingredient.save();

    res.status(200).json(updatedIngredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/ingredients/:id/rejectbutton", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const productId = req.params.id;

    // console.log(productId);
    // Find the ingredient by ID
    const ingredient = await Ingredient.findById(productId);

    // Check if the ingredient with the given ID exists
    if (!ingredient) {
      return res
        .status(404)
        .json({ error: "Ingredient not found with the provided ID." });
    }

    // Update the 'inrestock' field to true
    ingredient.inrestock = false;

    // Save the updated ingredient to the database
    const updatedIngredient = await ingredient.save();

    res.status(200).json(updatedIngredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/ingredients/:id/approvebutton", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const productId = req.params.id;

    // Find the ingredient by ID
    const ingredient = await Ingredient.findById(productId);

    // Check if the ingredient with the given ID exists
    if (!ingredient) {
      return res
        .status(404)
        .json({ error: "Ingredient not found with the provided ID." });
    }

    // Get the values from the request body
    const { quantity } = req.body;
    // console.log(quantity )
    // Update the 'inrestock' field to false
    ingredient.inrestock = false;

    // Update stock and total values
    ingredient.stock = (ingredient.stock || 0) + quantity;
    ingredient.tempstock = (ingredient.tempstock || 0) + quantity;
    ingredient.total = (ingredient.total || 0) + quantity;

    // Save the updated ingredient to the database
    const updatedIngredient = await ingredient.save();

    res.status(200).json(updatedIngredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/ingredients/updatetempstock", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    // Assuming the request body is an array of objects
    const ingredientsToUpdate = req.body;

    // console.log(ingredientsToUpdate);
    // console.log(ingredientsToUpdate);

    let spaceAvailable = true;

    for (const ingredientData of ingredientsToUpdate) {
      const ingredient = await Ingredient.findOne({
        name: ingredientData.name,
      });

      if (ingredient) {
        // Ingredient found, you can perform your logic here
        // console.log(`Ingredient found: ${ingredient.name}`);

        // Compare the quantity with tempstock
        if (ingredientData.quantity > ingredient.tempstock) {
          // con/sole.log(
          //   "ingrediant quantity",
          //   ingredientData.quantity,
          //   "temp stock",
          //   ingredient.tempstock
          // );
          spaceAvailable = false;
          // console.log(`Not enough space for ${ingredient.name}`);
          return res.status(400).json({ error: "Not enough space." });
          // Your logic when space is not available for the ingredient
        } else {
          // console.log(
          //   "ingrediant quantity",
          //   ingredientData.quantity,
          //   "temp stock",
          //   ingredient.tempstock
          // );
        }
      } else {
        // Ingredient not found, you can skip or handle it accordingly
        // console.log(`Ingredient not found: ${ingredientData.name}`);
      }
    }

    if (spaceAvailable) {
      `Space available for all ingredients`;
      // Your logic when space is available for all ingredients.

      for (const ingredientData of ingredientsToUpdate) {
        const ingredient = await Ingredient.findOne({
          name: ingredientData.name,
        });

        if (ingredient) {
          ingredient.tempstock = Math.max(
            (ingredient.tempstock || 0) - ingredientData.quantity,
            0
          );
          // Save the updated ingredient to the database
          const updatedIngredient = await ingredient.save();
          // console.log(updatedIngredient)
        } else {
          // Ingredient not found, you can skip or handle it accordingly
          // console.log(`Ingredient not found: ${ingredientData.name}`);
        }
      }
    } else {
      // console.log(`Not enough space for all ingredients`);
      return res
        .status(400)
        .json({ error: "Not enough space for all ingredients" });
      // Your logic when space is not available for all ingredients
    }
    // Send a response
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/ingredients/cartincreasebutton", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    // Assuming the request body is an array of objects
    const ingredientsToUpdate = req.body;

    // console.log(ingredientsToUpdate);

    // let spaceAvailable = true;

    for (const ingredientData of ingredientsToUpdate) {
      const ingredient = await Ingredient.findOne({
        name: ingredientData.name,
      });

      if (ingredient) {
        ingredient.tempstock = Math.max(
          (ingredient.tempstock || 0) + ingredientData.quantity,
          0
        );
        // Save the updated ingredient to the database
        const updatedIngredient = await ingredient.save();
      } else {
        // Ingredient not found, you can skip or handle it accordingly
        // console.log(`Ingredient not found: ${ingredientData.name}`);
      }
    }

    // Send a response
    res.status(200).json({ message: "Update successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

router.get("/ingredientsdetails/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID provided." });
    }

    // Find the ingredient by ID
    const ingredient = await Ingredient.findById(id);

    if (!ingredient) {
      return res.status(404).json({ error: "Ingredient not found." });
    }

    res.status(200).json({ data: ingredient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// router.put("/ingredients/updateorignalstock", async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");

//   try {
//     // Assuming the request body is an array of objects
//     const ingredientsToUpdate = req.body;

//     console.log(ingredientsToUpdate);

//     for (const ingredientData of ingredientsToUpdate) {
//       const ingredient = await Ingredient.findOne({
//         name: ingredientData.name,
//       });

//       if (ingredient) {
//         // Ensure ingredientData.quantityy is a valid number
//         const quantity = parseInt(ingredientData.quantityy);
        
//         // Check if quantity is a valid number
//         if (!isNaN(quantity)) {
//           ingredient.stock = Math.max((ingredient.stock || 0) - quantity, 0);
//           // Save the updated ingredient to the database
          
//           await ingredient.save();
//           res.status(200).json({ message: "Update successful" });
//           // res.status(200).json({ message: "Ingredient stock updated successfully" });

//         } else {
//           // Handle the case where quantity is not a valid number
//           console.log(`Invalid quantity for ingredient: ${ingredientData.name}`);
//         }
//       } else {
//         // Ingredient not found, you can skip or handle it accordingly
//         console.log(`Ingredient not found: ${ingredientData.name}`);
//       }

//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

router.put("/ingredients/updateorignalstock", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    // Assuming the request body is an array of objects
    const ingredientsToUpdate = req.body;

    console.log(ingredientsToUpdate);

    for (const ingredientData of ingredientsToUpdate) {
      const ingredient = await Ingredient.findOne({
        name: ingredientData.name,
      });

      if (ingredient) {
        const quantity = parseInt(ingredientData.quantityy);

        if (!isNaN(quantity)) {
          ingredient.stock = Math.max((ingredient.stock || 0) - quantity, 0);
          await ingredient.save();
        } else {
          console.log(`Invalid quantity for ingredient: ${ingredientData.name}`);
        }
      } else {
        console.log(`Ingredient not found: ${ingredientData.name}`);
      }
    }

    // After the loop is complete, send a response to the client
    res.status(200).json({ message: "Ingredient stock updated successfully" });
  } catch (error) {
    console.error(error);

    // Ensure that only one response is sent, handle the error appropriately
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
