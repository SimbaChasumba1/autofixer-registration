import React, { useState, useEffect } from "react";

import axios from "axios";



const RegisterPage = () => {

  const [formData, setFormData] = useState({

    name: "",

    email: "",

    phone: "",

    amount: "",

    message: "",

  });

  const [donors, setDonors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");



  // Fetch donors

  useEffect(() => {

    const fetchDonors = async () => {

      try {

        const res = await axios.get("http://localhost:5000/api/donors");

        setDonors(res.data);

      } catch (err) {

        console.error("Error fetching donors:", err);

      }

    };

    fetchDonors();

  }, []);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

  };



  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    setSuccess("");



    // Frontend validation

    if (!formData.name || !formData.email || !formData.phone) {

      return setError("Please fill in all fields.");

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {

      return setError("Please enter a valid email address.");

    }

    if (formData.phone.length < 8) {

      return setError("Please enter a valid phone number.");

    }



    setLoading(true);

    try {

      const registerRes = await fetch("http://localhost:5000/api/register", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify(formData),

      });

      const registerData = await registerRes.json();

      if (!registerData.success) throw new Error(registerData.message);



      const payRes = await fetch("http://localhost:5000/api/pay", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ name: formData.name }),

      });

      const payData = await payRes.json();

      if (!payData.success) throw new Error(payData.message);



      setSuccess("✅ Registration & payment successful!");

    } catch (err) {

      setError("❌ " + err.message);

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-6">

      <header className="text-center mb-10">

        <h1 className="text-4xl font-bold text-blue-600 mb-2">AutoFixer Donations</h1>

        <p className="text-lg text-gray-600">

          Support the AutoFixer app launch — every bit helps!

        </p>

      </header>



      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md mb-12">

        <h2 className="text-2xl font-semibold mb-4 text-center">Make a Donation</h2>



        {error && <p className="text-red-500 mb-2">{error}</p>}

        {success && <p className="text-green-600 mb-2">{success}</p>}



        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 mb-3" />

        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 mb-3" />

        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 mb-3" />

        <input type="number" name="amount" placeholder="Amount (R)" value={formData.amount} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 mb-3" />

        <textarea name="message" placeholder="Leave a message (optional)" value={formData.message} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2 mb-3"></textarea>



        <button type="submit" disabled={loading} className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}>

          {loading ? "Submitting..." : "Donate Now"}

        </button>

      </form>



      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6">

        <h2 className="text-2xl font-semibold mb-4 text-center">Recent Donors</h2>

        {donors.length === 0 ? (

          <p className="text-gray-500 text-center">No donations yet. Be the first!</p>

        ) : (

          <ul>

            {donors.map((donor, i) => (

              <li key={i} className="border-b border-gray-200 py-3 flex justify-between items-center">

                <div>

                  <p className="font-medium">{donor.name}</p>

                  <p className="text-sm text-gray-500">{donor.message}</p>

                </div>

                <span className="font-semibold text-blue-600">R{donor.amount}</span>

              </li>

            ))}

          </ul>

        )}

      </section>

    </div>

  );

};



export default RegisterPage;



