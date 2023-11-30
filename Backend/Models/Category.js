var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const category_schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    name: String,
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", category_schema);

module.exports = Category;
