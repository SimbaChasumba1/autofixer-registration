import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UploadVideoPage = () => {
  const [video, setVideo] = useState(null);
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 200);
  }, []);

  const handleFileChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-500 flex flex-col justify-center items-center px-6">
      <div
        className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center transform transition-all duration-700 ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Promo Video</h2>
        <form onSubmit={handleSubmit}>
          <label className="block border-2 border-dashed border-indigo-400 rounded-lg p-6 cursor-pointer hover:bg-indigo-50 transition relative group">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {video ? (
              <p className="text-gray-700">{video.name}</p>
            ) : (
              <p className="text-indigo-600 font-semibold group-hover:scale-105 transition-transform">
                Click to upload or drag your video here
              </p>
            )}
          </label>

          {video && (
            <video
              src={URL.createObjectURL(video)}
              controls
              className="mt-4 rounded-lg w-full"
            />
          )}

          <button
            type="submit"
            className="mt-6 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-300"
          >
            Continue to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadVideoPage;
