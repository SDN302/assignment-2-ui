import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Container,
  ThemeProvider,
  createTheme,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import IQuestion from "../../models/Question";
import { deleteQuestion, getQuestions } from "../../services/api";

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

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getQuestions()
      .then((response) => {
        setQuestions(response);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (questionID: string) => {
    try {
      await deleteQuestion(questionID);
      setQuestions(questions.filter((question) => question._id !== questionID));
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
          Questions List
        </Typography>
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => navigate("/create-question")}
          >
            Create Question
          </Button>
        </Box>
        {questions.map((question) => (
          <Card
            key={question._id}
            style={{ margin: "20px 0", padding: "10px", cursor: "pointer" }}
            onClick={() => navigate(`/questions/${question._id}`)}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {question.text}
                </Typography>
              </CardContent>
              <Box display="flex" justifyContent="flex-end" ml={2}>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/update-question/${question._id}`);
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Update
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(question._id);
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Card>
        ))}
        <Box display="flex" justifyContent="flex-start" mt={2}>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate("/")}
          >
            Back
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default QuestionList;