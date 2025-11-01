import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const handlePayment = (e) => {
    e.preventDefault();
    setTimeout(() => navigate("/success"), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-blue-600 flex justify-center items-center px-6">
      <div
        className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center transform transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Secure Payment</h2>
        <p className="text-gray-500 mb-6">Pay <span className="text-indigo-600 font-semibold">R20</span> to complete registration</p>

        <form onSubmit={handlePayment} className="space-y-5 text-left">
          <input
            type="text"
            placeholder="Name on Card"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            type="text"
            placeholder="Card Number"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="MM/YY"
              required
              className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <input
              type="text"
              placeholder="CVC"
              required
              className="w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 hover:scale-[1.03] transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Pay R20
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
