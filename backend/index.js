const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mysql = require("mysql");

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "21022016",
    database: "personajesdb",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json("hello this is the backend");
})

app.get("/personajes", (req,res) => {
    const q = "SELECT * FROM personajes";
    db.query(q, (err, data) => {
        if(err) return res.json(err)
        return res.json(data)
    });
});

app.listen(3001, () =>{
    console.log("running on port 3001");
});