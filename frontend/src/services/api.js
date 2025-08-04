import axios from 'axios';

const API = axios.create({
  baseURL: ('https://managenest.onrender.com'),
});

export default API;
