import axios from 'axios'
import { useState,useEffect } from 'react';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';
const PostList = () => {
    const [posts,setPosts] = useState({})
    useEffect(()=>{
        async function getPosts(){
            const res = await axios.get('http://localhost:4002/posts')
            console.log(res.data)
            setPosts(res.data)
        }
        getPosts()
    },[])
    const renderedPosts = Object.values(posts).map((post)=>{
        return <div key={post.id}>
            <div>
                <h3>{post.title}</h3>
                <CommentList comments ={post.comments}/>
                <CommentCreate postId={post.id}/>
            </div>
        </div>
    })
    return(
        <div>
            {renderedPosts}
        </div>
    )
};
export default PostList;
