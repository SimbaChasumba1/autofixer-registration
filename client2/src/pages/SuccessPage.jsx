import React from "react";

import { useNavigate } from "react-router-dom";



export default function SuccessPage() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-600 p-6 text-white">

      <div className="text-center max-w-lg">

        <h1 className="text-4xl font-bold mb-4">🎉 Registration Complete!</h1>

        <p className="mb-6">Thanks! Your video will be reviewed and you’ll be featured soon. We’ll email updates.</p>

        <button onClick={()=>navigate("/")} className="bg-white text-green-700 px-6 py-3 rounded-full font-semibold hover:scale-105">Back to Home</button>

      </div>

    </div>

  );

}



