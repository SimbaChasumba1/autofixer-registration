import React, { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";



export default function PaymentPage() {

  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";



  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });



  useEffect(() => {

    const saved = sessionStorage.getItem("autofixer_form");

    if (saved) setForm(JSON.parse(saved));

  }, []);



  async function handlePay(e) {

    e.preventDefault();

    setProcessing(true);

    try {

      const registrationId = sessionStorage.getItem("autofixer_registration_id");

      if (!registrationId) throw new Error("Missing registration id");



      const res = await fetch(`${API_BASE}/api/initiate-payfast`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ amount: 20, registrationId })

      });

      if (!res.ok) throw new Error("Failed to initiate payment");

      const json = await res.json();

      const { url } = json;

      // redirect the user to PayFast checkout page

      window.location.href = url;

    } catch (err) {

      console.error("Payment init error", err);

      alert("Payment start failed. Try again.");

      setProcessing(false);

    }

  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-600 p-4">

      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">Confirm payment — R20</h2>

          <Link to="/" className="text-sm text-gray-500 hover:underline">Home</Link>

        </div>



        <p className="text-sm text-gray-600 mb-4">This will redirect you to PayFast (sandbox for testing).</p>



        <div className="space-y-3">

          <div className="bg-gray-50 p-3 rounded">Name: {form.name}</div>

          <div className="bg-gray-50 p-3 rounded">Email: {form.email}</div>

          <div className="bg-gray-50 p-3 rounded">Phone: {form.phone}</div>

        </div>



        <button onClick={handlePay} disabled={processing} className={`mt-6 w-full py-3 rounded-lg text-white font-semibold ${processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>

          {processing ? "Redirecting..." : "Pay R20 & Complete Registration"}

        </button>

      </div>

    </div>

  );

}





