CREATE DATABASE IF NOT EXISTS assignment;

CREATE TABLE IF NOT EXISTS posts (
	postID INT PRIMARY KEY,
    topic VARCHAR(255),
    timestamp DATE,
    data VARCHAR(255),
);

