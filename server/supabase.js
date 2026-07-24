import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ===============================
// Upload video to Supabase Storage
// ===============================
export const uploadVideo = async (fileBuffer, filename, mimetype) => {
const { error } = await supabase.storage
.from("Promo Videos") // <-- Your Storage Bucket
.upload(filename, fileBuffer, {
contentType: mimetype,
});

if (error) throw error;

const { data } = supabase.storage
.from("Promo Videos")
.getPublicUrl(filename);

return data.publicUrl;
};

// ===============================
// Save registration to database
// ===============================
export const saveRegistration = async (registration) => {
const { data, error } = await supabase
.from("Client Details") // <-- Your Table
.insert([
{
name: registration.name,
email: registration.email,
phone: registration.phone,
institution: registration.institution,
education_level: registration.educationLevel,
video_url: registration.videoUrl,
paid: registration.paid,
},
])
.select();

if (error) throw error;

return data;
};

// ===============================
// Update payment status
// ===============================
export const markRegistrationAsPaid = async (id) => {
const { data, error } = await supabase
.from("Client Details")
.update({
paid: true,
})
.eq("id", id)
.select();

if (error) throw error;

return data;
};

// ===============================
// Fetch all registrations
// ===============================
export const fetchUsers = async () => {
const { data, error } = await supabase
.from("Client Details")
.select("*")
.order("created_at", { ascending: false });

if (error) throw error;

return data;
};


