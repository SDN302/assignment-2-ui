import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postQuestion } from "../../services/api";
import IQuestion from "../../models/Question";

const CreateQuestion: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [keywords, setKeywords] = useState<string[]>([""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const newQuestion = {
      text,
      options,
      correctAnswerIndex,
      keywords,
    };
    try {
      await postQuestion(newQuestion as IQuestion);
      setText("");
      setOptions(["", "", "", ""]);
      setKeywords([""]);
      setCorrectAnswerIndex(0);
      setError(null);
      setSuccessMessage("Question created successfully");
      setTimeout(() => {
        navigate("/questions");
      }, 3000);
    } catch (err) {
      setError((err as Error).message);
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
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Create Question</h2>
      {successMessage && (
        <div className="mb-4 p-2 text-green-700 bg-green-200 rounded">
          {successMessage}
        </div>
      )}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Question Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionsChange(index, e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        ))}
        {keywords.map((keyword, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Keyword ${index + 1}`}
            value={keyword}
            onChange={(e) => handleKeywordsChange(index, e.target.value)}
            className="p-2 border border-gray-300 rounded"
          />
        ))}
        <button
          onClick={addKeywordField}
          className="mt-2 p-2 border border-gray-300 rounded text-blue-600 hover:bg-blue-100"
        >
          Add Keyword
        </button>
        <select
          value={correctAnswerIndex}
          onChange={(e) => setCorrectAnswerIndex(Number(e.target.value))}
          className="p-2 border border-gray-300 rounded"
        >
          {options.map((option, index) => (
            <option key={index} value={index}>
              {`Option ${index + 1}`}
            </option>
          ))}
        </select>
        {error && <p className="text-red-600">{error}</p>}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate("/questions")}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuestion;
