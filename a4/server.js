const path = require('path');

const express = require("express");


const DATABASE = 'posts';
const userName = "admin";
const pw = "admin";
const url = "localhost:5984";
const nano = require('nano')(`http://${userName}:${pw}@${url}`);

// nano.db.create(DATABASE, function(err) {  
//     if (err) {
//       console.error(err);
//     }
// });

const posts = nano.db.use(DATABASE);

async function saveNewPost(topic, timestamp, data) {
    const response = await posts.insert({ topic: topic, timestamp: timestamp, data: data });
    return response;
}

async function getAllPosts(order) {
    const params = order === "ASC" ? {ascending: true} : {descending: true};
    const allPosts = await posts.list({...params, include_docs: true});
    return allPosts.rows;
}

const app = express();
app.use(express.json()) // for parsing application/json
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/posting.html'));
})

app.get("/ping", (req, res) => {
    res.send("Pong");
})

app.get("/posts", async (req, res) => {
    try {
        const { orderBy, order } = req.query;
        const allPosts = await getAllPosts(order);
        res.send({data: allPosts});
    } catch (err) {
        console.error(err);
        res.send({error: err});
    }
})

app.post("/postmessage", async (req, res) => {
    const topic = req.body.topic;
    const data = req.body.data;
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const response = await saveNewPost(topic, timestamp, data);
    res.send(response);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})