import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ===============================
// Sanitize video filename
// ===============================
function sanitizeFileName(filename) {
    return filename
        .normalize("NFKD")
        .replace(/[^\w.-]/g, "_")
        .replace(/_+/g, "_");
}

// ===============================
// Upload video to Supabase Storage
// ===============================
export const uploadVideo = async (fileBuffer, filename, mimetype) => {
    const safeFileName = sanitizeFileName(filename);

    // Generate a unique filename
    const fileName = `${Date.now()}-${safeFileName}`;

    const { error } = await supabase.storage
        .from("Promo Videos")
        .upload(fileName, fileBuffer, {
            contentType: mimetype,
            upsert: false,
        });

    if (error) {
        console.error("Supabase upload error:", error);
        throw error;
    }

    const { data } = supabase.storage
        .from("Promo Videos")
        .getPublicUrl(fileName);

    return data.publicUrl;
};

// ===============================
// Save registration to database
// ===============================
export const saveRegistration = async (registration) => {
    const { data, error } = await supabase
        .from("User Details")
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
        .from("User Details")
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
        .from("User Details")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
};
