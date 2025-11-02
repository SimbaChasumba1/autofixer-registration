import React, { useState } from "react";

import { useNavigate, Link } from "react-router-dom";



export default function RegisterPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });



  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });



  const handleContinue = (e) => {

    e.preventDefault();

    // basic validation

    if (!form.name || !form.email || !form.phone) return alert("Please fill all fields");

    sessionStorage.setItem("autofixer_form", JSON.stringify(form));

    navigate("/upload-video");

  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-4">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="flex justify-between items-center mb-4">

          <h1 className="text-2xl font-bold">Register</h1>

          <Link to="/" className="text-sm text-gray-500 hover:underline">Back to Home</Link>

        </div>



        <form onSubmit={handleContinue} className="space-y-4">

          <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" className="w-full border p-3 rounded-lg" required />

          <input name="email" value={form.email} onChange={handleChange} placeholder="Email address" type="email" className="w-full border p-3 rounded-lg" required />

          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number" className="w-full border p-3 rounded-lg" required />

          <div className="flex gap-3">

            <button type="submit" className="flex-1 bg-indigo-600 text-white py-3 rounded-lg">Continue</button>

            <Link to="/" className="flex-1 text-center py-3 rounded-lg border border-gray-200">Cancel</Link>

          </div>

        </form>

      </div>

    </div>

  );

}

