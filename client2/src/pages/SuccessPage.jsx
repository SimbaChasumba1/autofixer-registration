// File: src/pages/SuccessPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId"); // PayPal order ID
  const registrationId = searchParams.get("registrationId"); // registration ID passed from UploadVideoPage
  const [msg, setMsg] = useState("Completing...");
  const [videoLink, setVideoLink] = useState(null);

  useEffect(() => {
    if (!orderId || !registrationId) {
      setMsg("Payment failed or missing details.");
      return;
    }

    // Fetch payment status from your backend
    const fetchStatus = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/paypal-payment-status`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, registrationId })
        });

        const data = await res.json();

        if (res.ok && data.status === "COMPLETED") {
          setMsg(`Payment successful! Order ID: ${orderId}. We’ll confirm your video shortly.`);
          if (data.registration?.driveWebView) {
            setVideoLink(data.registration.driveWebView);
          }
        } else if (data.status === "PENDING") {
          setMsg(`Payment is still pending. Please wait for confirmation.`);
        } else {
          setMsg("Payment failed or not confirmed.");
        }
      } catch (err) {
        console.error(err);
        setMsg("Error checking payment status. Please try again later.");
      }
    };

    fetchStatus();
  }, [orderId, registrationId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Success</h1>
        <p className="mb-4">{msg}</p>
        {videoLink && (
          <a
            href={videoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View your uploaded video
          </a>
        )}
      </div>
    </div>
  );
}
