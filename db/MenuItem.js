const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menuitemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  describtion: {
    type: String,
    required: true,
  },
  Price: {
    type: Number,
    required: true,
  },
  calories: {
    type: String,
  },
  Mnutrients: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    // type: Schema.Types.ObjectId,
    // ref: "cpModel",
    type: String,
    // required: true,
  },
});

const MenuItem = mongoose.model("MenuItem", menuitemSchema);

module.exports = MenuItem;