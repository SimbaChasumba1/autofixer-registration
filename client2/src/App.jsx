import React from "react";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-4">
      {/* Header */}
      <header className="w-full py-4 bg-white shadow-sm fixed top-0 left-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-blue-600">AutoFixer</h1>
          <a
            href="#register"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Register
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="mt-24 max-w-3xl text-center">
        <h2 className="text-3xl font-bold mb-4">Welcome to AutoFixer</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          AutoFixer connects car owners with trusted mechanics and service providers across South Africa. 
          Our mission is to make car maintenance fast, transparent, and stress-free.
        </p>

        <a
          id="register"
          href="#"
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition text-lg font-semibold"
        >
          Register for R20
        </a>

        <p className="mt-6 text-sm text-gray-500">
          Early supporters help fund our app launch. Join the community today.
        </p>
      </main>

      {/* Footer */}
      <footer className="mt-10 text-sm text-gray-500">
        © {new Date().getFullYear()} AutoFixer. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
