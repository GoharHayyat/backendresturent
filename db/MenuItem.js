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
  carbohydrates: {
    type: String,
  },
  fats: {
    type: String,
  },
  protein: {
    type: String,
  },
  totalpurchases: {
    type: Number,
    default: 0,
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
  check: {
    type: Boolean,
    default: false,
  },
});

const MenuItem = mongoose.model("MenuItem", menuitemSchema);

module.exports = MenuItem;