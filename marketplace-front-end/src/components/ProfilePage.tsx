"use client"
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const response = await axios.get<UserProfile>(`/api/users/${userId}`);
        setProfile(response.data);
        setForm({ name: response.data.name, email: response.data.email, password: "" });
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      // Only send password if it's filled
      const payload: any = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;

      const response = await axios.put<UserProfile>(`/api/users/${profile.id}`, payload);
      setProfile(response.data);
      setEditMode(false);
      setSuccess(true);
      setForm({ ...form, password: "" }); // Clear password field after save
    } catch (err) {
      setError("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#fff]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-lg text-[#495D69]">Loading profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fff]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#DBDBDB] p-8 shadow-sm flex flex-col gap-6">
          <h1 className="text-2xl font-bold text-[#1C2834] mb-2">My Profile</h1>
          <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 rounded-full bg-[#C1CF16]/30 flex items-center justify-center text-3xl font-bold text-[#C1CF16] mb-2">
              {profile?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <span className="text-[#495D69] text-sm bg-[#F7F8FB] px-3 py-1 rounded-full font-semibold">
              Role: {profile?.role || "-"}
            </span>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">Profile updated!</div>}
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-[#495D69] text-sm">Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                disabled={!editMode}
                className="border border-[#DBDBDB] rounded-lg px-3 py-2 text-[#1C2834] bg-[#F7F8FB] focus:outline-none focus:ring-2 focus:ring-[#C1CF16]"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[#495D69] text-sm">Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                disabled={!editMode}
                className="border border-[#DBDBDB] rounded-lg px-3 py-2 text-[#1C2834] bg-[#F7F8FB] focus:outline-none focus:ring-2 focus:ring-[#C1CF16]"
              />
            </label>
            {editMode && (
              <label className="flex flex-col gap-1">
                <span className="text-[#495D69] text-sm">New Password</span>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current"
                  className="border border-[#DBDBDB] rounded-lg px-3 py-2 text-[#1C2834] bg-[#F7F8FB] focus:outline-none focus:ring-2 focus:ring-[#C1CF16]"
                />
              </label>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            {editMode ? (
              <>
                <button
                  className="px-6 py-2 bg-[#C1CF16] rounded-lg font-bold text-[#1C2834] hover:bg-[#b0b800] transition-colors"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  className="px-6 py-2 border border-[#DBDBDB] rounded-lg font-semibold text-[#1C2834] bg-white hover:bg-[#F7F8FB]"
                  onClick={() => {
                    if (profile) setForm({ name: profile.name, email: profile.email, password: "" });
                    setEditMode(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="px-6 py-2 border border-[#DBDBDB] rounded-lg font-semibold text-[#1C2834] bg-white hover:bg-[#F7F8FB]"
                onClick={() => setEditMode(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
