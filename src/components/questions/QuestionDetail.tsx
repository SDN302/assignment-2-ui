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
  Container,
  Chip,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getQuestionById, deleteQuestion } from "../../services/api";
import IQuestion from "../../models/Question";

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

const QuestionDetail: React.FC = () => {
  const { questionID } = useParams<{ questionID: string }>();
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (questionID) {
      getQuestionById(questionID)
        .then(setQuestion)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setError("Invalid question ID");
      setLoading(false);
    }
  }, [questionID]);

  const handleDelete = async () => {
    try {
      await deleteQuestion(questionID!);
      navigate("/questions");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;
  if (!question) return <div>No question found</div>;

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
          Question Details
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {question.text}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Options:
            </Typography>
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
            <Box display="flex" justifyContent="space-between" mt={2}>
              <Button
                variant="contained"
                color="info"
                onClick={() => navigate("/questions")}
              >
                Back
              </Button>
              <Box>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => navigate(`/update-question/${questionID}`)}
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
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default QuestionDetail;
