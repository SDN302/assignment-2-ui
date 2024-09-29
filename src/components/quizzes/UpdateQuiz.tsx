import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Alert } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IQuiz from '../../models/Quiz';
import { getQuizById, putQuiz } from '../../services/api';

const theme = createTheme({
  palette: {
    background: {
      default: "#f4f6f8",
    },
  },
  typography: {
    h3: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    h5: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    h6: {
      fontSize: "1.2rem",
      color: "#555",
    },
  },
});

const UpdateQuiz: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (quizID) {
        try {
          const fetchedQuiz = await getQuizById(quizID);
          setQuiz(fetchedQuiz);
          setTitle(fetchedQuiz.title);
          setDescription(fetchedQuiz.description);
        } catch {
          setError('Failed to fetch quiz data');
        }
      }
    };
    fetchQuiz();
  }, [quizID]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (quizID && quiz) {
      try {
        const updatedQuiz: IQuiz = { ...quiz, title, description };
        await putQuiz(quizID, updatedQuiz);
        setSuccessMessage("Quiz updated successfully");
        setTimeout(() => {
          navigate(`/quizzes/${quizID}`);
        }, 3000);
      } catch {
        setError('Failed to update quiz');
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container
        style={{
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          style={{ textAlign: "center", margin: "20px 0" }}
        >
          Update Quiz
        </Typography>
        {successMessage && (
          <Alert severity="success" style={{ marginBottom: "20px", fontSize:"20px" }}>
            {successMessage}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              variant="contained"
              color="info"
              onClick={() => navigate("/quizzes")}
            >
              Back
            </Button>
            <Button type="submit" variant="contained" color="warning">
              Update Quiz
            </Button>
          </Box>
        </form>
      </Container>
    </ThemeProvider>
  );
};

export default UpdateQuiz;