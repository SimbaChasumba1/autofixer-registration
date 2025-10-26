import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000")
      .then((res) => res.text())
      .then((data) => setMessage(data));
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white text-2xl">
      <h1 className="mb-4 text-3xl font-bold">AutoFixer Registration Page</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
