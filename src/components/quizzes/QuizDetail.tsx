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
  TextField,
  Chip,
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
  },
});

const QuizDetail: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
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
      navigate("/quizzes");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;
  if (!quiz) return <div>No quiz found</div>;

  const filteredQuestions = quiz.questions.filter((question) =>
    question.text.toLowerCase().includes(searchKeyword.toLowerCase())
  );

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
        <Box display="flex" mb={2}>
          <TextField
            label="Search Questions"
            variant="outlined"
            fullWidth
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Box>
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
            {filteredQuestions.length === 0 ? (
              <Typography variant="body1">No questions available</Typography>
            ) : (
              <List>
                {filteredQuestions.map((question) => (
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
                      <Typography variant="h6" gutterBottom>
                        Keywords:
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={2}>
                        {question.keywords.map((keyword, index) => (
                          <Chip
                            variant="filled"
                            color="secondary"
                            key={index}
                            label={keyword}
                            sx={{ fontSize: "1.2rem" }}
                          />
                        ))}
                      </Box>
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
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => navigate(`/quizzes/${quizID}/add-questions`)}
                  sx={{ ml: 1 }}
                >
                  Add Questions
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
