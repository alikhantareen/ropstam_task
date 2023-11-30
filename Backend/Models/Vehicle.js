var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const car_schema = new mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    model: String,
    make: String,
    registration: String,
    color: String,
    category: String,
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model("Vehicle", car_schema);

module.exports = Vehicle;