import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UploadVideoPage() {
const navigate = useNavigate();

const [video, setVideo] = useState(null);
const [loading, setLoading] = useState(false);

const API =
import.meta.env.VITE_API_URL ||
"https://autofixer-registration.onrender.com";

const savedForm = JSON.parse(
sessionStorage.getItem("autofixer_form") || "{}"
);

// Prevent direct access without registering first
if (!savedForm.name) {
alert("Please complete the registration form first.");
navigate("/register");
return null;
}

const handleFile = (e) => {
setVideo(e.target.files?.[0] ?? null);
};

const handleSubmit = async (e) => {
e.preventDefault();

if (!video) {
return alert("Please select a promo video.");
}

setLoading(true);

try {
// Create multipart form
const fd = new FormData();

fd.append("name", savedForm.name);
fd.append("email", savedForm.email);
fd.append("phone", savedForm.phone);
fd.append("institution", savedForm.institution);
fd.append("educationLevel", savedForm.educationLevel);
fd.append("acceptedTerms", savedForm.acceptedTerms);

fd.append("video", video);

// Upload registration
const res = await fetch(`${API}/api/create-pending`, {
method: "POST",
body: fd,
});

const uploadData = await res.json();

if (!res.ok) {
throw new Error(uploadData.error || "Video upload failed");
}

const registrationId = uploadData.id;

// Create PayPal order
const createOrderRes = await fetch(
`${API}/api/create-paypal-order`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
amount: 2,
}),
}
);

const orderData = await createOrderRes.json();

if (!createOrderRes.ok) {
throw new Error(
orderData.error || "PayPal initialization failed"
);
}

// Save registration id for success page
sessionStorage.setItem(
"registrationId",
registrationId
);

// Find PayPal approval link
const approvalLink = orderData.links?.find(
(link) => link.rel === "approve"
);

if (!approvalLink) {
throw new Error("PayPal approval link not found.");
}

// Redirect to PayPal
window.location.href = approvalLink.href;
} catch (err) {
alert(err.message);
} finally {
setLoading(false);
}
};

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-4">

<div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">

<h1 className="text-3xl font-bold text-center mb-2">
Upload Promo Video
</h1>

<p className="text-center text-gray-600 mb-6">
You're almost done. Upload your promotional video to continue to payment.
</p>

{/* Registration Summary */}

<div className="bg-gray-100 rounded-xl p-5 mb-6">

<h2 className="font-semibold text-lg mb-3">
Registration Summary
</h2>

<div className="space-y-2 text-gray-700">

<p>
<strong>Name:</strong> {savedForm.name}
</p>

<p>
<strong>Email:</strong> {savedForm.email}
</p>

<p>
<strong>Phone:</strong> {savedForm.phone}
</p>

<p>
<strong>Institution:</strong>{" "}
{savedForm.institution}
</p>

<p>
<strong>Education Level:</strong>{" "}
{savedForm.educationLevel}
</p>

</div>

</div>

<form
onSubmit={handleSubmit}
className="space-y-5"
>

<div>

<label className="block font-medium mb-2">
Upload Promo Video
</label>

<input
type="file"
accept="video/*"
onChange={handleFile}
className="w-full border rounded-lg p-3"
required
/>

<p className="text-sm text-gray-500 mt-2">
Upload an original promotional video between 10 and 60 seconds.
</p>

</div>

<button
type="submit"
disabled={loading}
className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
>
{loading
? "Processing..."
: "Proceed to Pay R20"}
</button>

</form>

</div>

</div>
);
}