const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const ControlPanel = require("../db/ControlPanel");
const MenuItem = require("../db/MenuItem");
const Ingredient = require("../db/IngredientSchema");

const { findOne } = require("../db/MenuItem");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "MenuItems");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/menuitems", upload.single("image"), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const {
    name,
    ctitle,
    menuItemPrice,
    menuItemDescription,
    calories,
    carbohydrates,
    fats,
    protein,
    totalpurchases,
  } = req.body;

  const imagePath = `MenuItems/${req.file.filename}`;

  console.log(
    name,
    ctitle,
    menuItemPrice,
    menuItemDescription,
    calories,
    carbohydrates,
    fats,
    protein,
    totalpurchases
  );
  // console.log(ctitle);

  try {
    const controlPanels = await ControlPanel.find({});
    const titles = controlPanels.map((controlPanel) => controlPanel.title);

    if (!titles.includes(ctitle)) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Update the menu array for the given category
    const controlPanel = await ControlPanel.findOne({ title: ctitle });

    const menuItem = new MenuItem({
      title: name,
      category: ctitle,
      Price: menuItemPrice,
      describtion: menuItemDescription,
      calories: calories,
      carbohydrates: carbohydrates,
      fats: fats,
      protein: protein,
      totalpurchases: totalpurchases,
      image: imagePath,
      check: false,
    });
    console.log(typeof menuItem); //  output 'object'
    console.log(menuItem instanceof MenuItem); //  output true if MEnuITEM is model

    await menuItem.save();

    // Return success response
    res.json({ message: "Menu item added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// router.get("/menuitems/:category", async (req, res) => {
//   try {
//     const { category } = req.params;
//     // console.log(category);
//     const menuItems = await MenuItem.find({ category });
//     res.send(menuItems);
//     // console.log(menuItems);
//   } catch (error) {
//     // console.error(error);
//     res.status(500).send("Server Error");
//   }
// });

router.get("/menuitems/:category", async (req, res) => {
  try {
    const { category } = req.params;

    // Find all menu items in the specified category
    const menuItems = await MenuItem.find({ category });

    // Check ingredient stock for each menu item
    const updatedMenuItems = await Promise.all(
      menuItems.map(async (menuItem) => {
        // Parse the description JSON string to get the ingredient quantities
        const descriptionObject = JSON.parse(menuItem.describtion);

        // Check ingredient stock
        let anyIngredientsLessThanQuantity = false;

        for (const ingredientName in descriptionObject) {
          const quantityNeeded = descriptionObject[ingredientName];

          // Find the ingredient in the Ingredients collection
          const ingredient = await Ingredient.findOne({ name: ingredientName });
          if(ingredient){
            if (!ingredient || ingredient.tempstock < quantityNeeded) {
              anyIngredientsLessThanQuantity = true;
              break;
            }
          }
          else{
            // console.log("no ingrediant found")
          }
          // Check if the ingredient exists and if its stock is less than required quantity
          
        }

        // Update the 'check' field based on ingredient availability
        menuItem.check = anyIngredientsLessThanQuantity;

        // Return the updated menu item
        return menuItem.toObject(); // Convert to plain JavaScript object
      })
    );

    res.json(updatedMenuItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


router.get("/menuitemsinproductcard/:category", async (req, res) => {
  try {
    const { category } = req.params;
    
    // Find the menu item in the specified category
    const menuItem = await MenuItem.findById(category);

    // Check if the menu item exists
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    // Parse the description JSON string to get the ingredient quantities
    const descriptionObject = JSON.parse(menuItem.describtion);

    // Check ingredient stock
    let anyIngredientsLessThanQuantity = false;

    for (const ingredientName in descriptionObject) {
      const quantityNeeded = descriptionObject[ingredientName];

      // Find the ingredient in the Ingredients collection
      const ingredient = await Ingredient.findOne({ name: ingredientName });

      if (ingredient) {
        if (!ingredient || ingredient.tempstock < quantityNeeded) {
          anyIngredientsLessThanQuantity = true;
          break;
        }
      } else {
        // console.log("no ingredient found");
      }
    }

    // Update the 'check' field based on ingredient availability
    menuItem.check = anyIngredientsLessThanQuantity;

    // Return the updated menu item
    res.json(menuItem.toObject()); // Convert to plain JavaScript object
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/menuitemsgetproductdetails/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id)
    // Validate if the provided ID is a valid MongoDB ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   return res.status(400).json({ msg: 'Invalid ID' });
    // }

    const menuItems = await MenuItem.findById(id);

    // Check if the product with the given ID exists
    if (!menuItems) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

router.get("/menuitemsUP/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // console.log(category);
    const menuItems = await MenuItem.findById(id);

    // Check ingredient stock for each menu item
    const updatedMenuItems = await Promise.all(
      menuItems.map(async (menuItem) => {
        // Parse the description JSON string to get the ingredient quantities
        const descriptionObject = JSON.parse(menuItem.describtion);

        // Check ingredient stock
        let anyIngredientsLessThanQuantity = false;

        for (const ingredientName in descriptionObject) {
          const quantityNeeded = descriptionObject[ingredientName];

          // Find the ingredient in the Ingredients collection
          const ingredient = await Ingredient.findOne({ name: ingredientName });

          // Check if the ingredient exists and if its stock is less than required quantity
          if (!ingredient || ingredient.stock < quantityNeeded) {
            anyIngredientsLessThanQuantity = true;
            break;
          }
        }

        // Update the 'check' field based on ingredient availability
        menuItem.check = anyIngredientsLessThanQuantity;

        // Return the updated menu item
        return menuItem.toObject(); // Convert to plain JavaScript object
      })
    );

    res.json(updatedMenuItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
  //   // res.send(menuItems);
  //   res.json(menuItems);
  //   // console.log(menuItems);
  // } catch (error) {
  //   // console.error(error);
  //   res.status(500).send("Server Error");
  // }
});

router.delete("/deleteitem/:id", async (req, resp) => {
  // resp.send(req.params.id);
  let result = await MenuItem.deleteOne({ _id: req.params.id });
  resp.send(result);
});

router.put("/menuitemsupdate/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      calories,
      carbohydrates,
      fats,
      protein,
      totalpurchases,
      Price,
      describtion,
    } = req.body;
    let menuItem = await MenuItem.findById(id);
    if (!menuItem) {
      return res.status(404).json({ msg: "Menu item not found" });
    }
    menuItem.title = title;
    menuItem.calories = calories;
    menuItem.carbohydrates = carbohydrates;
    menuItem.fats = fats;
    menuItem.protein = protein;
    menuItem.totalpurchases = totalpurchases;
    menuItem.Price = Price;
    menuItem.describtion = describtion;
    if (req.file) {
      menuItem.image = req.file.path;
    }
    menuItem = await menuItem.save();
    res.json(menuItem);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//Handling Trending Items

router.get("/menuitemsTrending/", async (req, res) => {
  try {
    // Check if there are items with non-zero totalpurchases
    const nonZeroPurchasesCount = await MenuItem.countDocuments({
      totalpurchases: { $gt: 0 },
    });

    let menuItems;

    if (nonZeroPurchasesCount > 0) {
      // If there are items with non-zero totalpurchases, sort by totalpurchases
      menuItems = await MenuItem.find().sort({ totalpurchases: -1 });
    } else {
      // If all items have zero totalpurchases, fetch random items
      menuItems = await MenuItem.aggregate([{ $sample: { size: 5 } }]);
    }

    res.json(menuItems);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;