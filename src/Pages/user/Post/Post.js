import React, { useState, useEffect } from 'react';
import './Post.css'; // Import file CSS

const Post = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/allpost')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                if (data.success === 1) {
                    setPosts(data.post); // Đúng là data.post thay vì data.posts
                } else {
                    setError('Lỗi khi lấy bài viết: ' + data.message);
                }
            })
            .catch(error => {
                setError('Lỗi khi gọi API: ' + error.message);
            });
    }, []);

    const formatContent = (content) => {
        return content.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    return (
        <div className="post-container">
            <h1 className="post-title">Bài viết</h1>
            {error ? (
                <p className="error-message">{error}</p>
            ) : posts.length > 0 ? (
                posts.map(post => (
                    <div key={post.post_id} className="post-item">
                        <h2 className="post-item-title">{post.title}</h2>
                        {post.image && (
                            <a href="http://localhost:3000/coffee" target="_blank" rel="noopener noreferrer">
                                <img src={post.image} alt={post.title} className="post-item-image" />
                            </a>
                        )}
                        <p className="post-item-content">
                            {formatContent(post.content)}
                        </p>
                        
                        <p className="post-item-date">{new Date(post.post_date).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p className="no-posts-message">Không có bài viết nào</p>
            )}
        </div>
    );
}

export default Post;
