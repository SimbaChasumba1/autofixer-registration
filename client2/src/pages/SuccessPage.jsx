import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SuccessPage = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-emerald-600 flex flex-col justify-center items-center text-center px-6 text-white">
      <div
        className={`transform transition-all duration-700 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
      >
        <h1 className="text-4xl font-bold mb-4">🎉 Registration Complete!</h1>
        <p className="text-lg max-w-md mb-8">
          Thank you for joining the AutoFixer Promotion Drive! Your video will be reviewed, and you'll be featured soon.
        </p>
        <Link
          to="/"
          className="bg-white text-green-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;
