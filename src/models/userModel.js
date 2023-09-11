const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: "First name is required",
      trim: true,
    },
    lname: {
      type: String,
      required: "last name is required",
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: "email address is required",
      unique: true,
      validate: {
        validator: function (email) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
        },
        message: "plese enter a valied email address",
        isAsync: false,
      },
    },

    phone: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
