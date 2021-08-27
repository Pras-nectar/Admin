const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    require: true,
  },
  children: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "Categtree",
      },
    },
  ],
  order: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
});

const Categtree = mongoose.model("Categtree", categorySchema);

module.exports = Categtree;
