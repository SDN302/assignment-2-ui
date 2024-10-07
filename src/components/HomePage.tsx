import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-8 h-screen">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome to the Quizzes App
      </h1>
      <h2 className="text-2xl text-gray-600 mb-8">
        Test your knowledge with our quizzes!
      </h2>
      <div className="mt-4 flex gap-4">
        <button
          className="bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/quizzes")}
        >
          View Quizzes List
        </button>
        <button
          className="bg-blue-600 text-white text-lg font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
          onClick={() => navigate("/questions")}
        >
          View Questions List
        </button>
      </div>
    </div>
  );
};

export default HomePage;
