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
      localStorage.setItem('token', response.data.token); // Use 'token' consistently
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

// --- Post Functions ---

/**
 * Fetches all posts for the authenticated user.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of post objects.
 */
export const getPosts = async () => {
  try {
    const token = localStorage.getItem('token'); // Use 'token' consistently
    if (!token) throw new Error('No token found');

    const response = await apiClient.get('/posts', { // Calls GET /api/posts
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Returns the array of posts from the backend

  } catch (error) {
    console.error('Get posts API error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch posts');
  }
};


// Function to get posts pending review (Consider removing or adapting if getPosts covers this)
export const getUpcomingPosts = async () => {
  try {
    const token = localStorage.getItem('token'); // Use 'token' consistently
    if (!token) throw new Error('No token found');

    // TODO: Replace placeholder with actual API call when backend is ready
    // const response = await apiClient.get('/posts/upcoming', {
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // return response.data;

    // Simulate returning placeholder data for now
    console.log('API: Fetching upcoming posts (simulation)...');
    return Promise.resolve([
      { id: 'post1', title: 'Amazing Tuesday Offer!', description: 'Get 20% off on all items today.', images: ['img1.jpg'], hashtags: ['#sale', '#tuesdaydeal'] },
      { id: 'post2', title: 'Weekend Vibes', description: 'How are you spending your weekend?', images: ['img2.jpg', 'img3.jpg'], hashtags: ['#weekend', '#relax'] },
    ]);

  } catch (error) {
    console.error('Get upcoming posts API error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to fetch upcoming posts');
  }
};

// Function to approve a post
export const approvePost = async (postId) => {
  try {
    const token = localStorage.getItem('token'); // Use 'token' consistently
    if (!token) throw new Error('No token found');

    // TODO: Replace placeholder with actual API call when backend is ready
    // const response = await apiClient.post(`/posts/${postId}/approve`, {}, { // Empty body for POST
    //   headers: { Authorization: `Bearer ${token}` },
    // });
    // return response.data;

    // Simulate successful approval
    console.log(`API: Approving post ${postId} (simulation)...`);
    return Promise.resolve({ message: `Post ${postId} approved successfully` });

  } catch (error) {
    console.error(`Approve post ${postId} API error:`, error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error(`Failed to approve post ${postId}`);
  }
};

/**
 * Updates a specific post.
 * @param {string} postId - The ID of the post to update.
 * @param {object} postData - The updated post data (e.g., { title, description, hashtags }).
 * @returns {Promise<object>} - The updated post object.
 */
export const updatePost = async (postId, postData) => {
  try {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    if (!token) throw new Error('No token found');

    const response = await apiClient.patch(`/posts/${postId}`, postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to update post');
  }
};
// --- End Post Functions ---

// --- User Settings Functions ---

// Function to update user settings
export const updateUserSettings = async (settingsData) => {
  try {
    const token = localStorage.getItem('token'); // Use 'token' consistently
    if (!token) throw new Error('No token found');

    // Call the actual backend endpoint PUT /users/me
    const response = await apiClient.put('/users/me', settingsData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Return the response from the backend

  } catch (error) {
    console.error('Update user settings API error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to update settings');
  }
};

// --- End User Settings Functions ---


export default apiClient; // Export the configured axios instance if needed elsewhere
