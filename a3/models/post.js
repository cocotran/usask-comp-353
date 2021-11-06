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

module.exports = {
    saveNewPost,
    connection
};
// connection.end();
