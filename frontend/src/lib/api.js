const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  constructor() {
    this.baseURL = BASE_URL;
  }

  async request(endpoint, options = {}) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const headers = {
      'Content-Type': 'application/json',
      ...(userInfo?.token && { 'Authorization': `Bearer ${userInfo.token}` }),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    try {
      console.log('Making request to:', `${this.baseURL}${endpoint}`, config);
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response. Please try again later.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    localStorage.removeItem('userInfo');
    return { success: true };
  }

  // Profile endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Astrology endpoints
  async getAstroData(astroData) {
    return this.request('/astro/data', {
      method: 'POST',
      body: JSON.stringify(astroData),
    });
  }

  async getAstroProfile() {
    return this.request('/astro/profile');
  }

  async updateAstroProfile(astroProfileData) {
    return this.request('/astro/profile', {
      method: 'PUT',
      body: JSON.stringify(astroProfileData),
    });
  }

  async calculateBirthChart(birthData) {
    return this.request('/astro/birth-chart', {
      method: 'POST',
      body: JSON.stringify(birthData),
    });
  }

  async getDailyHoroscope(zodiacSign) {
    return this.request(`/astro/horoscope/${zodiacSign}`);
  }

  // Test endpoint
  async test() {
    return this.request('/test');
  }
}

// Create and export a single instance
export const apiClient = new ApiClient();