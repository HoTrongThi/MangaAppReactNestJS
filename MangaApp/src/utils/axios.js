import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('Request interceptor - User from localStorage:', user);

    if (user.token) {
      // Đảm bảo token được gửi đúng định dạng
      const authHeader = `Bearer ${user.token}`;
      config.headers = {
        ...config.headers,
        'Authorization': authHeader
      };
      console.log('Request config:', {
        url: config.url,
        method: config.method,
        headers: {
          ...config.headers,
          Authorization: authHeader.substring(0, 20) + '...' // Chỉ log một phần của token
        },
        data: config.data
      });
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor để log response
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: {
          ...error.config?.headers,
          Authorization: error.config?.headers?.Authorization?.substring(0, 20) + '...' // Chỉ log một phần của token
        }
      }
    });
    return Promise.reject(error);
  }
);

export default api; 