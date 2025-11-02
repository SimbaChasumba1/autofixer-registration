import React, { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";



export default function PaymentPage() {

  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const [card, setCard] = useState({ nameOnCard: "", number: "", expiry: "", cvc: "" });

  const [processing, setProcessing] = useState(false);



  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";



  useEffect(() => {

    const saved = sessionStorage.getItem("autofixer_form");

    if (saved) setForm(JSON.parse(saved));

  }, []);



  const handlePay = async (e) => {

    e.preventDefault();

    if (!card.nameOnCard || !card.number) return alert("Enter mock card details.");



    setProcessing(true);

    try {

      const fd = new FormData();

      const saved = sessionStorage.getItem("autofixer_form");

      const parsed = saved ? JSON.parse(saved) : form;

      fd.append("name", parsed.name);

      fd.append("email", parsed.email);

      fd.append("phone", parsed.phone);



      if (window.autofixerVideo instanceof File) {

        fd.append("video", window.autofixerVideo, window.autofixerVideo.name);

      }



      // attach mock payment record

      fd.append("paymentMock", JSON.stringify({ amount: 20, cardLast4: card.number.slice(-4) }));



      const res = await fetch(`${API_BASE}/api/register`, { method: "POST", body: fd });

      if (!res.ok) {

        const json = await res.json().catch(()=>({ error: "server" }));

        throw new Error(json.error || "Server error");

      }

      await res.json();

      sessionStorage.removeItem("autofixer_form");

      if (window.autofixerVideo) delete window.autofixerVideo;

      navigate("/success");

    } catch (err) {

      console.error("Payment error:", err);

      alert("Network error. Please try again later.");

    } finally {

      setProcessing(false);

    }

  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-600 p-4">

      <div className="bg-white text-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">Confirm payment — R20</h2>

          <Link to="/" className="text-sm text-gray-500 hover:underline">Home</Link>

        </div>



        <p className="text-sm text-gray-600 mb-4">This is a mock payment for demo purposes (no real charge).</p>



        <form onSubmit={handlePay} className="space-y-3">

          <input value={card.nameOnCard} onChange={(e)=>setCard({...card, nameOnCard:e.target.value})} placeholder="Name on card" className="w-full border p-3 rounded" required />

          <input value={card.number} onChange={(e)=>setCard({...card, number:e.target.value})} placeholder="Card number" className="w-full border p-3 rounded" required />

          <div className="flex gap-2">

            <input value={card.expiry} onChange={(e)=>setCard({...card, expiry:e.target.value})} placeholder="MM/YY" className="flex-1 border p-3 rounded" required />

            <input value={card.cvc} onChange={(e)=>setCard({...card, cvc:e.target.value})} placeholder="CVC" className="w-1/3 border p-3 rounded" required />

          </div>



          <button type="submit" disabled={processing} className={`w-full py-3 rounded-lg text-white font-semibold ${processing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}>

            {processing ? "Processing..." : "Pay R20 & Register"}

          </button>

        </form>

      </div>

    </div>

  );

}





