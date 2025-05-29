'use client'
import {
  User,
  ShoppingCart,
  HelpCircle,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="absolute right-0 mt-2 z-50 flex flex-col items-start p-[30px_40px_40px] gap-[30px] w-[306px] h-[482px] bg-white shadow-[0_20px_36px_rgba(0,0,0,0.1)] rounded-b-2xl">
      {/* User Info */}
      <div className="flex flex-row items-center gap-5 w-[226px] h-[56px]">
        <div
          className="w-14 h-14 rounded-2xl"
          style={{
            background: "url('/bg_lines.png'), rgba(193,207,22,0.48)",
            backgroundSize: "cover",
          }}
        />
        <div className="flex flex-col gap-2">
          <span className="font-medium text-[14px] text-[#0C0D0D]">{user?.name || "-"}</span>
          <span className="font-light text-[12px] text-[#495D69]">{user?.email || "-"}</span>
        </div>
      </div>
      {/* Divider & Menu */}
      <div className="flex flex-col items-start w-[226px] border-y border-[#DBDBDB] py-5 gap-0">
        <DropdownItem
          icon={<User className="w-4 h-4 text-[#495D69]" />}
          label="My Account"
          onClick={() => router.push("/profile")}
        />
        <DropdownItem
          icon={<ShoppingCart className="w-4 h-4 text-[#495D69]" />}
          label="Orders"
          onClick={() => router.push("/orders")}
        />
        <DropdownItem icon={<HelpCircle className="w-4 h-4 text-[#495D69]" />} label="Help" />
        <DropdownItem icon={<Settings className="w-4 h-4 text-[#495D69]" />} label="Settings" />
      </div>
      {/* Logout */}
      <div className="flex flex-row items-center gap-2 w-[226px] mt-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-2" onClick={handleLogout}>
        <LogOut className="w-4 h-4 text-[#495D69]" />
        <span className="font-normal text-[14px] text-[#495D69]">Logout</span>
      </div>
    </div>
  );
}

function DropdownItem({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="flex flex-row items-center gap-4 w-full py-4 px-2 cursor-pointer hover:bg-gray-100 rounded"
      onClick={onClick}
    >
      {icon}
      <span className="font-normal text-[14px] text-[#1C2834]">{label}</span>
    </div>
  );
}