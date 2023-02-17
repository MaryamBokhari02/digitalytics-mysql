const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");

router.get("/", (req, res) => {
  res.send({ status: true, message: "API WORKING!" });
});

//Connect to DB
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "apis.digitalytics.us",
  port: "3306",
  user: "AhsanAhmad",
  password: "Ahsan123",
  database: "digitalytics",
});

console.log("I am listening on this port");

pool.getConnection((err, connection, res) => {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  connection.query("SELECT * from contacts", (err, rows) => {
    connection.release(); // return the connection to pool

    if (!err) {
      // console.log(rows);
      console.log("Connected to DB!");
    } else {
      console.log(err);
    }

    // console.log("The data from contacts table are: \n", rows);
  });
});

//Mail API KEY - SEND GRID
const SENDGRID_API_KEY =
  "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";
//Mailing function
sgMail.setApiKey(SENDGRID_API_KEY);

const mail = async (
  email,
  subject,
  name = null,
  message = null,
  html = false,
  phone_number = false
) => {
  let emailBody = {
    to: "wali585858@gmail.com",
    from: "waliamedvd@gmail.com",
    subject: subject,
    text:
      name === null
        ? `Email: ${email}`
        : `Name: ${name}, Email: ${email}, Message: ${message}, Phone: ${phone_number}`,
  };
  sgMail
    .send(emailBody)
    .then((response) => console.log(response))
    .catch((e) => {
      console.log(e.message);
    });
};

//Forum
router.post("/contacts", (req, res) => {
  if (
    mail(
      req.body.email,
      "Form Submittion",
      req.body.name,
      req.body.message,
      req.body.phone_number
    )
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
router.post("/send-news-letter-message", (req, res) => {
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

module.exports = router;
