const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const routes = require("./Callbacks/index");
require("dotenv").config();

//Database connection
(async () => {
  console.log("🟠 connecting to the database...");
  await mongoose.connect(
    "mongodb+srv://alikhantareen:Pakistan786@cluster0.po7h8av.mongodb.net/vehicle_system"
  );
  console.log("🟢 MongoDB successfully connected.");
})();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/:id", routes.dashboard);
app.get("/categories/:id", routes.getCategories);
app.get("/editvehicle/:id", routes.getSingleVehicle);
app.get("/getsinglecategory/:id", routes.getSingleCat);
app.put("/editvehicle/:id", routes.updateVehicle);
app.put("/editcategory/:id", routes.updateCategory);
app.post("/login", routes.login);
app.post("/signup", routes.signup);
app.post("/addcategory", routes.addCategory);
app.post("/addvehicle", routes.addVehicle);
app.delete("/categories/:id", routes.deleteCategory);
app.delete("/dashboard/:id", routes.deleteVehicle);

// Server
app.listen(process.env.PORT, () => {
  console.log(`🟢 Server is running...`);
});
