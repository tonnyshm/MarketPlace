"use client";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-start gap-5 w-[800px] min-h-[519px]">
      {/* Main Card */}
      <div className="flex flex-row w-[800px] h-[371px] bg-white rounded-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="flex flex-col justify-between items-center bg-[#F4F5F6] w-[400px] h-full p-10 gap-20">
          {/* Logo */}
          <div className="flex flex-col items-center gap-4">
            <img src="/logo.png" alt="Mark8 Logo" className="w-14 h-14 mx-auto" />
            <div className="font-black text-2xl text-[#0C0D0D]">Seat60</div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[14px] font-light text-[#495D69]">By Awesomity Lab</span>
            <span className="text-[12px] font-light text-[#495D69]">© 2024 Awesomity Lab</span>
          </div>
        </div>
        {/* Right Panel */}
        <div className="flex flex-col items-start p-10 gap-10 w-[400px] h-full">
          <div className="font-black text-2xl text-[#0C0D0D]">Login</div>
          <form className="flex flex-col gap-5 w-full">
            {/* Email */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[10px] font-semibold text-[#0C0D0D] capitalize">Email</label>
              <div className="flex flex-row items-center gap-4 bg-black/5 rounded-lg px-4 py-2 w-full">
                <Mail className="w-4 h-4 text-[#C1CF16]" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-transparent outline-none text-[14px] text-[#0C0D0D] placeholder:text-[#0C0D0D]/60"
                />
              </div>
            </div>
            {/* Password */}
            <div className="flex flex-col gap-2 w-full">
              <label className="text-[10px] font-semibold text-[#0C0D0D] capitalize">Password</label>
              <div className="flex flex-row items-center gap-4 bg-black/5 rounded-lg px-4 py-2 w-full">
                <Lock className="w-4 h-4 text-[#C1CF16]" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent outline-none text-[14px] text-[#0C0D0D] placeholder:text-[#0C0D0D]/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#0C0D0D]" />
                  ) : (
                    <Eye className="w-4 h-4 text-[#0C0D0D]" />
                  )}
                </button>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-row justify-between items-center w-full gap-8">
              <button
                type="button"
                className="font-semibold text-[14px] underline text-[#141C24] bg-transparent"
              >
                Forgot password?
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-2 bg-[#C1CF16] rounded-lg font-extrabold text-[14px] text-[#1C2834] capitalize"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Bottom Card */}
      <div className="flex flex-row justify-between items-center w-[800px] h-[128px] bg-white rounded-2xl px-10 py-8 mt-5">
        <div className="flex flex-col gap-1">
          <span className="font-medium text-[14px] text-[#0C0D0D]">New Here?</span>
          <span className="font-light text-[14px] text-[#495D69]">Create an account</span>
        </div>
        <button className="flex items-center gap-2 px-8 py-2 border border-[#DBDBDB] rounded-lg font-extrabold text-[14px] text-[#141C24] capitalize">
          Sign Up
          <ArrowRight className="w-4 h-4 text-[#C1CF16]" />
        </button>
      </div>
    </div>
  );
}