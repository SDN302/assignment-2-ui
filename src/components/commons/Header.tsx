import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="fixed w-full bg-blue-600 shadow">
      <div className="flex justify-center space-x-4 py-4">
        <Link to="/" className="text-white hover:text-gray-200">
          Home
        </Link>
        <Link to="/quizzes" className="text-white hover:text-gray-200">
          Quizzes
        </Link>
        <Link to="/questions" className="text-white hover:text-gray-200">
          Questions
        </Link>
      </div>
    </header>
  );
};

export default Header;
