import axios from 'axios';

const apiUrl = 'http://localhost:5000/api/auth';

export const register = async (email, password) => {
  return axios.post(`${apiUrl}/register`, { email, password });
};

export const login = async (email, password) => {
  return axios.post(`${apiUrl}/login`, { email, password });
};
