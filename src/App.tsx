import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from '@mui/material';
import QuizList from './components/quizzes/QuizList';
import QuizDetail from './components/quizzes/QuizDetail';
import QuestionList from './components/questions/QuestionList';
import CreateQuiz from './components/quizzes/CreateQuiz';
import HomePage from './components/HomePage';
import QuestionDetail from './components/questions/QuestionDetail';
import CreateQuestion from './components/questions/CreateQuestion';


const App: React.FC = () => {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:quizID" element={<QuizDetail />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/questions" element={<QuestionList />} />
          <Route path="/questions/:questionID" element={<QuestionDetail />} />
          <Route path="/create-question" element={<CreateQuestion />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;