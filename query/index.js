const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios')

const app = express();
app.use(cors());
app.use(bodyParser.json());
const posts = {};

const handleEvent = (type,data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};
//serve post + comments
app.get('/posts', (req, res) => {
  res.send(posts);
});
//save posts & comments
app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type,data)
  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  //when it come back on ask for all the events it missed
  try {
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
