import { useState, useEffect } from 'react';
import './App.css';

const DATABASE_URL = "http://localhost:3000"

function App() {
  const [posts, setPosts] = useState([]);
  const [sortby, setSortby] = useState("topic");
  const [order, setOrder] = useState("ASC");
  const [toggle, setToggle] = useState(false);
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    function polling() {
      fetchNewPosts();
      setTimeout(polling, 10000) // Fetch every 10s
    }
    polling()
  }, [])

  async function fetchNewPosts() {
    console.log("Fetching");
    const query = `${DATABASE_URL}/posts?orderBy=${sortby}&order=${order}`
    try {
      const allPosts = await fetch(query).then(data => data.json());
    console.log(allPosts)
    if (allPosts)
      setPosts(allPosts);
    } catch (error) {
      console.log(error);
    }
    
  }

  async function createPost() {
    if (!topic)
        alert("Please enter a topic.");
    if (!content)
        alert("No one wants to read an empty post.")
    if (topic && content) {
        const res = await fetch(`${DATABASE_URL}/postmessage`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({topic: topic, data: content})
        });
        alert(res);
    }
}

  return (
    <div className="App">
      <button type="button" onClick={fetchNewPosts}>Refresh</button>
      <button onClick={() => setToggle(!toggle)}>{toggle ? "Cancel" : "Create New Post"}</button>

      <div className={"create-post-container " + (toggle ? "" : "hidden")}>
        <label htmlFor="topic">Topic:
          <input type="text" id="topic" className="w-full" value={topic} onChange={(e) => setTopic(e.target.value)} />
        </label>
        <textarea id="content" rows="10" cols="100" placeholder="Something interesting" className="w-full" value={content} onChange={(e) => setContent(e.target.value)}></textarea>
        <button type="button" onClick={createPost}>Post</button>
      </div>

      <p className="text-center">-------------- Posts --------------</p>

      <p>Sort</p>
      <select value={sortby} onChange={(e) => setSortby(e.target.value)}>
          <option value="topic">Topic</option>
          <option value="timestp">Time</option>
      </select>
      <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="ASC">ASC</option>
          <option value="DESC">DESC</option>
      </select>


      <div id="post-container" className="post-container">
        {posts.map(post => (
          <div className="post scroll">
            <p style={{color: "#a0aec0"}}>Time {post.timestamp}</p>
            <p style={{color: "#319795"}}>Topic {post.topic}</p>
            <p className="content">{post.data}</p>
          </div>
        ))}     
      </div>
    </div>
  );
}

export default App;
