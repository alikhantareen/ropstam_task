const User = require("../Models/User");
const Category = require("../Models/Category");
const Vehicle = require("../Models/Vehicle");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");


//function to access rows on the dashboard
async function dashboard(req, res) {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const vehicles = await Vehicle.find({ user: id })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    const count = await Vehicle.countDocuments();
    return res.status(200).json({
      data: vehicles,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.warn(error);
  }
}

//function to get a specific vehicle for editing
async function getSingleVehicle(req, res) {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.findById({ _id: id });
    return res.status(200).json({ response: true, data: vehicle });
  } catch (error) {
    console.warn(error);
  }
}


//function to get a specific category for editing
async function getSingleCat(req, res) {
  const { id } = req.params;
  try {
    const cat = await Category.findById({ _id: id });
    return res.status(200).json({ response: true, data: cat });
  } catch (error) {
    console.warn(error);
  }
}


//function for adding vehicle
async function addVehicle(req, res) {
  const token = req.body.token;
  if (jwt.verify(token, process.env.JWT_SECRET)) {
    try {
      const vehicle = { ...req.body };
      delete vehicle.token;
      const new_car = new Vehicle(vehicle);
      const response = await new_car.save();
      return res.status(200).json({ response: true, data: response });
    } catch (error) {
      console.warn(error);
    }
  }
}


//function to updating vehicle
async function updateVehicle(req, res) {
  const token = req.body.token;
  if (jwt.verify(token, process.env.JWT_SECRET)) {
    try {
      const { id } = req.params;
      const filter = { _id: id };
      const update = req.body;
      await Vehicle.findOneAndUpdate(filter, update);
      const update_vahicle = await Vehicle.findById({ _id: id });
      return res.status(200).json({ response: true, data: update_vahicle });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Vehicle can not be updated at this time." });
    }
  } else {
    return res.status(500).json({ error: "Unauthorized user request" });
  }
}


//funciton for updating category
async function updateCategory(req, res) {
  const token = req.body.token;
  if (jwt.verify(token, process.env.JWT_SECRET)) {
    try {
      const { id } = req.params;
      const filter = { _id: id };
      const update = req.body;
      await Category.findOneAndUpdate(filter, update);
      const update_category = await Category.findById({ _id: id });
      return res.status(200).json({ response: true, data: update_category });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Category can not be updated at this time." });
    }
  } else {
    return res.status(500).json({ error: "Unauthorized user request" });
  }
}

//function for deleting category
async function deleteVehicle(req, res) {
  try {
    const { id } = req.params;
    const cars = await Vehicle.deleteOne({ _id: id });
    return res.status(200).json({ response: true });
  } catch (error) {
    console.warn(error);
  }
}

//function for getting all categories
async function getCategories(req, res) {
  try {
    const { id } = req.params;
    const categories = await Category.find({ user: id });
    return res.status(200).json({ response: true, data: categories });
  } catch (error) {
    console.warn(error);
  }
}

//function for adding category
async function addCategory(req, res) {
  const token = req.body.token;
  if (jwt.verify(token, process.env.JWT_SECRET)) {
    try {
      const new_category = new Category({
        name: req.body.category,
        user: req.body.user,
      });
      const responsse = await new_category.save();
      return res.status(200).json({
        response: true,
        data: responsse,
      });
    } catch (error) {
      return res.status(400).json({
        response: false,
        message: "Category can not be added. Try again.",
      });
    }
  } else {
    return res
      .status(500)
      .json({ response: false, message: "Unauthorized user request" });
  }
}

//function for deleting a category
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const categories = await Category.deleteOne({ _id: id });
    return res.status(200).json({ response: true });
  } catch (error) {
    console.warn(error);
  }
}

//signup function
async function signup(req, res) {
  const { email, username } = req.body;
  if (!email || !username) {
    return res.status(400).json({
      response: false,
      message: "Please provide the required information.",
    });
  }
  const randomPassword = Math.random().toString(36).slice(-8);
  const hash_password = await bcrypt.hash(randomPassword, 10);

  const userData = {
    email,
    username,
    hash_password,
  };

  const user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      response: false,
      message: "User already registered",
    });
  } else {
    const user = await User.create(userData);
    if (user) {
      await sendWelcomeEmail(userData.email, userData.username, randomPassword);
      res.status(200).json({ response: true, message: "Email has been sent." });
    } else {
      res.status(400).json({
        response: false,
        message: "Something went wrong. Try again.",
      });
    }
  }
}


//login function
async function login(req, res) {
  try {
    if (!req.body.email || !req.body.password) {
      res.status(400).json({
        response: false,
        message: "Please enter email and password",
      });
      return;
    }

    const user = await User.findOne({ email: req.body.email });
    const authenticated = await user.authenticate(req.body.password);

    if (user) {
      if (authenticated) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "30d",
        });
        const { _id, email, username } = user;
        res.status(200).json({
          response: true,
          token,
          user: { _id, email, username },
        });
      } else {
        res.status(400).json({
          response: false,
          message: "Invalid username/password.",
        });
      }
    } else {
      res.status(404).json({
        response: false,
        message: "User does not exist..!",
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ response: false, message: "Invalid username or password." });
  }
}

// function to send a welcome email
async function sendWelcomeEmail(email, username, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "creditableboy@gmail.com", // replace with your email
      pass: "uaty jvkx wrjy uhnd", // replace with your email password
    },
  });

  const mailOptions = {
    from: "creditableboy@gmail.com",
    to: email,
    subject: "Welcome to Vehicle Care App",
    text: `Dear ${username},\n\nWelcome to Your App! Your randomly generated password is: ${password}\n\nBest regards,\nYour App Team`,
  };

  await transporter.sendMail(mailOptions);
}


module.exports = {
  signup,
  login,
  dashboard,
  addCategory,
  getCategories,
  deleteCategory,
  addVehicle,
  deleteVehicle,
  getSingleVehicle,
  updateVehicle,
  updateCategory,
  getSingleCat,
};
