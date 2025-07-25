const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsbyPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsbyPostId[req.params.id] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const comments = commentsbyPostId[req.params.id] || [];
  comments.push({ id: commentId, content, status: 'pending' });
  commentsbyPostId[req.params.id] = comments;
  await axios
    .post('http://event-bus-srv:4005/events', {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: req.params.id,
        status: 'pending',
      },
    })
    .catch((err) => {
      console.log(err.message);
    });

  res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  console.log('Received Event', req.body.type);
  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data;
    const comments = commentsbyPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    await axios
      .post('http://event-bus-srv:4005/events', {
        type: 'CommentUpdated',
        data: {
          id,
          status,
          postId,
          content,
        },
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  res.send({});
});

app.listen(4001, () => {
  console.log('listening on 4001');
});
