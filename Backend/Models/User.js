const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = new mongoose.Schema(
  {
    email: String,
    username: String,
    hash_password: String,
  },
  {
    timestamps: true,
  }
);


User.method({
  async authenticate(password) {
    const passmatch = await bcrypt.compare(password, this.hash_password);
    return passmatch;
  },
});

module.exports = mongoose.model("User", User);