const express = require("express");
const mongoose = require("mongoose");
const mongoDBURL = "mongodb://127.0.0.1:27017/controlPanel";
const ControlPanel = require("./db/ControlPanel");
const MenuItem = require("./db/MenuItem");

const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
// app.use(express.static("MainMenu"));
app.use("/MainMenu", express.static("MainMenu"));
app.use("/MenuItems", express.static("MenuItems"));

// app.use(express.static("public"));

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//   })
// );

app.use(cors());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    // parameterLimit: 1000000,
    limit: "500mb",
  })
);

// app.use(express.json());

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));

const menuItemRouter = require("./routes/menuItemRoutes");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "MainMenu");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});


const upload = multer({ storage });



app.post("/getproduct", upload.single("image"), (req, res) => {
  const { title } = req.body;
  const imagePath = `MainMenu/${req.file.filename}`;
  fs.rename(req.file.path, imagePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error saving file to server");
    }
    const newData = new cpModel({ title, image: imagePath });
    newData
      .save()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error saving data to database");
      });
  });
});

app.post("/updateCategory/:id", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  try {
    let controlpanel = await ControlPanel.findById(id);

    if (!controlpanel) {
      return res.status(404).json({ message: "Control panel not found" });
    }
    const prevTitle = controlpanel.title;
    controlpanel.title = title;
    console.log(prevTitle);
    console.log(controlpanel.title);

    if (req.file) {
      controlpanel.image = `MainMenu/${req.file.filename}`;
    }

    const updatedControlpanel = await controlpanel.save();
    res.status(200).json(updatedControlpanel);

    const menuItemUpdateResult = await MenuItem.updateMany(
      { category: prevTitle },
      { $set: { category: controlpanel.title } }
    );
    console.log(menuItemUpdateResult);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// app.get("/getAllproduct", async (req, resp) => {
//   resp.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   const data = await ControlPanel.find();
//   //   console.log(title);

//   resp.send(data);
//   //   resp.json(data);
// });
app.get("/getAllproduct", async (req, resp) => {
  resp.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from all origins
  const data = await ControlPanel.find();
  resp.send(data);
});


app.delete("/deleteCategory/:id", async (req, resp) => {
  const controlPanel = await ControlPanel.findById(req.params.id);
  await MenuItem.deleteMany({ category: controlPanel.title });

  await ControlPanel.deleteOne({ _id: req.params.id });

  resp.json({ message: "Category deleted successfully" });
  // resp.send(result);
});

// app.post("/delitems/:id", (req, res) => {
//   // const id = req.body.id;
//   // const items = req.body.items;
//   const { id, items } = req.body;
//   console.log(id, items);

//   ControlPanel.findByIdAndUpdate(
//     { _id: id },
//     {
//       menu: items,
//     }
//   )
//     .then((result) => {
//       console.log(`Item ${id} deleted`, result);
//       res.json({ message: "Item deleted successfully" });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ message: "Error deleting item" });
//     });
// });

app.get("/search/:key", async (req, resp) => {
  let result = await ControlPanel.find({
    $or: [{ title: { $regex: req.params.key } }],
  });
  resp.send(result);
});

app.get("/", (req, resp) => {
  resp.send("Server is working");
});

app.use(menuItemRouter);

mongoose.connect(mongoDBURL).then((result) => {
  console.log("connected");
  app.listen(4500);
});