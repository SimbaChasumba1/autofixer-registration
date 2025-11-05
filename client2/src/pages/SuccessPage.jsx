// File: src/pages/SuccessPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("reference"); // Paystack reference
  const [msg, setMsg] = useState("Completing...");
  const [videoLink, setVideoLink] = useState(null);

  useEffect(() => {
    if (!ref) {
      setMsg("Payment completed — thanks! We'll email you a confirmation.");
      return;
    }

    // Fetch registration/payment status from backend
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `https://bunny-explainable-michaela.ngrok-free.dev/api/paystack/verify/${ref}`
        );
        const data = await res.json();

        if (data.status === "success") {
          setMsg(
            `Payment successful! Reference: ${ref} — We'll confirm your video shortly.`
          );

          if (data.registration.driveWebView) {
            setVideoLink(data.registration.driveWebView);
          }
        } else if (data.status === "pending") {
          setMsg(`Payment is pending. Reference: ${ref}`);
        } else {
          setMsg("Payment reference not found or invalid.");
        }
      } catch (err) {
        console.error(err);
        setMsg("Error checking payment status. Please try again later.");
      }
    };

    fetchStatus();
  }, [ref]);

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
