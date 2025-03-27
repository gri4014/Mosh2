import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient, { updateUserSettings } from '../services/api'; // Import apiClient (default) and specific functions
import '../styles/Settings.css';

function Settings() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewModeEnabled, setReviewModeEnabled] = useState(false); // State for the toggle
  const [isSaving, setIsSaving] = useState(false); // State for save button
  const [saveMessage, setSaveMessage] = useState(''); // Message after saving
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
        // Use apiClient instead of api
        const response = await apiClient.get('/users/me', {
          headers: {
            Authorization: `Bearer ${token}` // Assuming token is stored as 'token'
          }
        });
        setUserData(response.data);
        // Initialize reviewModeEnabled state from fetched data
        // The backend GET /users/me now includes this field thanks to previous updates
        setReviewModeEnabled(response.data?.reviewModeEnabled || false);
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

// Update state when toggle changes
const handleToggleReviewMode = (event) => {
    setReviewModeEnabled(event.target.checked);
    setSaveMessage(''); // Clear previous save message on change
};

// Handle saving settings
const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
        // Call the actual API function
        const response = await updateUserSettings({ reviewModeEnabled });

        setSaveMessage(response.message || 'Settings saved successfully!');
        // Optionally update local userData state if needed, though fetching on mount should handle it
        // setUserData(prev => ({ ...prev, reviewModeEnabled }));
    } catch (err) { // Removed ': any' type annotation
        console.error('Failed to save settings:', err);
        // Use the error message from the API response if available
        const errorMessage = err?.response?.data?.message || err.message || 'Please try again.';
        setSaveMessage(`Error saving settings: ${errorMessage}`);
    } finally {
        setIsSaving(false);
    }
};
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
        <label>
          <input
            type="checkbox"
            checked={reviewModeEnabled} // Bind to state
            onChange={handleToggleReviewMode}
            disabled={isSaving} // Disable while saving
          />
          Enable Post Review Before Publishing
        </label>
      </div>

      {/* Save Button Section */}
      <div className="settings-section save-section">
        <button onClick={handleSaveSettings} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
        {saveMessage && (
          <span className={`save-message ${saveMessage.includes('Error') ? 'error' : 'success'}`}>
            {saveMessage}
          </span>
        )}
      </div>

    </div>
  );
}

export default Settings;
