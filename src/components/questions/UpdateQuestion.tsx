import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionById, putQuestion } from "../../services/api";
import IQuestion from "../../models/Question";

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
        const updatedQuestion: IQuestion = {
          ...question,
          text,
          options,
          keywords,
          correctAnswerIndex,
        };
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
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Update Question</h1>
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Question Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="border rounded p-2 w-full"
          />
          {options.map((option, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionsChange(index, e.target.value)}
              className="border rounded p-2 w-full"
            />
          ))}
          {keywords.map((keyword, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Keyword ${index + 1}`}
              value={keyword}
              onChange={(e) => handleKeywordsChange(index, e.target.value)}
              className="border rounded p-2 w-full"
            />
          ))}
          <button
            type="button"
            onClick={addKeywordField}
            className="text-blue-500"
          >
            Add Keyword
          </button>
          <select
            value={correctAnswerIndex}
            onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
            className="border rounded p-2 w-full"
          >
            {options.map((option, index) => (
              <option key={index} value={index}>
                {`Option ${index + 1}`}
              </option>
            ))}
          </select>
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate("/questions")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Update Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
