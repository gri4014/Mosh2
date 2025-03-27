import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming api service is set up for calls
import '../styles/SubscriptionSelection.css'; // We'll create this next

function SubscriptionSelection() {
  const navigate = useNavigate();

  const handleSubscriptionSelect = async (tier) => {
    console.log(`Selected tier: ${tier}`);
    try {
      // Retrieve token from localStorage (or context/state management)
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, redirecting to login.');
        navigate('/login'); // Or wherever your login page is
        return;
      }

      // Make API call to update subscription
      // Note: api.js needs to be configured to send the token in headers
      const response = await api.put('/users/me/subscribe', { tier }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      console.log('Subscription update response:', response.data);

      // On success, navigate to the dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Failed to update subscription:', error.response ? error.response.data : error.message);
      // Handle error display to the user if needed
      alert(`Failed to update subscription: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="subscription-selection-container">
      <h2>Choose Your Plan</h2>
      <p>Select a subscription to get started with Mosh.</p>
      <div className="subscription-options">
        <div className="subscription-option">
          <h3>Baseline</h3>
          <p>$30 / month</p>
          <ul>
            <li>Automated Post Creation</li>
            <li>Automated Publishing</li>
          </ul>
          <button onClick={() => handleSubscriptionSelect('BASELINE')}>
            Select Baseline
          </button>
        </div>
        <div className="subscription-option">
          <h3>Promotion</h3>
          <p>$49 / month</p>
          <ul>
            <li>Automated Post Creation</li>
            <li>Automated Publishing</li>
            <li>Targeted Instagram Ads Management</li>
          </ul>
          <button onClick={() => handleSubscriptionSelect('PROMOTION')}>
            Select Promotion
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscriptionSelection;
