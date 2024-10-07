import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById, deleteQuiz, getQuestionById } from "../../services/api";
import IQuiz from "../../models/Quiz";
import IQuestion from "../../models/Question";

const QuizDetail: React.FC = () => {
  const { quizID } = useParams<{ quizID: string }>();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getQuizById(quizID!)
      .then(setQuiz)
      .catch((err) => setError((err as Error).message))
      .finally(async () => {
        setLoading(false);

        const questionsPromises = quiz!.questions.map(async (question) => {
          const res = await getQuestionById(question);
          return res;
        });

        const questions = await Promise.all(questionsPromises);
        setQuestions(questions);
      });
  }, [quizID]);

  const handleDelete = async () => {
    try {
      await deleteQuiz(quizID!);
      navigate("/quizzes");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleSearch = () => {
    setSearchKeyword(keyword);
  };

  if (loading)
    return (
      <div className="flex justify-center">
        <div className="loader"></div>
      </div>
    ); // You can replace this with a spinner component
  if (error) return <div>{error}</div>;
  if (!quiz) return <div>No quiz found</div>;

  const filteredQuestions = questions.filter((question) =>
    question.text.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Quiz Details</h2>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search Questions"
          className="border border-gray-300 rounded-lg p-2 flex-grow mr-2"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      <div className="mb-4">
        <h3 className="text-2xl font-bold">{quiz.title}</h3>
        <p className="text-lg mb-4">{quiz.description}</p>
        <h4 className="text-lg font-semibold">Questions:</h4>
        {filteredQuestions.length === 0 ? (
          <p>No questions available</p>
        ) : (
          <div>
            {filteredQuestions.map((question) => (
              <details
                key={question._id}
                className="mb-4 border border-gray-300 rounded-lg p-4"
              >
                <summary className="font-semibold cursor-pointer">
                  {question.text}
                </summary>
                <div className="mt-2">
                  <ul>
                    {question.options.map((option, index) => (
                      <li
                        key={index}
                        className={`p-2 ${
                          index === question.correctAnswerIndex
                            ? "bg-green-200"
                            : ""
                        }`}
                      >
                        {option}
                      </li>
                    ))}
                  </ul>
                  <h5 className="font-semibold mt-2">Keywords:</h5>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {question.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-200 text-blue-800 py-1 px-3 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 p-2 rounded-lg"
          onClick={() => navigate("/quizzes")}
        >
          Back
        </button>
        <div>
          <button
            className="bg-yellow-500 text-white p-2 rounded-lg mr-2"
            onClick={() => navigate(`/update-quiz/${quizID}`)}
          >
            Update
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded-lg mr-2"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="bg-green-500 text-white p-2 rounded-lg"
            onClick={() => navigate(`/quizzes/${quizID}/add-questions`)}
          >
            Add Questions
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;
