import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import IQuestion from "../../models/Question";
import { deleteQuestion, getQuestions } from "../../services/api";

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getQuestions()
      .then((response) => {
        setQuestions(response);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (questionID: string) => {
    try {
      await deleteQuestion(questionID);
      setQuestions(questions.filter((question) => question._id !== questionID));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold text-center mb-6">Questions List</h3>
      <div className="flex justify-end mb-4">
        <button
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          onClick={() => navigate("/create-question")}
        >
          Create Question
        </button>
      </div>
      {questions.map((question) => (
        <div
          key={question._id}
          className="mx-3 bg-gray-100 p-4 mb-4 rounded-lg cursor-pointer transition transform hover:scale-105"
          onClick={() => navigate(`/questions/${question._id}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-lg font-semibold">{question.text}</h6>
            </div>
            <div className="flex">
              <button
                className="bg-yellow-500 text-white py-1 px-3 rounded mr-2 hover:bg-yellow-600 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/update-question/${question._id}`);
                }}
              >
                Update
              </button>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(question._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-start mt-4">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          onClick={() => navigate("/")}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default QuestionList;
