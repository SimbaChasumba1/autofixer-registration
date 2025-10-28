import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">AutoFixer</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Simplify your car repair bookings. Register today and get connected with verified mechanics instantly.
      </p>
      <Link
        to="/register"
        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
      >
        Register Now
      </Link>
    </div>
  );
};

export default LandingPage;