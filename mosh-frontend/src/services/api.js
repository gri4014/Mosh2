import axios from 'axios';

// Assuming the backend is running on port 3000
const API_BASE_URL = 'http://localhost:3000/api'; // Adjust if your backend uses a different base path

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to handle user login
export const loginUser = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    // Store token if login is successful (e.g., in localStorage)
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
      // You might want to set the token in axios headers for subsequent requests
      // apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response.data;
  } catch (error) {
    console.error('Login API error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// Function to handle user registration (sign up)
export const registerUser = async (userData) => {
  try {
    // Corrected endpoint to match backend route
    const response = await apiClient.post('/auth/signup', userData);
    // Optionally handle auto-login after registration or prompt user to login
    return response.data;
  } catch (error) {
    console.error('Registration API error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

// Example function for a protected route (you'll need this later)
// export const fetchUserProfile = async () => {
//   try {
//     const token = localStorage.getItem('userToken');
//     if (!token) throw new Error('No token found');
//     const response = await apiClient.get('/users/profile', {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Fetch profile error:', error.response ? error.response.data : error.message);
//     throw error.response ? error.response.data : new Error('Failed to fetch profile');
//   }
// };

export default apiClient; // Export the configured axios instance if needed elsewhere
