'use client'
import { Home, Store, Search, ShoppingCart, Heart, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import UserDropdown from "./UserDropdown";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Optional: Close dropdown when clicking outside
  // useEffect(() => {
  //   function handleClick(e: MouseEvent) {
  //     if (userRef.current && !userRef.current.contains(e.target as Node)) {
  //       setDropdownOpen(false);
  //     }
  //   }
  //   if (dropdownOpen) document.addEventListener("mousedown", handleClick);
  //   return () => document.removeEventListener("mousedown", handleClick);
  // }, [dropdownOpen]);

  const handleOpenStoreClick = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return;
    const user = JSON.parse(userStr);
    if (user.applicationStatus === "NONE") {
      // If on /home, scroll to OpenYourStore
      if (pathname === "/home") {
        const el = document.getElementById("open-your-store-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      } else {
        // If not on /home, go to /home and scroll after navigation
        router.push("/home#openyourstore");
      }
    } else if (user.applicationStatus === "PENDING") {
      alert("Wait for admin approval.");
    } else if (user.applicationStatus === "APPROVED") {
      router.push("/createstore");
    }
  };

  return (
    <nav className="flex flex-row justify-between items-center px-10 py-2 w-full max-w-[1728px] h-[68px] bg-white border-b border-[#DBDBDB]">
      {/* Left: Logo and Brand */}
      <div className="flex flex-row items-center gap-4">
        <img src="/logo.png" style={{ width: '30px', height: '30px' }} alt="Mark8 Logo" className="w-10 h-10" />
        <div className="flex flex-col items-start">
          <span className="font-bold text-[16px] leading-[21px] capitalize text-[#0C0D0D]">Mark8</span>
          <span className="font-light text-[12px] leading-[24px] text-[#495D69]">By Awesomity Lab</span>
        </div>
      </div>
      {/* Center: Navigation */}
      <div className="flex flex-row items-center gap-8">
        <Link href="/" className="flex flex-row items-center gap-2 px-4 py-2 rounded font-bold text-[#C1CF16] bg-[#F7F8FB]">
          <Home className="w-4 h-4" />
          Home
        </Link>
        <Link href="/stores" className="flex flex-row items-center gap-2 px-4 py-2 rounded text-[#495D69] hover:bg-[#F7F8FB]">
          <Store className="w-4 h-4" />
          Stores
        </Link>
      </div>
      {/* Right: Actions */}
      <div className="flex flex-row items-center gap-4">
        <button className="flex items-center justify-center w-10 h-10 border border-[#DBDBDB] rounded-lg">
          <Search className="w-5 h-5 text-[#495D69]" />
        </button>
        <Link href="/cart" className="flex flex-row items-center gap-1 text-[#495D69]">
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[14px]">My Cart</span>
          <span className="text-[#EE4545] ml-1">*</span>
        </Link>
        <Link href="/saved" className="flex flex-row items-center gap-1 text-[#495D69]">
          <Heart className="w-5 h-5" />
          <span className="text-[14px]">Saved</span>
        </Link>
        <button
          className="flex flex-row items-center gap-2 px-4 py-2 border border-[#DBDBDB] rounded-lg font-bold text-[14px] text-[#141C24] bg-white hover:bg-[#F7F8FB]"
          onClick={handleOpenStoreClick}
        >
          Open A Store <Store className="w-4 h-4 text-[#C1CF16]" />
        </button>
        <div
          className="relative flex flex-row items-center px-3 border border-[#DBDBDB] rounded-lg gap-2 h-10 cursor-pointer"
          ref={userRef}
          onClick={() => setDropdownOpen((v) => !v)}
        >
          <User className="w-5 h-5 text-[#495D69] opacity-40" />
          <ChevronDown className="w-4 h-4 text-[#495D69]" />
          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50">
              <UserDropdown />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}