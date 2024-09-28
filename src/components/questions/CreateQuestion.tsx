import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { postQuestion } from '../../services/api';
import IQuestion from '../../models/Question';

const CreateQuestion: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const newQuestion: IQuestion = { _id: '', text, options: [], correctAnswerIndex: 0, keywords: [] };
    try {
      await postQuestion(newQuestion);
      navigate("/questions");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Create Question
      </Typography>
      <Box display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Question Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          fullWidth
        />
        {error && <Typography color="error">{error}</Typography>}
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Box>
    </Container>
  );
};

export default CreateQuestion;