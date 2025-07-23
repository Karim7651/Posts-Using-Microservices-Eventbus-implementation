const CommentList = ({ comments }) => {
  
  const renderedComments = comments.map((comments) => {
    let content 
    if(comments.status === 'approved'){
      content = comments.content
    }else if (comments.status === 'pending'){
      content = "this comment is awaiting moderation"
    }else{
      content = "this comment has been rejected"
    }
    return <li key={comments.id}>{content}</li>;
  });
  return <ul>{renderedComments}</ul>;
};
export default CommentList;
