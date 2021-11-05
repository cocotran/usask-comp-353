const fs = require("fs");
const path = require('path');

const express = require("express");
const app = express();
app.use(express.json()) // for parsing application/json
const port = process.env.PORT || 3000;

async function saveNewPost(topic, data, timestamp) {
    const newPost = `${timestamp}|${topic}|${data} \n`;
    let response;
    let err;
    try {
        fs.appendFile('posts.txt', newPost, (err) => {
            if (err) throw err;
            console.log("The post has been saved!");
        });
        response = "success";  
    } catch (error) {
        err = error;
    }
    return {response: response, error: err}
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/posting.html'));
})

app.get("/ping", (req, res) => {
    res.send("Pong")
})

app.get("/posts", async (req, res) => {
    try {
        const data = fs.readFileSync('posts.txt', 'utf8');
        res.send({data: data})
    } catch (err) {
        console.error(err)
        res.send({error: err})
    }
})

app.post("/postmessage", async (req, res) => {
    const topic = req.body.topic;
    const data = req.body.data;
    const timestamp = new Date();
    const savePostResult = await saveNewPost(topic, data, timestamp.toUTCString())
    res.send(savePostResult)
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})