import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Grid,
  Container,
  Button,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import IQuiz from "../../models/Quiz";
import { deleteQuiz, getQuizzes } from "../../services/api";

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
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "transform 0.3s",
          "&:hover": {
            transform: "scale(1.05)",
          },
        },
      },
    },
  },
});

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes()
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (quizID: string) => {
    try {
      await deleteQuiz(quizID);
      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz._id !== quizID));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
          Quizzes List
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/create-quiz")}
          >
            Create Quiz
          </Button>
        </Box>
        <Grid container direction="column" spacing={3}>
          {quizzes.map((quiz) => (
            <Grid item key={quiz._id}>
              <Card style={{ margin: "15px 0", padding: "10px" }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <CardContent
                    onClick={() => navigate(`/quizzes/${quiz._id}`)}
                    style={{ cursor: "pointer", flexGrow: 1 }}
                  >
                    <Typography variant="h5" gutterBottom>
                      {quiz.title}
                    </Typography>
                    <Typography variant="h6">{quiz.description}</Typography>
                  </CardContent>
                  <Box display="flex" justifyContent="flex-end" ml={2}>
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => navigate(`/update-quiz/${quiz._id}`)}
                      style={{ marginRight: "10px" }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(quiz._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="flex-start" mt={2}>
          <Button variant="contained" color="info" onClick={() => navigate("/")}>
            Back
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default QuizList;