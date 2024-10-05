import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { postManyQuestionsInQuiz } from "../../services/api";
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

const AddQuestions: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const [questions, setQuestions] = useState<IQuestion[]>([
    {
      _id: "",
      text: "",
      options: ["", "", "", ""],
      correctAnswerIndex: 0,
      keywords: [],
    },
  ]);
  const [keywordInput, setKeywordInput] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddKeyword = (qIndex: number) => {
    if (keywordInput.trim() !== "") {
      const updatedQuestions = [...questions];
      updatedQuestions[qIndex].keywords.push(keywordInput.trim());
      setQuestions(updatedQuestions);
      setKeywordInput("");
    }
  };

  const handleDeleteKeyword = (qIndex: number, keywordToDelete: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].keywords = updatedQuestions[qIndex].keywords.filter(
      (keyword) => keyword !== keywordToDelete
    );
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        _id: "",
        text: "",
        options: ["", "", "", ""],
        correctAnswerIndex: 0,
        keywords: [],
      },
    ]);
  };

  const handleDeleteQuestion = (qIndex: number) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, index) => index !== qIndex);
      setQuestions(updatedQuestions);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting questions:", questions);
      const response = await postManyQuestionsInQuiz(quizID!, questions);
      if (response.status === 201) {
        setQuestions([
          {
            _id: "",
            text: "",
            options: ["", "", "", ""],
            correctAnswerIndex: 0,
            keywords: [],
          },
        ]);
        setError(null);
        setSuccessMessage("Questions added successfully");
        setTimeout(() => {
          navigate(`/quizzes/${quizID}`);
        }, 3000);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error submitting questions:", err);
      setError((err as Error).message);
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
          variant="h4"
          gutterBottom
          style={{ textAlign: "center", margin: "20px 0", fontWeight: "bold" }}
        >
          Add New Questions
        </Typography>
        {successMessage && (
          <Alert
            severity="success"
            style={{ marginBottom: "20px", fontSize: "20px" }}
          >
            {successMessage}
          </Alert>
        )}
        {questions.map((question, qIndex) => (
          <Box key={qIndex} display="flex" flexDirection="column" gap={2} mb={4}>
            <TextField
              label="Question Text"
              variant="outlined"
              fullWidth
              value={question.text}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[qIndex].text = e.target.value;
                setQuestions(updatedQuestions);
              }}
              style={{ marginBottom: "10px" }}
            />
            {question.options.map((option, oIndex) => (
              <TextField
                key={oIndex}
                label={`Option ${oIndex + 1}`}
                variant="outlined"
                fullWidth
                value={option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                style={{ marginBottom: "10px" }}
              />
            ))}
            <FormControl
              fullWidth
              variant="outlined"
              style={{ marginBottom: "10px" }}
            >
              <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
              <Select
                labelId="correct-answer-label"
                value={question.correctAnswerIndex}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[qIndex].correctAnswerIndex = e.target.value as number;
                  setQuestions(updatedQuestions);
                }}
                label="Correct Answer"
              >
                {question.options.map((option, oIndex) => (
                  <MenuItem key={oIndex} value={oIndex}>
                    {`Option ${oIndex + 1}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box display="flex" alignItems="center" mb={2}>
              <TextField
                label="Add Keyword"
                variant="outlined"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                style={{ marginRight: "10px" }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleAddKeyword(qIndex)}
              >
                Add Keyword
              </Button>
            </Box>
            <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
              {question.keywords.map((keyword, kIndex) => (
                <Chip
                  key={kIndex}
                  label={keyword}
                  variant="filled"
                  color="secondary"
                  onDelete={() => handleDeleteKeyword(qIndex, keyword)}
                />
              ))}
            </Box>
            {questions.length > 1 && (
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDeleteQuestion(qIndex)}
              >
                DELETE QUESTION
              </Button>
            )}
          </Box>
        ))}
        {error && <Typography color="error">{error}</Typography>}
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="contained"
            color="info"
            onClick={() => navigate(`/quizzes/${quizID}`)}
          >
            Back
          </Button>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddQuestion}
              style={{ marginRight: "10px" }}
            >
              ADD QUESTION
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
            >
              CREATE QUESTIONS
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AddQuestions;