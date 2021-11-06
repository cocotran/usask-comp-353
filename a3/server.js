const fs = require("fs");
const path = require('path');

const express = require("express");

const db = require("./models/post.js")

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
        db.connection.query(query, function (err, result, fields) {
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
    await db.saveNewPost(topic, timestamp, data)
    res.send("Added post");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})