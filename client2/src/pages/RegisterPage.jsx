import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "",
    message: "",
  });
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all donors from backend on page load
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

  // ✅ Handle form input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Submit donation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/donors", formData);
      alert("Donation submitted successfully!");
      setFormData({ name: "", email: "", amount: "", message: "" });
      const res = await axios.get("http://localhost:5000/api/donors");
      setDonors(res.data);
    } catch (err) {
      console.error("Error submitting donation:", err);
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center p-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">AutoFixer Donations</h1>
        <p className="text-lg text-gray-600">
          Support the AutoFixer app launch — every bit helps!
        </p>
      </header>

      {/* Donation Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md mb-12"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Make a Donation</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
          required
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount (R)"
          value={formData.amount}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
          required
        />

        <textarea
          name="message"
          placeholder="Leave a message (optional)"
          value={formData.message}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2 mb-3"
        ></textarea>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Donate Now"}
        </button>
      </form>

      {/* Donor List */}
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Recent Donors</h2>
        {donors.length === 0 ? (
          <p className="text-gray-500 text-center">No donations yet. Be the first!</p>
        ) : (
          <ul>
            {donors.map((donor, index) => (
              <li
                key={index}
                className="border-b border-gray-200 py-3 flex justify-between items-center"
              >
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

export default App;