import React, { useState, useEffect } from 'react';
import apiClient from '../services/api'; // Import apiClient (default)
import { useNavigate, Link } from 'react-router-dom'; // Import Link, For potential redirects on error
import ReviewInterface from './ReviewInterface'; // Import the review component
import PostList from './PostList'; // Import the new PostList component
// Optional: import './../styles/Dashboard.css'; // If we add styles

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found, redirecting to login.');
          navigate('/'); // Redirect to landing/login
          return;
        }

        // Use apiClient instead of api
        const response = await apiClient.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}` // Assuming token is stored as 'token', not 'userToken' based on previous code
          }
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Failed to fetch user data:', err.response ? err.response.data : err.message);
        setError(`Failed to load dashboard data: ${err.response?.data?.message || err.message}`);
        // Optional: Redirect on specific errors like 401
        if (err.response?.status === 401) {
            localStorage.removeItem('token'); // Clear invalid token
            navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]); // Add navigate to dependency array

  const handleConnectInstagram = () => {
    // Placeholder for future Instagram connection logic
    console.log('Connect Instagram button clicked');
    alert('Instagram connection feature coming soon!');
  };

  const handleLogout = () => {
    // Remove token from local storage
    localStorage.removeItem('token');
    // Redirect to landing/login page
    navigate('/');
    console.log('User logged out');
  };


  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to your Mosh dashboard, {userData?.email || 'User'}!</p>

      {/* Display Subscription Tier */}
      {userData?.subscriptionTier ? (
        <p>Your current subscription: <strong>{userData.subscriptionTier}</strong></p>
      ) : (
        <p>You haven't selected a subscription yet.</p> // Should ideally not happen if flow is correct
      )}

      <button onClick={handleConnectInstagram}>
        Connect Instagram
      </button>

      {/* Add Settings Button */}
      <Link to="/settings" style={{ marginLeft: '10px' }}>
        <button>Settings</button>
      </Link>

      {/* Other dashboard elements will go here later */}

      <button onClick={handleLogout} style={{ marginLeft: '10px', backgroundColor: '#dc3545' }}>
        Logout
      </button>

      {/* --- Scheduled Posts Section --- */}
      <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
        <PostList />
      </div>
      {/* --- End Scheduled Posts Section --- */}


      {/* --- Post Review Section --- */}
      {/* Conditionally render based on the user's setting */}
      {userData?.reviewModeEnabled && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
           <ReviewInterface />
        </div>
      )}
      {/* --- End Post Review Section --- */}

    </div>
  );
}

export default Dashboard;
