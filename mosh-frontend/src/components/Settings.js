import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import API service
import '../styles/Settings.css';

function Settings() {
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

        // Assuming /users/me returns { email, subscriptionTier, isInstagramConnected }
        // We might need to adjust the backend if it doesn't return isInstagramConnected
        const response = await api.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (err) {
        console.error('Failed to fetch user data for settings:', err.response ? err.response.data : err.message);
        setError(`Failed to load settings data: ${err.response?.data?.message || err.message}`);
        if (err.response?.status === 401) {
            localStorage.removeItem('token'); // Clear invalid token
            navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Placeholder handlers - implement actual logic later
  const handleChangePassword = () => alert('Password change functionality coming soon!');
  const handleManageSubscription = () => alert('Subscription management functionality coming soon!');
  const handleInstagramConnect = () => alert('Instagram connection functionality coming soon!');
  const handleInstagramDisconnect = () => alert('Instagram disconnection functionality coming soon!');
  const handleToggleReviewMode = (event) => console.log('Review mode toggled:', event.target.checked);


  if (loading) {
    return <div className="settings-container">Loading Settings...</div>;
  }

  if (error) {
    return <div className="settings-container" style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!userData) {
    // Should ideally not happen if loading/error states are handled, but as a fallback
    return <div className="settings-container">Could not load user data.</div>;
  }

  return (
    <div className="settings-container">
      <h2>Account Settings</h2>

      <div className="settings-section">
        <h3>User Information</h3>
        <p>Email: {userData.email || 'N/A'}</p>
      </div>

      <div className="settings-section">
        <h3>Change Password</h3>
        <input type="password" placeholder="Current Password" />
        <input type="password" placeholder="New Password" />
        <input type="password" placeholder="Confirm New Password" />
        <button onClick={handleChangePassword}>Change Password</button>
      </div>

      <div className="settings-section">
        <h3>Subscription</h3>
        <p>Current Tier: {userData.subscriptionTier || 'None'}</p>
        <button onClick={handleManageSubscription}>Manage Subscription</button>
      </div>

      <div className="settings-section">
        <h3>Instagram Connection</h3>
        {/* Check a field like 'isInstagramConnected' or similar from userData */}
        {userData.isInstagramConnected ? (
          <>
            <p>Status: Connected</p>
            <button onClick={handleInstagramDisconnect}>Disconnect Instagram</button>
          </>
        ) : (
          <>
            <p>Status: Not Connected</p>
            <button onClick={handleInstagramConnect}>Connect Instagram</button>
          </>
        )}
      </div>

      <div className="settings-section">
        <h3>Review Mode</h3>
        {/* Placeholder - state for this toggle needs to be managed */}
        <label>
          <input type="checkbox" onChange={handleToggleReviewMode} />
          Enable Post Review Before Publishing
        </label>
      </div>
    </div>
  );
}

export default Settings;
