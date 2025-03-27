import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import './../styles/PostList.css'; // Import CSS for styling

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts || []); // Ensure posts is always an array
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setError(`Failed to load posts: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  // Helper function to format date/time
  const formatDateTime = (isoString) => {
    if (!isoString) return 'N/A';
    try {
      return new Date(isoString).toLocaleString(); // Adjust format as needed
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="post-list-container">
      <h3>Scheduled & Recent Posts</h3>
      {posts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.id} className="post-list-item">
              <span className="post-title">{post.title || 'Untitled Post'}</span>
              <span className="post-schedule">
                Scheduled: {formatDateTime(post.scheduledFor)}
              </span>
              {/* Status Indicator */}
              <span className={`post-status status-${post.status?.toLowerCase()}`}>
                {post.status || 'UNKNOWN'}
              </span>
              {/* Optionally add more details or actions here */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PostList;
