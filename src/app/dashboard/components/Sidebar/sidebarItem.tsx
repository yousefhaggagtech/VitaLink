"use client";
// components/SideBar/sidebarItem.tsx
import Link from "next/link";
import { LucideIcon } from "lucide-react";
 
interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
}
 
const SidebarItem = ({
  icon: Icon,
  label,
  href = "#",
  isActive = false,
  onClick,
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ease-in-out
        ${
          isActive
            ? "bg-zinc-900 text-[#ccff00]"
            : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
        }
      `}
    >
      <Icon
        size={20}
        className={`transition-colors ${
          isActive ? "drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]" : ""
        }`}
      />
      <span className="font-medium text-sm tracking-wide">{label}</span>
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#ccff00] shadow-[0_0_10px_#ccff00]" />
      )}
    </Link>
  );
};
 
export default SidebarItem;