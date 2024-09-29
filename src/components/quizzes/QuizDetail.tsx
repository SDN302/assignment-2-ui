import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getQuizById, deleteQuiz } from "../../services/api";
import IQuiz from "../../models/Quiz";

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
  }
});

const QuizDetail: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getQuizById(quizID!)
      .then(setQuiz)
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [quizID]);

  const handleDelete = async () => {
    try {
      await deleteQuiz(quizID!);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;
  if (!quiz) return <div>No quiz found</div>;

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
          Quiz Details
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {quiz.title}
            </Typography>
            <Typography variant="h5" gutterBottom>
              {quiz.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Questions:
            </Typography>
            {quiz.questions.length === 0 ? (
              <Typography variant="body1">No questions available</Typography>
            ) : (
              <List>
                {quiz.questions.map((question) => (
                  <Accordion key={question._id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="h6">{question.text}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List>
                        {question.options.map((option, index) => (
                          <ListItem
                            key={index}
                            sx={{
                              pl: 4,
                              backgroundColor:
                                index === question.correctAnswerIndex
                                  ? "lightgreen"
                                  : "inherit",
                            }}
                          >
                            <ListItemText
                              primary={option}
                              primaryTypographyProps={{
                                color:
                                  index === question.correctAnswerIndex
                                    ? "success"
                                    : "textPrimary",
                                fontWeight:
                                  index === question.correctAnswerIndex
                                    ? "bold"
                                    : "normal",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>
            )}
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="info"
                onClick={() => navigate("/quizzes")}
              >
                Back
              </Button>
              <Box>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => navigate(`/update-quiz/${quizID}`)}
                  sx={{ mr: 1 }}
                >
                  Update
                </Button>
                <Button variant="contained" color="error" onClick={handleDelete}>
                  Delete
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default QuizDetail;