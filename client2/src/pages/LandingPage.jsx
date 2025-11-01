import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-500 text-white flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Animated Background Circles */}
      <div className="absolute w-72 h-72 bg-indigo-400/30 rounded-full blur-3xl top-10 left-[-100px] animate-pulse"></div>
      <div className="absolute w-80 h-80 bg-purple-400/30 rounded-full blur-3xl bottom-10 right-[-100px] animate-pulse"></div>

      {/* Main Content */}
      <div
        className={`text-center transform transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          Welcome to <span className="text-yellow-300">AutoFixer</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
          Showcase your passion for cars, share your video, and stand a chance to be featured in the AutoFixer Promo Drive! Join in just a few simple steps.
        </p>

        {/* Steps Section */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg hover:scale-105 transition-transform duration-300 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2 text-yellow-300">Step 1</h3>
            <p>Register with your details</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg hover:scale-105 transition-transform duration-300 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2 text-yellow-300">Step 2</h3>
            <p>Upload your promo video</p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-lg hover:scale-105 transition-transform duration-300 shadow-md text-center">
            <h3 className="text-xl font-semibold mb-2 text-yellow-300">Step 3</h3>
            <p>Pay R20 and get featured!</p>
          </div>
        </div>

        {/* Call to Action Button */}
        <button
          onClick={() => navigate("/register")}
          className="bg-yellow-400 text-indigo-900 font-semibold px-10 py-4 rounded-full shadow-xl hover:bg-yellow-300 hover:scale-105 transition-all duration-300 animate-bounce-slow"
        >
          Get Started
        </button>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-5 text-gray-200 text-sm opacity-80">
        © {new Date().getFullYear()} AutoFixer Promotions
      </footer>

      {/* Animation for Gentle Bounce */}
      <style>
        {`
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default LandingPage;
