const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
var multer = require("multer");
var upload = multer();
const nodemailer = require("nodemailer");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(bodyParser.json());
app.use(cors());

// for parsing multipart/form-data
app.use(upload.array());

//Connect to DB
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "132.148.249.140",
  port: "3306",
  user: "AhsanAhmad",
  password: "Ahsan123",
  database: "digitalytics",
});

console.log("I am listening on this port");

pool.getConnection((err, connection, res) => {
  console.log("I got here 2");
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  connection.query("SELECT * from contacts", (err, rows) => {
    connection.release(); // return the connection to pool

    if (!err) {
      console.log(rows);
      console.log("Connected to DB!");
    } else {
      console.log(err);
    }

    console.log("The data from contacts table are: \n", rows);
  });
});

app.get("/", (req, res) => {
  res.send(`Digitalytics`);
});

//Mailing function
const mail = async (
  email,
  subject,
  name = null,
  message = null,
  html = false
) => {
  try {
    var smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      // secure: true, // use SSL,
      // you can try with TLS, but port is then 587
      auth: {
        user: process.env.MAILING_ACCOUNT,
        pass: process.env.MAILING_PASSWORD,
      },
    };

    var transporter = nodemailer.createTransport(smtpConfig);
    // replace hardcoded options with data passed (somedata)
    var mailOptions = {
      from: process.env.MAILING_ACCOUNT, // sender address
      to: process.env.MAILING_TO_ACCOUNT, // list of receivers
      subject: subject, // Subject line
      text:
        name === null
          ? `Email: ${email}`
          : `Name: ${name}, Email: ${email}, Message: ${message}`, //, // plaintext body
      html: html === false ? null : html, // You can choose to send an HTML body instead
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return false;
      } else {
        console.log("Message sent: " + info.response);
        return true;
      }
    });
  } catch (error) {
    console.error(error);
  }
};

//Forum
app.post("/contacts", (req, res) => {
  if (
    mail(req.body.email, "Form Submittion", req.body.name, req.body.message)
  ) {
    pool.getConnection((err, connection) => {
      if (err) throw err;

      const params = req.body;
      connection.query("INSERT INTO contacts SET ?", params, (err, rows) => {
        connection.release(); // return the connection to pool
        if (!err) {
          res.send({ status: true, message: "Message sent successfully!" });
        } else {
          console.log(err);
        }

        console.log("The data from beer table are:11 \n", rows);
      });
    });
  }
});

//News Letter
app.post("/send-news-letter-message", (req, res) => {
  if (mail(req.body.email, "News Letter")) {
    pool.getConnection((err, connection) => {
      if (err) throw err;

      connection.query(
        `INSERT INTO newsletter (email) values ('${req.body.email}')`,
        (err, rows) => {
          connection.release(); // return the connection to pool
          if (!err) {
            res.send({
              status: true,
              message: "News Letter Sent Successfully!",
            });
          } else {
            console.log(err);
          }

          console.log("The data from beer table are:11 \n", rows);
        }
      );
    });
  }
});

app.listen(80, function () {
  console.log("Trying to check");
});
