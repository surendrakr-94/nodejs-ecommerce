const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");
const {
  isValidMail,
  isValid,
  isValidName,
  isValidRequestBody,
  isValidMobile,
  isValidPassword,
} = require("../validator/validation");

const createUser = async function (req, res) {
  try {
    let data = req.body;
    // ------------------ valiadtions start ---------------------------------
    if (!isValidRequestBody(data))
      return res
        .status(400)
        .send({
          status: false,
          msg: " body cant't be empty Please enter some data.",
        });
    let { fname, lname, phone, email, password } = data;

    if (!isValid(fname)) {
      return res
        .status(400)
        .send({ status: false, message: "first name is  required" });
    }
    if (!isValid(lname)) {
      return res
        .status(400)
        .send({ status: false, message: "last name is  required" });
    }
    if (!isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "mail id is required" });
    }
    if (!isValid(phone)) {
      return res
        .status(400)
        .send({ status: false, message: "phone no. is required" });
    }
    if (!isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    }

    if (!isValidName.test(fname))
      return res.status(400).send({
        status: false,
        msg: "Enter a valid fname",
        validname:
          "length of fname has to be in between (3-20)  , use only String ",
      });
    if (!isValidName.test(lname))
      return res.status(400).send({
        status: false,
        msg: "Enter a valid lname",
        validname:
          "length of lname has to be in between (3-20)  , use only String ",
      });
    if (!isValidMail.test(email))
      return res.status(400).send({
        status: false,
        msg: "email id is not valid",
        ValidMail: "email must be in for e.g. xyz@abc.com format.",
      });
    if (!isValidMobile.test(phone))
      return res.status(400).send({
        status: false,
        message: "mobile no. is not valid",
        ValidMobile:
          "it must be 10 digit Number & it should be a indian mobile no.",
      });
    const unique = await userModel.findOne({
      $or: [{ phone: phone }, { email: email }],
    });
    if (unique) {
      if (unique.phone == phone.trim()) {
        return res
          .status(400)
          .send({ message: `${phone} This phone No. is  already exist` }); //instead of 400 we can also use 409 for conflict
      } else {
        return res
          .status(400)
          .send({ message: `${email}:--This maiId is already exist  ` });
      } //instead of 400 we can also use 409 for conflict
    }
    if (!isValidPassword(password))
      return res.status(400).send({
        status: false,
        message: "enter valid password  ",
        ValidPassWord:
          "passWord in between(8-15)& must be contain ==> upperCase,lowerCase,specialCharecter & Number",
      });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // ------------------------- validations end -----------------------------------

    const userData = {
      fname,
      lname,
      email,
      phone,
      password: hash,
    };
    let savedData = await userModel.create(userData);
    res.status(201).send({ status: true, message: "Success", data: savedData });
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
};

const loginUser = async function (req, res) {
  try {
    // ------------------ valiadtions start ---------------------------------

    if (!isValidRequestBody(req.body))
      return res
        .status(400)
        .send({
          status: false,
          message: "request body can't be empty enter some data.",
        });
    let email = req.body.email;
    if (!isValid(email))
      return res.status(400).send({ status: false, message: "email required" });
    if (!isValidMail.test(email))
      return res
        .status(400)
        .send({ status: false, message: "enter a valid email" });
    let password = req.body.password;
    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "password is required" });
    let verifyUser = await userModel.findOne({ email: email });
    if (verifyUser) {
      const result = await bcrypt.compare(password, verifyUser.password);
      if (!result)
        return res
          .status(400)
          .send({ status: false, message: "password  is incorrect" });
    } else {
      return res
        .status(400)
        .send({ status: false, message: "email  is incorrect" });
    }
    // ------------------------- validations end -----------------------------------
    let token = jwt.sign(
      { userId: verifyUser._id.toString() },
      "#@$SurendraKumar99",
      { expiresIn: "24h" }
    );
    res
      .status(200)
      .send({
        status: true,
        message: "User login successfull",
        data: { userId: verifyUser["_id"], token: token },
      });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getuserById = async function (req, res) {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "please provide a valid userId" });
    //-------------------------------Authorizition-----------------------------//

    if (userId != req.decodedToken)
      return res
        .status(403)
        .send({ status: false, message: "Un-Authorized User" });

    //-------------------------------Authorizition-----------------------------//
    let userDetails = await userModel.findById(userId);
    if (!userDetails)
      return res.status(404).send({ status: "false", msg: "user not exist" });
    res
      .status(200)
      .send({
        status: true,
        message: "User profile details",
        data: userDetails,
      });
  } catch (error) {
    return res.status(500).send({ msg: error.message });
  }
};

const updateUser = async function (req, res) {
  try {
    let data = req.body;
    let userId = req.params.userId;

    if (!mongoose.isValidObjectId(userId))
      return res
        .status(400)
        .send({ status: false, message: "please provide a valid userId" });

    //-------------------------------Authorizition-----------------------------//

    if (userId != req.decodedToken)
      return res
        .status(403)
        .send({ status: false, message: "Un-Authorized User" });

    //-------------------------------Authorizition-----------------------------//

    // ------------------------- validations start -----------------------------------
    if (!isValidRequestBody(data) && !req.files)
      return res
        .status(400)
        .send({ status: false, message: "Please provide something to update" });
    let { fname, lname, email, phone, password, address } = data;
    let update = {};
    if (fname) {
      if (!isValidName.test(fname))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid fname" });
      update.fname = fname;
    }
    if (lname) {
      if (!isValidName.test(lname))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid lname" });
      update.lname = lname;
    }
    if (email) {
      if (!isValidMail.test(email))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid email" });
      let emailExist = await userModel.findOne({ email: email });
      if (emailExist)
        return res
          .status(400)
          .send({ status: false, message: "email is already exist" });
      update.email = email;
    }

    if (phone) {
      if (!isValidMobile.test(phone))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid mobile no." });
      let phoneExist = await userModel.findOne({ phone: phone });
      if (phoneExist)
        return res
          .status(400)
          .send({ status: false, message: "mobile no. is already exist" });
      update.phone = phone;
    }
    if (password) {
      if (!isValidPassword(password))
        return res
          .status(400)
          .send({ status: false, message: "Please provide valid password" });

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      update.password = hash;
    }

    if (Object.keys(update).length == 0)
      return res
        .status(400)
        .send({ status: false, message: "Please provide something to update" });
    // ------------------------- validations end -----------------------------------
    let updatedUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: update },
      { new: true }
    );
    return res
      .status(200)
      .send({
        status: true,
        message: "User profile updated",
        data: updatedUser,
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = { createUser, loginUser, getuserById, updateUser };
