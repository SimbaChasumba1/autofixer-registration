import React, { useEffect, useState } from "react";

import { useNavigate, Link } from "react-router-dom";



export default function UploadVideoPage() {

  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";



  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  const [videoFile, setVideoFile] = useState(null);

  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    const saved = sessionStorage.getItem("autofixer_form");

    if (saved) setForm(JSON.parse(saved));

  }, []);



  useEffect(() => {

    return () => {

      if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);

    };

  }, [videoPreviewUrl]);



  const handleFileChange = (e) => {

    const file = e.target.files?.[0] ?? null;

    if (!file) { setVideoFile(null); setVideoPreviewUrl(null); return; }

    const maxBytes = 50 * 1024 * 1024;

    if (file.size > maxBytes) return alert("Video too large (max 50MB).");

    setVideoFile(file);

    setVideoPreviewUrl(URL.createObjectURL(file));

  };



  async function handleContinue(e) {

    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {

      alert("Please fill required details");

      return;

    }

    setLoading(true);

    try {

      // 1) Upload temp file if exists

      let tempId = null;

      if (videoFile) {

        const fd = new FormData();

        fd.append("video", videoFile, videoFile.name);

        const upRes = await fetch(`${API_BASE}/api/upload-temp`, { method: "POST", body: fd });

        if (!upRes.ok) throw new Error("Temp upload failed");

        const upJson = await upRes.json();

        tempId = upJson.tempId;

      }



      // 2) Create pending registration (saves name/email/phone and tempId) -> returns registrationId

      const createRes = await fetch(`${API_BASE}/api/create-pending`, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ ...form, tempId })

      });

      if (!createRes.ok) throw new Error("Failed to create registration");

      const { id } = await createRes.json();



      // save registration id locally (optional)

      sessionStorage.setItem("autofixer_registration_id", id);

      // also keep form stored

      sessionStorage.setItem("autofixer_form", JSON.stringify(form));



      // 3) navigate to payment page

      navigate("/payment");

    } catch (err) {

      console.error(err);

      alert("Upload or registration failed. Try again.");

    } finally {

      setLoading(false);

    }

  }



  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 p-4">

      <div className="bg-white text-gray-900 rounded-2xl shadow-2xl w-full max-w-xl p-6">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-2xl font-bold">Upload Promo Video</h2>

          <Link to="/" className="text-sm text-gray-500 hover:underline">Home</Link>

        </div>



        <form onSubmit={handleContinue} className="space-y-4">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <input name="name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Full name" className="col-span-1 sm:col-span-3 border p-3 rounded" />

            <input name="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" className="col-span-1 sm:col-span-3 border p-3 rounded" />

            <input name="phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} placeholder="Phone" className="col-span-1 sm:col-span-3 border p-3 rounded" />

          </div>



          <div className="border border-dashed rounded-lg p-4 text-center bg-gray-50">

            <label htmlFor="video-upload" className="cursor-pointer inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">

              {videoFile ? "Change Video" : "Choose Video"}

            </label>

            <input id="video-upload" type="file" accept="video/*" onChange={handleFileChange} className="hidden" />

            <p className="mt-3 text-sm text-gray-600">{videoFile ? `Selected: ${videoFile.name} (${Math.round(videoFile.size/1024/1024)}MB)` : "No video chosen"}</p>

            {videoPreviewUrl && (<video src={videoPreviewUrl} controls className="mt-4 w-full rounded" />)}

          </div>



          <div className="flex gap-3">

            <Link to="/register" className="flex-1 bg-gray-200 py-2 rounded text-center">Back</Link>

            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded" disabled={loading}>

              {loading ? "Working..." : "Continue to Payment"}

            </button>

          </div>

        </form>

      </div>

    </div>

  );

}





