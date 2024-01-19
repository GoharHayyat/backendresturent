const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const ControlPanel = require("../db/ControlPanel");
const MenuItem = require("../db/MenuItem");

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
    totalpurchases,
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
      carbohydrates:carbohydrates,
    fats: fats,
    protein:protein,
    totalpurchases:totalpurchases,
      image: imagePath,
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



router.get("/menuitems/:category", async (req, res) => {
  try {
    const { category } = req.params;
    // console.log(category);
    const menuItems = await MenuItem.find({ category });
    res.send(menuItems);
    // console.log(menuItems);
  } catch (error) {
    // console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/menuitemsUP/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // console.log(category);
    const menuItems = await MenuItem.findById(id);
    // res.send(menuItems);
    res.json(menuItems);
    // console.log(menuItems);
  } catch (error) {
    // console.error(error);
    res.status(500).send("Server Error");
  }
});

router.delete("/deleteitem/:id", async (req, resp) => {
  // resp.send(req.params.id);
  let result = await MenuItem.deleteOne({ _id: req.params.id });
  resp.send(result);
});

router.put("/menuitemsupdate/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, calories, carbohydrates,fats,protein,totalpurchases, Price, describtion } = req.body;
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

module.exports = router;
