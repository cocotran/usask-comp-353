const fs = require("fs");
const path = require('path');

const express = require("express");

let mysql = require('mysql');

const DATABASE = 'e5Re0vo7cA'

let connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'e5Re0vo7cA',
  password : 'CAnZYqbS4P',
  database : 'e5Re0vo7cA'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

const sql = "CREATE TABLE IF NOT EXISTS posts (postID INT PRIMARY KEY AUTO_INCREMENT, topic VARCHAR(255), timestp DATE, content VARCHAR(255));";
connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Table created");
});

async function saveNewPost(topic, timestamp, data) {
    connection.query(`INSERT INTO posts (topic, timestp, content) VALUES ('${topic}', '${timestamp}', '${data}')`, function (error, results, fields) {
        if (error) throw error;
        console.log('Added new post');
    });
}

const app = express();
app.use(express.json()) // for parsing application/json
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/posting.html'));
})

app.get("/ping", (req, res) => {
    res.send("Pong")
})

app.get("/posts", async (req, res) => {
    try {
        const { orderBy, order } = req.query
        const query = `SELECT topic, timestp, content FROM posts ORDER BY ${orderBy} ${order}`
        connection.query(query, function (err, result, fields) {
            if (err) throw err;
            res.send({data: result})
        });
    } catch (err) {
        console.error(err)
        res.send({error: err})
    }
})

app.post("/postmessage", async (req, res) => {
    const topic = req.body.topic;
    const data = req.body.data;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await saveNewPost(topic, timestamp, data)
    res.send("Added post");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})