import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IQuiz from "../../models/Quiz";
import { deleteQuiz, getQuizzes } from "../../services/api";

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getQuizzes()
      .then((data) => {
        setQuizzes(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (quizID: string) => {
    try {
      await deleteQuiz(quizID);
      setQuizzes((prevQuizzes) =>
        prevQuizzes.filter((quiz) => quiz._id !== quizID)
      );
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loader"></span>
      </div>
    ); // Placeholder for CircularProgress
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-5">Quizzes List</h3>
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => navigate("/create-quiz")}
        >
          Create Quiz
        </button>
      </div>
      <div className="space-y-3 mx-4">
        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            className="border rounded-lg p-4 transition-transform hover:scale-105"
          >
            <div className="flex justify-between items-center">
              <div
                onClick={() => navigate(`/quizzes/${quiz._id}`)}
                className="cursor-pointer flex-grow"
              >
                <h5 className="text-xl font-bold">{quiz.title}</h5>
                <h6 className="text-gray-600">{quiz.description}</h6>
              </div>
              <div className="flex ml-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                  onClick={() => navigate(`/update-quiz/${quiz._id}`)}
                >
                  Update
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => handleDelete(quiz._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-start mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => navigate("/")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default QuizList;
