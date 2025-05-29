'use client'
import { ArrowRight, Mail } from "lucide-react";
import { useState } from "react";

export default function OpenYourStore() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    // Get user from localStorage
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setMessage("You must be logged in.");
      setLoading(false);
      return;
    }
    const user = JSON.parse(userStr);

    // Check if entered email matches logged-in user's email
    if (email !== user.email) {
      setMessage("Please use your account email.");
      setLoading(false);
      return;
    }

    // Call backend to apply as seller
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user.id}/apply-seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) throw new Error("Failed to apply as seller.");
      setMessage("Application submitted! Please wait for admin approval.");
    } catch (err) {
      setMessage("Failed to apply as seller.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="open-your-store-section" className="w-full max-w-4xl mx-auto bg-white border border-[#DBDBDB] rounded-2xl shadow-md p-0 my-8">
      <section className="w-full flex flex-row justify-between items-center bg-[url('/bg_lines.png'),#F7F8FB] bg-cover rounded-2xl px-10 py-8">
        <h2 className="font-black text-2xl">
          <span className="text-[#C1CF16]">Open</span>
          <span className="text-[#1C2834]"> your Store</span>
        </h2>
        <form className="flex flex-row items-center gap-0 w-[600px] max-w-full" onSubmit={handleSubmit}>
          <div className="flex flex-row items-center bg-[#F7F8FB] px-4 py-3 rounded-l-lg border border-r-0 border-[#F7F8FB] w-full">
            <Mail className="w-5 h-5 text-[#C1CF16] mr-2" />
            <input
              type="email"
              placeholder="Enter your Email"
              className="flex-1 bg-transparent outline-none text-[16px] text-[#1C2834] placeholder:text-[#1C2834]/60"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-[#C1CF16] rounded-r-lg font-extrabold text-[16px] text-[#1C2834] capitalize"
            disabled={loading}
          >
            {loading ? "Submitting..." : <>Submit <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
        {message && <div className="ml-6 text-[#1C2834] font-semibold">{message}</div>}
      </section>
    </div>
  );
}