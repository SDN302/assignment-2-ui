import axios from "axios";
import IQuiz from "../models/Quiz";
import IQuestion from "../models/Question";

const API_BASE_URL = "https://sdn302-assignment-1.onrender.com/api";

export const getQuizzes = async () => {
  const response = await axios.get(`${API_BASE_URL}/quizzes`);
  return response.data;
};

export const getQuizById = async (quizID: string) => {
  const response = await axios.get(`${API_BASE_URL}/quizzes/${quizID}`);
  return response.data;
};

export const getQuestionsInQuiz = async (quizID: string) => {
  const response = await axios.get(
    `${API_BASE_URL}/quizzes/${quizID}/populate`
  );
  return response.data;
};

export const postQuiz = async (quiz: IQuiz) => {
  const response = await axios.post(`${API_BASE_URL}/quizzes`, quiz);
  return response.data;
};

export const postQuestionInQuiz = async (
  quizID: string,
  question: IQuestion
) => {
  const response = await axios.post(
    `${API_BASE_URL}/quizzes/${quizID}/question`,
    question
  );
  return response.data;
};

export const postManyQuestionsInQuiz = async (
  quizID: string,
  questions: IQuestion[]
) => {
  const response = await axios.post(
    `${API_BASE_URL}/quizzes/${quizID}/questions`,
    questions
  );
  return response.data;
};

export const putQuiz = async (quizID: string, quiz: IQuiz) => {
  const response = await axios.put(`${API_BASE_URL}/quizzes/${quizID}`, quiz);
  return response.data;
};

export const deleteQuiz = async (quizID: string) => {
  const response = await axios.delete(`${API_BASE_URL}/quizzes/${quizID}`);
  return response.data;
};

export const getQuestions = async () => {
  const response = await axios.get(`${API_BASE_URL}/questions`);
  return response.data;
};

export const getQuestionById = async (questionID: string) => {
  const response = await axios.get(`${API_BASE_URL}/questions/${questionID}`);
  return response.data;
};

export const postQuestion = async (question: IQuestion) => {
  const response = await axios.post(`${API_BASE_URL}/questions`, question);
  return response.data;
};

export const putQuestion = async (questionID: string, question: IQuestion) => {
  const response = await axios.put(
    `${API_BASE_URL}/questions/${questionID}`,
    question
  );
  return response.data;
};

export const deleteQuestion = async (questionID: string) => {
  const response = await axios.delete(
    `${API_BASE_URL}/questions/${questionID}`
  );
  return response.data;
};
