import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadVideoPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';  // API URL
  const navigate = useNavigate();

  const handleFile = (e) => setVideo(e.target.files?.[0] ?? null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!form.name || !form.email || !form.phone) {
      return alert("Please fill all fields.");
    }

    if (!video) {
      return alert("Please select a video to upload.");
    }

    setLoading(true);

    try {
      // 1️⃣ Send form + video to backend
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      fd.append("video", video);

      const res = await fetch(`${API}/api/create-pending`, {
        method: "POST",
        body: fd,
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Create pending failed");

      const registrationId = json.id;

      // 2️⃣ Initialize PayPal transaction
      const createOrderRes = await fetch(`${API}/api/create-paypal-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 20 }), // Adjust the amount dynamically
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok) throw new Error(orderData.error || "PayPal init failed");

      // 3️⃣ Redirect to PayPal for payment
      if (orderData.links) {
        const approvalLink = orderData.links.find(link => link.rel === 'approve');
        if (approvalLink) {
          // After redirecting to PayPal, send the orderId and registrationId to the SuccessPage
          navigate('/success', { state: { orderId: orderData.id, registrationId } });
        } else {
          throw new Error("PayPal approval link not found.");
        }
      } else {
        throw new Error("PayPal approval link missing in response.");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false); // Reset loading state even if there's an error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Register & Upload Promo Video</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full name"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            name="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email address"
            type="email"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone number"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="file"
            accept="video/*"
            onChange={handleFile}
            className="w-full border p-3 rounded-lg"
          />
          <p className="text-sm text-gray-500">
            Video upload is temporary until payment is verified.
          </p>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay R20 & Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
