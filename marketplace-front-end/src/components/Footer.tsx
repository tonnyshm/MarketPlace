import { Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="flex flex-row justify-between items-center px-20 py-10 w-full max-w-[1728px] h-[120px] bg-[#F4F5F6] z-10">
      {/* Left: Logo and Brand */}
      <div className="flex flex-row items-center gap-2 w-[100px] h-[40px]">
        <img src="/logo.png"  style={{ width: '30px', height: '30px' }} alt="Mark8 Logo" className="w-10 h-10" />
        <span className="font-bold text-[16px] leading-[21px] capitalize text-[#0C0D0D]">Seat60</span>
      </div>
      {/* Center: Copyright */}
      <div className="flex flex-row justify-center items-start gap-4 w-[224px] h-[10px]">
        <span className="font-medium text-[14px] leading-[18px] text-[#0C0D0D] text-center">©2024. Beninging</span>
        <span className="font-light text-[14px] leading-[24px] text-[#495D69]">By Awesomity Ltd</span>
      </div>
      {/* Right: Socials */}
      <div className="flex flex-row items-center gap-4 w-[112px] h-[16px]">
        <a href="#" aria-label="Twitter">
          <Twitter className="w-4 h-4 text-[#0C0D0D]" />
        </a>
        <a href="#" aria-label="Instagram">
          <Instagram className="w-4 h-4 text-[#0C0D0D]" />
        </a>
        <a href="#" aria-label="YouTube">
          <Youtube className="w-4 h-4 text-[#0C0D0D]" />
        </a>
        <a href="#" aria-label="LinkedIn">
          <Linkedin className="w-4 h-4 text-[#0C0D0D]" />
        </a>
      </div>
    </footer>
  );
}