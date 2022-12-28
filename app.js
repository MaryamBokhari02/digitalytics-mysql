const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
var multer = require("multer");
var upload = multer();

app.use(bodyParser.json());
app.use(cors());

// for parsing multipart/form-data
app.use(upload.array());

//Connect to DB
const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : '132.148.249.140',
    port            : '3306',
    user            : 'AhsanAhmad',
    password        : 'Ahsan123',
    database        : 'digitalytics'
});

console.log('I am listening on this port');

pool.getConnection((err, connection, res) => {
    console.log('I got here 2');
    if(err) throw err
    console.log('connected as id ' + connection.threadId)
    connection.query('SELECT * from contacts', (err, rows) => {
        connection.release() // return the connection to pool

        if (!err) {
            console.log(rows)
            console.log("Connected to DB!");
        } else {
            console.log(err)
        }

        console.log('The data from contacts table are: \n', rows)
    })
});

app.post('/contacts', (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err
        
        const params = req.body
        connection.query('INSERT INTO contacts SET ?', params, (err, rows) => {
        connection.release() // return the connection to pool
        if (!err) {
            res.send(`Beer with the record ID  has been added.`)
        } else {
            console.log(err)
        }
        
        console.log('The data from beer table are:11 \n', rows)

        })
    })
});
 
app.listen(80, function () {
    console.log('Trying to check')
  })