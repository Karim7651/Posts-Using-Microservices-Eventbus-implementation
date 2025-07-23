import axios from 'axios';
import { useState } from 'react';
const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');
  async function onSubmit(e) {
    e.preventDefault();
    await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
      content,
    });
    setContent("")
  }
  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <label>new Comment</label>
          <input
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
};
export default CommentCreate;
