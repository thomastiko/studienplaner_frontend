import axios from 'axios';

/**
 * API-URLs für Localhost
 */
//const apiUrl = 'http://localhost:5000/api/auth';


/**
 * API-URLs für Stage
 */
const apiUrl = 'https://taigowiz.org/api/auth';


export const register = async (email, password) => {
  return axios.post(`${apiUrl}/register`, { email, password });
};

export const login = async (email, password) => {
  return axios.post(`${apiUrl}/login`, { email, password });
};
