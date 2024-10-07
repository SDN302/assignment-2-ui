import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { postManyQuestionsInQuiz } from "../../services/api";
import IQuestion from "../../models/Question";

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

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
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
    updatedQuestions[qIndex].keywords = updatedQuestions[
      qIndex
    ].keywords.filter((keyword) => keyword !== keywordToDelete);
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
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Add New Questions</h2>
      {successMessage && (
        <div className="mb-4 p-4 text-green-800 bg-green-200 rounded">
          {successMessage}
        </div>
      )}
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="flex flex-col mb-4">
          <input
            type="text"
            placeholder="Question Text"
            className="mb-2 p-2 border rounded"
            value={question.text}
            onChange={(e) => {
              const updatedQuestions = [...questions];
              updatedQuestions[qIndex].text = e.target.value;
              setQuestions(updatedQuestions);
            }}
          />
          {question.options.map((option, oIndex) => (
            <input
              key={oIndex}
              type="text"
              placeholder={`Option ${oIndex + 1}`}
              className="mb-2 p-2 border rounded"
              value={option}
              onChange={(e) =>
                handleOptionChange(qIndex, oIndex, e.target.value)
              }
            />
          ))}
          <select
            className="mb-2 p-2 border rounded"
            value={question.correctAnswerIndex}
            onChange={(e) => {
              const updatedQuestions = [...questions];
              updatedQuestions[qIndex].correctAnswerIndex = +e.target.value;
              setQuestions(updatedQuestions);
            }}
          >
            {question.options.map((_, oIndex) => (
              <option key={oIndex} value={oIndex}>
                {`Option ${oIndex + 1}`}
              </option>
            ))}
          </select>
          <div className="flex items-center mb-2">
            <input
              type="text"
              placeholder="Add Keyword"
              className="mr-2 p-2 border rounded"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={() => handleAddKeyword(qIndex)}
            >
              Add Keyword
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {question.keywords.map((keyword, kIndex) => (
              <span
                key={kIndex}
                className="bg-blue-200 text-blue-800 rounded-full px-2 py-1"
              >
                {keyword}
                <button
                  className="ml-2 text-red-500"
                  onClick={() => handleDeleteKeyword(qIndex, keyword)}
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
          {questions.length > 1 && (
            <button
              className="bg-red-500 text-white p-2 rounded"
              onClick={() => handleDeleteQuestion(qIndex)}
            >
              DELETE QUESTION
            </button>
          )}
        </div>
      ))}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-500 text-white p-2 rounded"
          onClick={() => navigate(`/quizzes/${quizID}`)}
        >
          Back
        </button>
        <div>
          <button
            className="bg-blue-500 text-white p-2 rounded mr-2"
            onClick={handleAddQuestion}
          >
            ADD QUESTION
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={handleSubmit}
          >
            CREATE QUESTIONS
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestions;
