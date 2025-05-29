"use client";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative">
      {/* Centered Signup Card */}
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
          {/* Signup Form Panel */}
          <div className="md:w-1/2 w-full flex flex-col justify-center p-10 gap-4">
            <div className={styles.loginTitle}>Sign Up</div>
            {success ? (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold">
                Registration successful! Please check your email to confirm your account.
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className={styles.formLabel}>Full Name</label>
                  <div className={styles.inputWrapper}>
                    <img src="/user.svg" alt="User icon" className={styles.inputIcon} />
                    <input id="name" type="text" placeholder="Enter your full name" className={styles.inputField + " " + styles.inputPlaceholder} value={form.name} onChange={handleChange} />
                  </div>
                </div>
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
                <div>
                  <label htmlFor="confirmPassword" className={styles.formLabel}>Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <img src="/pswrd.svg" alt="Password icon" className={styles.inputIcon} />
                    <input id="confirmPassword" type="password" placeholder="Confirm password" className={styles.inputField + " " + styles.inputPlaceholder} value={form.confirmPassword} onChange={handleChange} />
                    <span className={styles.rightIcon + " text-gray-400 cursor-pointer"}>
                      <img src="/eye.svg" alt="Show password" width={16} height={16} />
                    </span>
                  </div>
                </div>
                {error && <div className="text-red-600 text-sm text-center font-semibold">{error}</div>}
                <div className="flex justify-between items-center mt-2">
                  <button type="submit" disabled={loading} className={"bg-[#C3C800] hover:bg-[#b0b800] text-black font-semibold rounded transition-colors " + styles.loginButton}>
                    {loading ? "Signing Up..." : "Sign Up"}
                    <img src="/arrow.svg" alt="Right arrow" width={14} height={14} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      {/* Separate Login Section */}
      <div className={styles.registerCard}>
        <div className={styles.registerText}>
          <span className={styles.registerTitle}>Already have an account?</span>
          <span className={styles.registerSubtitle}>Sign in to your account</span>
        </div>
        <Link href="/" className={styles.registerBtn}>
          Login Here
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24"><path d="M5 12h14m-4-4 4 4-4 4" stroke="#C3C800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
      {/* Subtle background pattern */}
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