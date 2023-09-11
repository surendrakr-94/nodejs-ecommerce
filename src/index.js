const express = require("express");
const route = require("./routes/router.js");
const mongoose = require("mongoose");
const app = express();
const multer = require("multer");
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(multer().any());

mongoose
  .connect("mongodb://127.0.0.1:27017/ecommerce_skdb", {
    useNewUrlParser: true,
  })
  .then(
    () => console.log("MongoDb is connected"),
    (err) => console.log(err)
  );

app.use("/", route);

app.listen(PORT, function () {
  console.log("Express app running on port " + PORT);
});
