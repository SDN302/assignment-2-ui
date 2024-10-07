import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IQuiz from "../../models/Quiz";
import { getQuizById, putQuiz } from "../../services/api";

const UpdateQuiz: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (quizID) {
        try {
          const fetchedQuiz = await getQuizById(quizID);
          setQuiz(fetchedQuiz);
          setTitle(fetchedQuiz.title);
          setDescription(fetchedQuiz.description);
        } catch {
          setError("Failed to fetch quiz data");
        }
      }
    };
    fetchQuiz();
  }, [quizID]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (quizID && quiz) {
      try {
        const updatedQuiz: IQuiz = { ...quiz, title, description };
        await putQuiz(quizID, updatedQuiz);
        setSuccessMessage("Quiz updated successfully");
        setTimeout(() => {
          navigate(`/quizzes/${quizID}`);
        }, 3000);
      } catch {
        setError("Failed to update quiz");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-2xl font-bold text-center mb-6">Update Quiz</h3>
        {successMessage && (
          <div className="bg-green-200 text-green-800 p-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
          </div>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/quizzes")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Update Quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuiz;
