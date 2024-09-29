import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography, Select, MenuItem, FormControl, InputLabel, Alert } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getQuestionById, putQuestion } from "../../services/api";
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

const UpdateQuestion: React.FC = () => {
  const { questionID } = useParams<{ questionID: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      if (questionID) {
        try {
          const fetchedQuestion = await getQuestionById(questionID);
          setQuestion(fetchedQuestion);
          setText(fetchedQuestion.text);
          setOptions(fetchedQuestion.options);
          setKeywords(fetchedQuestion.keywords);
          setCorrectAnswerIndex(fetchedQuestion.correctAnswerIndex);
        } catch {
          setError("Failed to fetch question data");
        }
      }
    };
    fetchQuestion();
  }, [questionID]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (questionID && question) {
      try {
        const updatedQuestion: IQuestion = { ...question, text, options, keywords, correctAnswerIndex };
        await putQuestion(questionID, updatedQuestion);
        setSuccessMessage("Question updated successfully");
        setTimeout(() => {
          navigate(`/questions/${questionID}`);
        }, 3000);
      } catch {
        setError("Failed to update question");
      }
    }
  };

  const handleOptionsChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleKeywordsChange = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const addKeywordField = () => setKeywords([...keywords, ""]);

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
          Update Question
        </Typography>
        {successMessage && (
          <Alert severity="success" style={{ marginBottom: "20px", fontSize:"20px" }}>
            {successMessage}
          </Alert>
        )}
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Question Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
          />
          {options.map((option, index) => (
            <TextField
              key={index}
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionsChange(index, e.target.value)}
              fullWidth
            />
          ))}
          {keywords.map((keyword, index) => (
            <TextField
              key={index}
              label={`Keyword ${index + 1}`}
              value={keyword}
              onChange={(e) => handleKeywordsChange(index, e.target.value)}
              fullWidth
            />
          ))}
          <Button variant="outlined" onClick={addKeywordField}>
            Add Keyword
          </Button>
          <FormControl fullWidth>
            <InputLabel id="correct-answer-label">Correct Answer</InputLabel>
            <Select
              labelId="correct-answer-label"
              value={correctAnswerIndex}
              onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
              label="Correct Answer"
            >
              {options.map((option, index) => (
                <MenuItem key={index} value={index}>
                  {`Option ${index + 1}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {error && <Typography color="error">{error}</Typography>}

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
                color="success"
                onClick={handleSubmit}
              >
                Update Question
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default UpdateQuestion;