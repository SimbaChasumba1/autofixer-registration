import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-500 text-white px-4">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Welcome to <span className="text-yellow-300">AutoFixer</span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-100 mb-8">
          AutoFixer connects car owners with the best mechanics in their area — fast, trusted, and local.
          Register, upload a short promo video, pay R20 and get featured in the AutoFixer Promo Drive.
        </p>

        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">How it works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-yellow-300 text-lg font-semibold">Step 1</div>
              <div className="mt-2 text-sm">Register with your details</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-yellow-300 text-lg font-semibold">Step 2</div>
              <div className="mt-2 text-sm">Upload a 10–60s promo video</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5">
              <div className="text-yellow-300 text-lg font-semibold">Step 3</div>
              <div className="mt-2 text-sm">Pay R20 to complete registration</div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/register")}
            className="bg-yellow-400 text-indigo-900 px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
          >
            Get Started
          </button>

          <a
            href="#about"
            className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Learn About AutoFixer
          </a>
        </div>

        <section id="about" className="mt-12 text-left bg-white/5 p-6 rounded-xl">
          <h3 className="text-2xl font-semibold mb-2">About AutoFixer</h3>
          <p className="text-gray-100">
            AutoFixer is a platform that connects car owners with top-rated mechanics in their neighbourhood.
            Owners post the problem, match with vetted mechanics, view quotes and book repairs. This promo drive
            highlights great mechanics and shops, giving them exposure to thousands of users.
          </p>
        </section>
      </div>

      {/* Footer wrapped inside the main container */}
      <footer className="w-full text-center text-sm text-gray-300 mt-auto py-4 bg-transparent">
        © {new Date().getFullYear()} AutoFixer
      </footer>
    </div>
  );
}






