const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
var multer = require("multer");
var upload = multer();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(bodyParser.json());
app.use(cors());

// for parsing multipart/form-data
app.use(upload.array());

//Routes Import
const api = require("./routes/api");
app.use("/api", api);

app.get("/", (req, res) => {
  res.send(`Digitalytics`);
});

app.listen(80, function () {
  console.log("Trying to check");
});
