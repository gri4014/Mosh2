import React, { useState, useEffect } from 'react';
import * as api from '../services/api'; // Import all functions from api
import '../styles/ReviewInterface.css';

function ReviewInterface() {
  const [pendingPosts, setPendingPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPostId, setEditingPostId] = useState(null); // Track which post is being edited
  const [currentEditData, setCurrentEditData] = useState({}); // Store temporary edits

  useEffect(() => {
    const fetchPendingPosts = async () => {
      setLoading(true);
      setError('');
      try {
        // Use the imported function
        const fetchedPosts = await api.getUpcomingPosts();
        // Ensure fetchedPosts is an array before setting state
        setPendingPosts(Array.isArray(fetchedPosts) ? fetchedPosts : []);

      } catch (err) {
        // Use err.message for better error display
        console.error('Failed to fetch pending posts:', err.message);
        setError(`Failed to load posts for review: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingPosts();
  }, []);

  const handleApprove = async (postId) => {
    console.log(`Approving post ${postId}...`);
    try {
      await api.approvePost(postId); // Use the imported function
      alert(`Post ${postId} approved.`);
      setPendingPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error(`Failed to approve post ${postId}:`, err.message);
      alert(`Failed to approve post ${postId}: ${err.message}`);
    }
  };

  // Start editing a post
  const handleEdit = (post) => {
    setEditingPostId(post.id);
    // Initialize edit data, handle potential JSON hashtags
    setCurrentEditData({
      title: post.title || '',
      description: post.description || '',
      hashtags: Array.isArray(post.hashtags) ? post.hashtags.join(' ') : (post.hashtags || ''), // Join hashtags array into a string for input
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingPostId(null);
    setCurrentEditData({});
  };

  // Handle changes in edit input fields
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setCurrentEditData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Save the edited post
  const handleSaveEdit = async (postId) => {
    console.log(`Saving post ${postId}...`);
    // Convert hashtags string back to array, filter empty strings
    const hashtagsArray = currentEditData.hashtags.split(' ').filter(tag => tag.trim() !== '');
    const updateData = {
      title: currentEditData.title,
      description: currentEditData.description,
      hashtags: hashtagsArray,
    };

    try {
      const updatedPost = await api.updatePost(postId, updateData);
      // Update the post in the local state
      setPendingPosts(prevPosts =>
        prevPosts.map(p => (p.id === postId ? { ...p, ...updatedPost } : p)) // Merge updated data
      );
      setEditingPostId(null); // Exit edit mode
      setCurrentEditData({});
      alert(`Post ${postId} updated successfully.`);
    } catch (err) {
      console.error(`Failed to save post ${postId}:`, err.message);
      alert(`Failed to save post ${postId}: ${err.message}`);
      // Optionally keep edit mode open on failure
    }
  };


  if (loading) {
    return <div className="review-container">Loading posts for review...</div>;
  }

  if (error) {
    return <div className="review-container error">{error}</div>;
  }

  if (pendingPosts.length === 0) {
    return <div className="review-container">No posts currently pending review.</div>;
  }

  return (
    <div className="review-container">
      <h3>Posts Pending Review</h3>
      {pendingPosts.map(post => (
        <div key={post.id} className="post-review-item">
          {editingPostId === post.id ? (
            // Edit Mode
            <div className="edit-form">
              <input
                type="text"
                name="title"
                value={currentEditData.title}
                onChange={handleEditChange}
                placeholder="Post Title"
                className="edit-input"
              />
              <textarea
                name="description"
                value={currentEditData.description}
                onChange={handleEditChange}
                placeholder="Post Description"
                className="edit-textarea"
              />
              <input
                type="text"
                name="hashtags"
                value={currentEditData.hashtags}
                onChange={handleEditChange}
                placeholder="Hashtags (space-separated)"
                className="edit-input"
              />
              {/* Image editing is complex, skipping for now */}
              <div className="post-actions">
                <button onClick={() => handleSaveEdit(post.id)} className="save-button">Save</button>
                <button onClick={handleCancelEdit} className="cancel-button">Cancel</button>
              </div>
            </div>
          ) : (
            // Display Mode
            <>
              <h4>{post.title}</h4>
              <p>{post.description}</p>
              <div className="post-images">
                {/* Assuming images is an array of URLs or identifiers */}
                {Array.isArray(post.imageUrls) && post.imageUrls.map((img, index) => (
                  // Replace with actual image rendering later if needed
                  <span key={index} className="image-placeholder">{`[Image: ${img}]`}</span>
                ))}
              </div>
              <div className="post-hashtags">
                {/* Display hashtags correctly, assuming they might be JSON array */}
                {Array.isArray(post.hashtags) ? post.hashtags.join(' ') : post.hashtags}
              </div>
              <div className="post-actions">
                <button onClick={() => handleApprove(post.id)} className="approve-button">Approve</button>
                <button onClick={() => handleEdit(post)} className="edit-button">Edit</button> {/* Pass the whole post object */}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ReviewInterface;
