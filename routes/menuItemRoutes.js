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

router.post("/menuitems", upload.single("image"), async(req, res) => {
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

    const imagePath = `MenuItems/${ req.file.filename}`;


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
        // console.log(typeof menuItem); //  output 'object'
        // console.log(menuItem instanceof MenuItem); //  output true if MEnuITEM is model

        await menuItem.save();

        // Return success response
        res.json({ message: "Menu item added successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server Error" });
    }
});

//Menu items for populate in admin
// router.get("popmenuitems/:id", async(req, res) => {
//     try {
//         const menuItem = await MenuItem.findById(req.params.id);
//         if (!menuItem) {
//             return res.status(404).json({ message: "Menu item not found" });
//         }
//         res.json(menuItem);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// });



router.get("/menuitems/:category", async(req, res) => {
    try {
        const { category } = req.params;

        // Find all menu items in the specified category
        const menuItems = await MenuItem.find({ category });

        // Check ingredient stock for each menu item
        const updatedMenuItems = await Promise.all(
            menuItems.map(async(menuItem) => {
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







router.get("/menuitemsinproductcard/:category", async(req, res) => {
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

router.get("/menuitemsgetproductdetails/:id", async(req, res) => {
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
        const descriptionObject = JSON.parse(menuItems.describtion);

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
        menuItems.check = anyIngredientsLessThanQuantity;
        res.json(menuItems.toObject());
        // res.json(menuItems);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});



router.get("/menuitemsUP/:id", async(req, res) => {
    try {
        const { id } = req.params;

        // console.log(category);
        const menuItems = await MenuItem.findById(id);

        // Check ingredient stock for each menu item
        const updatedMenuItems = await Promise.all(
            menuItems.map(async(menuItem) => {
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

router.delete("/deleteitem/:id", async(req, resp) => {
    // resp.send(req.params.id);
    let result = await MenuItem.deleteOne({ _id: req.params.id });
    resp.send(result);
});




//For udpate item
router.put("/menuitemsupdate/:id", upload.single("image"), async(req, res) => {
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

        } = req.body;

        let updateFields = {
            title,
            calories,
            carbohydrates,
            fats,
            protein,
            totalpurchases,
            Price,
        };

        if (req.file) {
            updateFields.image = req.file.path;
        }

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            id,
            updateFields, { new: true }
        );

        if (!updatedMenuItem) {
            return res.status(404).json({ msg: "Menu item not found" });
        }

        res.json(updatedMenuItem);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});
// Handling Trending Items

// router.get("/menuitemsTrending/", async(req, res) => {
//     try {
//         // Check if there are items with non-zero totalpurchases
//         const nonZeroPurchasesCount = await MenuItem.countDocuments({
//             totalpurchases: { $gt: 0 },
//         });

//         let menuItems;

//         if (nonZeroPurchasesCount > 0) {
//             // If there are items with non-zero totalpurchases, sort by totalpurchases
//             menuItems = await MenuItem.find().sort({ totalpurchases: -1 });

//         } else {
//             // If all items have zero totalpurchases, fetch random items
//             menuItems = await MenuItem.aggregate([{ $sample: { size: 5 } }]);
//         }

//         res.json(menuItems);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Server Error");
//     }
// });




router.get("/menuitemsTrending/", async(req, res) => {
    try {
        // Check if there are items with non-zero total purchases
        // const nonZeroPurchasesCount = await MenuItem.countDocuments({
        //     totalpurchases: { $gt: 0 },
        // });

        // let menuItems;
        // if (nonZeroPurchasesCount > 0) {
        //     // If there are items with non-zero total purchases, sort by total purchases
        //     menuItems = await MenuItem.find().sort({ totalpurchases: -1 });
        // } else {
        //     // If all items have zero total purchases, fetch random items
        //     menuItems = await MenuItem.aggregate([{ $sample: { size: 5 } }]);
        // }



        const menuItems = await MenuItem.find().sort({ totalpurchases: -1 });

        // Filter out items with non-zero total purchases
        const trendingItems = menuItems.filter(item => item.totalpurchases > 0);

        let itemsToSend;

        // Check if there are at least 5 trending items
        if (trendingItems.length >= 5) {
            // If there are at least 5 trending items, send the top 5 items
            itemsToSend = trendingItems.slice(0, 5);
        } else {
            // If there are fewer than 5 trending items, send all trending items and fill the rest with random items
            itemsToSend = trendingItems.concat(menuItems.filter(item => item.totalpurchases === 0).slice(0, 5 - trendingItems.length));
        }

        // Check ingredient quantity for each menu item
        await Promise.all(menuItems.map(async(menuItem) => {
            if (menuItem.describtion) { // Check if description field exists
                const descriptionObject = JSON.parse(menuItem.describtion);
                let anyIngredientsLessThanQuantity = false;

                for (const ingredientName in descriptionObject) {
                    const quantityNeeded = descriptionObject[ingredientName];
                    // Find the ingredient in the Ingredients collection
                    const ingredient = await Ingredient.findOne({ name: ingredientName });

                    // Check if the ingredient exists and if its stock is less than required quantity
                    if (!ingredient || ingredient.tempstock < quantityNeeded) {
                        anyIngredientsLessThanQuantity = true;
                        break;
                    }
                }

                // Update the 'check' field based on ingredient availability
                menuItem.check = anyIngredientsLessThanQuantity;
            } else {
                menuItem.check = false; // Set check to false if description is undefined
            }
        }));

        // res.json(menuItems.slice(0, 6));

        res.json(itemsToSend);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});





router.post("/updateTotalPurchases", async(req, res) => {
    try {
        const purchaseData = req.body;

        console.log(purchaseData)
            // Assuming your MenuItem model has a field named 'name'
        for (const purchase of purchaseData) {
            const { name, quantity } = purchase;

            // Find the menu item by name
            let menuItem = await MenuItem.findOne({ title: name });

            if (!menuItem) {
                return res.status(404).json({ msg: `Menu item '${name}' not found` });
            }

            menuItem.totalpurchases += parseInt(quantity, 10);


            // Save the updated menu item
            menuItem = await menuItem.save();
        }

        res.json({ msg: "Total purchases updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});




module.exports = router;