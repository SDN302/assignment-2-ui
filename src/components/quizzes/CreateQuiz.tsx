import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

const CreateQuiz: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    axios.post('https://sdn302-assignment-1.onrender.com/api/quizzes', { title, description })
      .then(() => {
        setTitle('');
        setDescription('');
        setError(null);
        alert('Quiz created successfully');
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <Container>
      <Typography variant="h1">Create Quiz</Typography>
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
        <Button type="submit" variant="contained" color="primary">Create</Button>
      </form>
    </Container>
  );
};

export default CreateQuiz;