const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();

const mongoDBURL = process.env.DATABASE_CONNECT;
const ControlPanel = require("./db/ControlPanel");
const MenuItem = require("./db/MenuItem");
const Ingredient = require("./db/IngredientSchema");
const authRouter = require('./routes/auth')
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const router = express.Router();
app.use("/MainMenu", express.static("MainMenu"));
app.use("/MenuItems", express.static("MenuItems"));
app.use("/Ingredient", express.static("Ingredient"));
app.use("/Restock", express.static("Restock"));
app.use("/Orders", express.static("Orders"))
app.use("/Reservation", express.static("Reservation"))
app.use("/Coupon", express.static("Coupon"))
app.use("/admin", express.static("admin"))
app.use("/HR", express.static("HR"));




app.use(cors());

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
        // parameterLimit: 1000000,
        limit: "500mb",
    })
);

//

const menuItemRouter = require("./routes/menuItemRoutes");
const IngredientRouter = require("./routes/Ingredient");
const RestockRouter = require('./routes/Restock')
const OrdersRouter = require('./routes/OrderRoutes')
const qrCodeRouter = require('./routes/qrgenrate');
const ReservationRouter = require('./routes/ReservationRoutes')
const CouponRouter = require('./routes/CouponRoutes')
const adminRouter = require('./routes/adminroutes')
const hrRouter = require('./routes/HRroutes')

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

app.post("/updateCategory/:id", upload.single("image"), async(req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        let controlpanel = await ControlPanel.findById(id);

        if (!controlpanel) {
            return res.status(404).json({ message: "Control panel not found" });
        }
        const prevTitle = controlpanel.title;
        controlpanel.title = title;
        (prevTitle);
        (controlpanel.title);

        // console?
        if (req.file) {
            controlpanel.image = `MainMenu/${req.file.filename}`;
        }

        const updatedControlpanel = await controlpanel.save();
        res.status(200).json(updatedControlpanel);

        const menuItemUpdateResult = await MenuItem.updateMany({ category: prevTitle }, { $set: { category: controlpanel.title } });
        (menuItemUpdateResult);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});


app.get("/getAllproduct", async(req, resp) => {
    resp.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from all origins
    const data = await ControlPanel.find();
    resp.send(data);
});

app.delete("/deleteCategory/:id", async(req, resp) => {
    const controlPanel = await ControlPanel.findById(req.params.id);
    await MenuItem.deleteMany({ category: controlPanel.title });

    await ControlPanel.deleteOne({ _id: req.params.id });

    resp.json({ message: "Category deleted successfully" });
    // resp.send(result);
});



app.get("/search/:key", async(req, resp) => {
    try {
        const regex = new RegExp(req.params.key, 'i');
        const result = await ControlPanel.find({
            $or: [{ title: { $regex: regex } }],
        });
        resp.send(result);
    } catch (error) {
        console.error(error);
        resp.status(500).send("Server Error");
    }
});


app.get("/", (req, resp) => {
    resp.send("Server is working");
});

app.use(menuItemRouter);
app.use(IngredientRouter);
app.use(RestockRouter);
app.use(authRouter)
app.use(OrdersRouter)
app.use(qrCodeRouter)
app.use(ReservationRouter)
app.use(CouponRouter)
app.use(adminRouter)
app.use(hrRouter)

mongoose.connect(mongoDBURL).then((result) => {
    console.log("connected");
    app.listen(4500);
})