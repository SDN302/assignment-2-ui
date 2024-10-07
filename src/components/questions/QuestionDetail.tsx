import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuestionById, deleteQuestion } from "../../services/api";
import IQuestion from "../../models/Question";

const QuestionDetail: React.FC = () => {
  const { questionID } = useParams<{ questionID: string }>();
  const [question, setQuestion] = useState<IQuestion | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (questionID) {
      getQuestionById(questionID)
        .then(setQuestion)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setError("Invalid question ID");
      setLoading(false);
    }
  }, [questionID]);

  const handleDelete = async () => {
    try {
      await deleteQuestion(questionID!);
      navigate("/questions");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!question) return <div className="text-center">No question found</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-4">Question Details</h2>
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-2xl font-semibold mb-2">{question.text}</h3>
        <h4 className="text-xl font-semibold mb-2">Options:</h4>
        <ul className="list-disc pl-5">
          {question.options.map((option, index) => (
            <li
              key={index}
              className={`p-2 ${
                index === question.correctAnswerIndex
                  ? "bg-green-200 font-bold"
                  : "bg-white"
              }`}
            >
              <span
                className={`${
                  index === question.correctAnswerIndex ? "text-green-700" : ""
                }`}
              >
                {option}
              </span>
            </li>
          ))}
        </ul>
        <h4 className="text-xl font-semibold mt-4">Keywords:</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {question.keywords.map((keyword, index) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
            >
              {keyword}
            </span>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => navigate("/questions")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back
          </button>
          <div>
            <button
              onClick={() => navigate(`/update-question/${questionID}`)}
              className="mr-2 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Update
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;
