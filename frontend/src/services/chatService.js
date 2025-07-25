// src/services/chatService.js

import axios from 'axios';

// Replace with your real backend base URL
const API_BASE_URL = 'https://api.example.com/chat';

// Fetch initial messages (for a chat room / user)
export async function fetchMessages() {
  try {
    const response = await axios.get(`${API_BASE_URL}/messages`);
    return response.data; // assuming your backend returns array of messages
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return []; // return empty list on error
  }
}

// Send a new message
export async function sendMessage(newMessage) {
  try {
    const response = await axios.post(`${API_BASE_URL}/messages`, {
      text: newMessage,
    });
    return response.data; // e.g., saved message object
  } catch (error) {
    console.error('Failed to send message:', error);
    return null;
  }
}

// (Optional later) connect to WebSocket for real-time updates
export function connectToChatSocket(onMessageReceived) {
  // Example using native WebSocket (adjust URL to your backend)
  const socket = new WebSocket('wss://api.example.com/chat/socket');

  socket.onopen = () => {
    console.log('Connected to chat socket');
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    onMessageReceived(message);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('WebSocket closed');
  };

  return socket; // so you can close it later
}
