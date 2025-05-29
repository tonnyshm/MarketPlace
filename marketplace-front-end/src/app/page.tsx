"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext'; // Import the global auth context

export default function Home() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user, login } = useAuth(); // Use the global auth context

  useEffect(() => {
    // Check if user is already logged in
    if (user && user.role) {
      redirectBasedOnRole(user.role);
    }

    if (window.location.hash === "#openyourstore") {
      const el = document.getElementById("open-your-store-section");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, [user]);

  const redirectBasedOnRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        router.push("/admin");
        break;
      case "SELLER":
        router.push("/seller");
        break;
      case "SHOPPER":
        router.push("/home");
        break;
      default:
        router.push("/home");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!res.ok) {
        throw new Error("Invalid email or password");
      }
      const data = await res.json();

      // Fetch user info from /api/auth/me
      const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      if (userRes.ok) {
        const user = await userRes.json();
        login(data.token, user);
        redirectBasedOnRole(user.role);
      } else {
        throw new Error("Failed to fetch user data");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      {/* Centered Login Card */}
      <div className="w-full max-w-3xl flex flex-col items-stretch rounded-2xl shadow-md border border-[#d1d1d1] overflow-hidden bg-white">
        <div className="flex flex-col md:flex-row w-full">
          {/* Left Info Panel */}
          <div className={styles.leftPanel + " md:w-1/2 w-full"}>
            <div className={styles.logoTop}>
              <Image src="/logo.png" alt="Logo" width={56} height={56} />
            </div>
            <div style={{ flex: 1 }} />
            <div className={styles.centerText}>
              <div className={styles.title}>Mark8</div>
              <div className={styles.subtitle}>By Awesomnity Lab</div>
            </div>
            <div style={{ flex: 1 }} />
            <div className={styles.copyright}>© 2024 Awesomnity Lab</div>
          </div>
          {/* Login Form Panel */}
          <div className="md:w-1/2 w-full flex flex-col justify-center p-10 gap-4">
            <div className={styles.loginTitle}>Login</div>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className={styles.formLabel}>Email</label>
                <div className={styles.inputWrapper}>
                  <img src="/emailIcon.svg" alt="Email icon" className={styles.inputIcon} />
                  <input id="email" type="email" placeholder="Enter email" className={styles.inputField + " " + styles.inputPlaceholder} value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div>
                <label htmlFor="password" className={styles.formLabel}>Password</label>
                <div className={styles.inputWrapper}>
                  <img src="/pswrd.svg" alt="Password icon" className={styles.inputIcon} />
                  <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter password" className={styles.inputField + " " + styles.inputPlaceholder} value={form.password} onChange={handleChange} />
                  <span className={styles.rightIcon + " text-gray-400 cursor-pointer"} onClick={() => setShowPassword((v) => !v)}>
                    <img src="/eye.svg" alt="Show password" width={16} height={16} />
                  </span>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
              <div className="flex justify-between items-center mt-2">
                <a href="#" className={styles.forgotLink}>Forgot Password?</a>
                <button type="submit" disabled={loading} className={"bg-[#C3C800] hover:bg-[#b0b800] text-black font-semibold rounded transition-colors " + styles.loginButton}>
                  {loading ? "Logging in..." : "Login"}
                  <img src="/arrow.svg" alt="Right arrow" width={14} height={14} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Separate Register Section */}
      <div className={styles.registerCard}>
        <div className={styles.registerText}>
          <span className={styles.registerTitle}>New Here?</span>
          <span className={styles.registerSubtitle}>Create an account</span>
        </div>
        <Link href="/signup" className={styles.registerBtn}>
          Register Here
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14m-4-4 4 4-4 4" stroke="#C3C800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
      {/* Subtle background pattern (optional, for extra polish) */}
      <div className="absolute inset-0 -z-10">
        <svg width="100%" height="100%" viewBox="0 0 1440 900" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <polygon points="0,0 1440,0 1440,900" fill="#E3E3E3" />
          <polygon points="0,0 800,0 0,900" fill="#E0E0E0" />
          <polygon points="1440,0 1440,900 800,900" fill="#E0E0E0" />
        </svg>
      </div>
    </div>
  );
}
