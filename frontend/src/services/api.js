import axios from 'axios';

const API = axios.create({
  baseURL: ('https://managenest.onrender.com/api'),
});

export default API;
