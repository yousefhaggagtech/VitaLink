"use client";
 
import React from "react";
import {
  HelpCircle,
  PlusCircle,
  LogOut,
  UserPlus,
  Globe,
  Zap,
  Radio,
  BarChart2,
  Sun,
  Trash2,
} from "lucide-react";
import SidebarItem from "@/app/dashboard/components/Sidebar/sidebarItem";
import { DataMode, HealthStatus } from "@/domain/types/types";
 
// ── StatusToggle sub-component ────────────────────────────────────────
interface StatusToggleProps {
  label: string;
  isActive: boolean;
  icon: React.ElementType;
  activeColor: string;
  onClick?: () => void;
}
 
const StatusToggle: React.FC<StatusToggleProps> = ({
  label,
  isActive,
  icon: Icon,
  activeColor,
  onClick,
}) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors rounded-lg group w-full text-left"
  >
    <div className="flex items-center gap-3">
      <Icon
        size={16}
        style={{
          color: isActive ? activeColor : "#6b7280",
          filter: isActive ? `drop-shadow(0 0 5px ${activeColor})` : "none",
        }}
        className="transition-all duration-300"
      />
      <span
        className={`text-xs font-medium transition-colors ${
          isActive ? "text-zinc-200" : "text-zinc-600"
        } ${isActive ? "dark:text-zinc-200" : "dark:text-zinc-500"}`}
      >
        {label}
      </span>
    </div>
 
    {/* Toggle switch */}
    <div
      className="relative w-8 h-4 rounded-full border transition-all duration-300"
      style={{
        backgroundColor: isActive ? `${activeColor}20` : "#e5e7eb",
        borderColor: isActive ? activeColor : "#d1d5db",
      }}
    >
      <div
        className="absolute top-[2px] w-[10px] h-[10px] rounded-full transition-all duration-300"
        style={{
          backgroundColor: isActive ? activeColor : "#9ca3af",
          left: isActive ? "calc(100% - 12px)" : "2px",
          boxShadow: isActive ? `0 0 8px ${activeColor}` : "none",
        }}
      />
    </div>
  </button>
);
 
// ── Sidebar props — aligned with Version B's state ────────────────────
interface SidebarProps {
  isConnected?: boolean;
  dataMode?: DataMode;
  onDataModeChange?: (mode: DataMode) => void;
  onClearData?: () => void;
  systemHealth?: HealthStatus;
  /** 
   * isLightMode and onToggleTheme are intentionally omitted here.
   * Theme is controlled via the header controls bar (DashboardHeader),
   * which calls onThemeToggle from page.tsx. The sidebar's Light Mode toggle
   * below calls onToggleTheme which page.tsx passes down if needed,
   * or you can wire it similarly. For now it's optional.
   */
  isLightMode?: boolean;
  onToggleTheme?: () => void;
}
 
const Sidebar: React.FC<SidebarProps> = ({
  isConnected = false,
  dataMode = "simulated",
  onDataModeChange,
  onClearData,
  systemHealth = "optimal",
  isLightMode = false,
  onToggleTheme,
}) => {
  const healthColor =
    systemHealth === "optimal"
      ? "#22c55e"
      : systemHealth === "warning"
      ? "#f59e0b"
      : "#ef4444";
 
  const isLive = dataMode === "live";
 
  return (
    <aside className="flex flex-col w-64 h-screen bg-white border-r border-gray-200 p-6 fixed top-0 left-0 z-50 text-black dark:bg-black dark:border-zinc-800 dark:text-white">
      
      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div className="mb-10 px-2">
        <div className="flex items-center gap-2 text-white">
          <span className="text-2xl font-bold tracking-tight">VITALINK</span>
        </div>
      </div>
 
      {/* ── System Status ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="px-4 mb-3 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
          System Status
        </div>
        <div className="flex flex-col gap-1">
          {/* Connection toggle — switches between live and simulated */}
          <StatusToggle
            label="Connection"
            isActive={isConnected}
            icon={Globe}
            activeColor="#22c55e"
            onClick={() => {
              const newMode: DataMode = isConnected ? "simulated" : "live";
              onDataModeChange?.(newMode);
            }}
          />
 
          {/* System health indicator — read-only, reflects overallHealthStatus */}
          <StatusToggle
            label="System Health"
            isActive={systemHealth !== "danger"}
            icon={Zap}
            activeColor={healthColor}
          />
 
          {/* Live Stream toggle */}
          <StatusToggle
            label="Live Stream"
            isActive={isLive}
            icon={Radio}
            activeColor="#22c55e"
            onClick={() => onDataModeChange?.("live")}
          />
 
          {/* Simulation toggle */}
          <StatusToggle
            label="Simulation"
            isActive={!isLive}
            icon={BarChart2}
            activeColor="#22c55e"
            onClick={() => onDataModeChange?.("simulated")}
          />
 
          {/* Clear Data */}
          <button
            onClick={() => onClearData?.()}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-xs text-zinc-600 dark:text-zinc-200 w-full text-left"
          >
            <Trash2 size={16} className="text-zinc-500" />
            Clear Data
          </button>
 
          {/* Light Mode toggle — optional, wired to onToggleTheme if provided */}
          <StatusToggle
            label="Light Mode"
            isActive={isLightMode}
            icon={Sun}
            activeColor="#f59e0b"
            onClick={onToggleTheme}
          />
        </div>
      </div>
 
      {/* ── Help & Support ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-end gap-2 mb-5 pt-6 border-t border-gray-200 dark:border-zinc-800/50">
        <div className="px-4 mb-2 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
          Help & Support
        </div>
        <SidebarItem icon={HelpCircle} label="Help center" href="/help" />
        <SidebarItem icon={PlusCircle} label="Add New" href="/signup" isActive={false} />
      </div>
 
      {/* ── Bottom: Logout / Account ──────────────────────────────────── */}
      <div className="mt-auto pt-6 border-t border-zinc-800/50 flex flex-col gap-1">
        <SidebarItem icon={LogOut} label="Logout" href="/" />
        <SidebarItem icon={UserPlus} label="New Account" href="/signup" />
      </div>
    </aside>
  );
};
 
export default Sidebar;