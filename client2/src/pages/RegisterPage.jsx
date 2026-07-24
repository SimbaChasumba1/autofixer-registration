import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
const navigate = useNavigate();

const [form, setForm] = useState({
name: "",
email: "",
phone: "",
institution: "",
educationLevel: "",
acceptedTerms: false,
});

const handleChange = (e) => {
const { name, value, type, checked } = e.target;

setForm({
...form,
[name]: type === "checkbox" ? checked : value,
});
};

const handleContinue = (e) => {
e.preventDefault();

if (
!form.name ||
!form.email ||
!form.phone ||
!form.institution ||
!form.educationLevel
) {
return alert("Please complete all required fields.");
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(form.email)) {
return alert("Please enter a valid email address.");
}

if (form.phone.length < 8) {
return alert("Please enter a valid phone number.");
}

if (!form.acceptedTerms) {
return alert("You must accept the Terms & Conditions.");
}

sessionStorage.setItem(
"autofixer_form",
JSON.stringify(form)
);

navigate("/upload-video");
};

return (
<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 p-4">

<div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

<div className="flex justify-between items-center mb-4">
<h1 className="text-2xl font-bold">
Register
</h1>

<Link
to="/"
className="text-sm text-gray-500 hover:underline"
>
Back to Home
</Link>
</div>

<form
onSubmit={handleContinue}
className="space-y-4"
>

<input
name="name"
value={form.name}
onChange={handleChange}
placeholder="Full Name"
className="w-full border p-3 rounded-lg"
required
/>

<input
name="email"
type="email"
value={form.email}
onChange={handleChange}
placeholder="Email Address"
className="w-full border p-3 rounded-lg"
required
/>

<input
name="phone"
value={form.phone}
onChange={handleChange}
placeholder="Phone Number"
className="w-full border p-3 rounded-lg"
required
/>

{/* NEW */}

<input
name="institution"
value={form.institution}
onChange={handleChange}
placeholder="Institution Name"
className="w-full border p-3 rounded-lg"
required
/>

{/* NEW */}

<select
name="educationLevel"
value={form.educationLevel}
onChange={handleChange}
className="w-full border p-3 rounded-lg"
required
>
<option value="">
Select Education Level
</option>

<option value="Primary School">
Primary School
</option>

<option value="High School">
High School
</option>

<option value="College">
College
</option>

<option value="University">
University
</option>

<option value="Postgraduate">
Postgraduate Studies
</option>
</select>

{/* NEW */}

<div className="flex items-start gap-2">

<input
type="checkbox"
name="acceptedTerms"
checked={form.acceptedTerms}
onChange={handleChange}
className="mt-1"
/>

<label className="text-sm text-gray-600">
I have read and agree to the{" "}
<Link
to="/terms"
className="text-indigo-600 font-medium hover:underline"
>
Terms & Conditions
</Link>.
</label>

</div>

<div className="flex gap-3">

<button
type="submit"
className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition"
>
Continue
</button>

<Link
to="/"
className="flex-1 text-center py-3 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
>
Cancel
</Link>

</div>

</form>

</div>

</div>
);
}