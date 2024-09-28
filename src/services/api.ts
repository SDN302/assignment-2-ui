import axios from 'axios';

const API_BASE_URL = 'https://sdn302-assignment-1.onrender.com/api';

export const getQuizzes = async () => {
  const response = await axios.get(`${API_BASE_URL}/quizzes`);
  return response.data;
};

export const getQuizById = async (quizID: string) => {
  const response = await axios.get(`${API_BASE_URL}/quizzes/${quizID}`);
  return response.data;
};

// Add other API functions as needed