"use client";

import Link from "next/link";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  HeartPulse,
  Home,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Sun,
  UserPlus,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ElementType } from "react";

import AIInsightPanel from "@/app/dashboard/components/analysis/AIInsightPanel";
import AnimatedBackground from "@/app/dashboard/components/animations/AnimatedBackground";
import ChartsGrid from "@/app/dashboard/components/Charts/ChartsGrid";
import Footer from "@/app/dashboard/components/layout/Footer";
import GlobalStyles from "@/app/dashboard/components/layout/GlobalStyles";
import { DashboardHeader } from "@/app/dashboard/components/layout/Dashboardheader";
import MetricsGrid from "@/app/dashboard/components/metrics/MetricsGrid";
import { THEMES } from "@/domain/constants";
import { HistoricalData, SensorData } from "@/domain/entities/SensorData";
import { HealthStatus, Theme, ThemeKey } from "@/domain/types/types";

const HISTORY_LENGTH = 28;

const INITIAL_SENSOR_DATA: SensorData = {
  heartRate: 78,
  spo2: 98.4,
  temperature: 36.9,
  accX: 0.8,
  accY: -0.4,
  accZ: 9.9,
  sweat: 58,
};

const DEMO_INSIGHTS = [
  "Recovery markers are stable and the athlete is ready for a high-quality training block.",
  "Heart rate and oxygen saturation remain inside the optimal range during the current effort.",
  "Movement load is balanced with no unusual acceleration spikes detected in the latest window.",
  "Hydration and recovery should be checked again after the next intensive interval.",
].join(" ");

const buildReading = (tick: number): SensorData => ({
  heartRate: 78 + Math.sin(tick / 2.2) * 5 + Math.sin(tick / 5) * 2,
  spo2: 98.2 + Math.cos(tick / 4) * 0.5,
  temperature: 36.9 + Math.sin(tick / 7) * 0.18,
  accX: Math.sin(tick / 2.6) * 1.8,
  accY: Math.cos(tick / 3.1) * 1.5,
  accZ: 9.8 + Math.sin(tick / 3.8) * 0.35,
  sweat: 56 + Math.sin(tick / 4.5) * 10,
});

const buildInitialHistory = (): HistoricalData[] =>
  Array.from({ length: HISTORY_LENGTH }, (_, index) => ({
    ...buildReading(index),
    time: `-${(HISTORY_LENGTH - index) * 3}s`,
  }));

const getMetricStatus = (
  value: number,
  min: number,
  max: number
): HealthStatus => (value >= min && value <= max ? "optimal" : "warning");

const formatTimestamp = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

interface OverviewCardProps {
  icon: ElementType;
  label: string;
  value: string;
  detail: string;
  theme: Theme;
}

function OverviewCard({
  icon: Icon,
  label,
  value,
  detail,
  theme,
}: OverviewCardProps) {
  return (
    <article
      className="relative overflow-hidden rounded-2xl border p-5"
      style={{
        backgroundColor: theme.background.secondary,
        borderColor: theme.border.medium,
        boxShadow: theme.shadow.soft,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.accent.primary}, transparent)`,
        }}
      />
      <div className="mb-5 flex items-center justify-between">
        <span
          className="text-[11px] font-bold uppercase tracking-[0.14em]"
          style={{ color: theme.text.tertiary }}
        >
          {label}
        </span>
        <span
          className="grid h-9 w-9 place-items-center rounded-xl"
          style={{
            color: theme.accent.primary,
            backgroundColor: theme.accent.light,
          }}
        >
          <Icon size={18} />
        </span>
      </div>
      <p
        className="text-3xl font-extrabold tracking-tight"
        style={{ color: theme.text.primary }}
      >
        {value}
      </p>
      <p className="mt-2 text-xs" style={{ color: theme.text.secondary }}>
        {detail}
      </p>
    </article>
  );
}

interface SimulationSidebarProps {
  theme: Theme;
  isLightMode: boolean;
  onReset: () => void;
  onThemeToggle: () => void;
}

function SimulationSidebar({
  theme,
  isLightMode,
  onReset,
  onThemeToggle,
}: SimulationSidebarProps) {
  const links = [
    { href: "#overview", label: "Overview", icon: Sparkles },
    { href: "#metrics", label: "Biometrics", icon: HeartPulse },
    { href: "#trends", label: "Live trends", icon: BarChart3 },
  ];

  return (
    <aside
      className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r p-6 lg:flex"
      style={{
        backgroundColor: theme.background.primary,
        borderColor: theme.border.medium,
        color: theme.text.primary,
      }}
    >
      <Link href="/" className="mb-8 px-2 text-2xl font-black tracking-tight">
        VITA<span style={{ color: theme.accent.primary }}>LINK</span>
      </Link>

      <div
        className="mb-8 rounded-2xl border p-4"
        style={{
          backgroundColor: theme.background.secondary,
          borderColor: theme.border.medium,
        }}
      >
        <div className="mb-2 flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: theme.status.success,
              boxShadow: `0 0 8px ${theme.status.success}`,
            }}
          />
          <span className="text-xs font-bold uppercase tracking-wider">
            Public preview
          </span>
        </div>
        <p className="text-xs leading-5" style={{ color: theme.text.tertiary }}>
          All readings are generated locally. No account, API, or wearable is
          connected.
        </p>
      </div>

      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
            style={{ color: theme.text.secondary }}
          >
            <Icon size={18} style={{ color: theme.accent.primary }} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <button
          type="button"
          onClick={onThemeToggle}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
          style={{ color: theme.text.secondary }}
        >
          {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
          {isLightMode ? "Dark mode" : "Light mode"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
          style={{ color: theme.text.secondary }}
        >
          <RefreshCw size={18} />
          Reset simulation
        </button>
        <Link
          href="/signup"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
          style={{
            color: theme.background.primary,
            backgroundColor: theme.accent.primary,
          }}
        >
          <UserPlus size={17} />
          Create an account
        </Link>
      </div>
    </aside>
  );
}

export default function SimulationPage() {
  const [themeKey, setThemeKey] = useState<ThemeKey>("limeDark");
  const [sensorData, setSensorData] =
    useState<SensorData>(INITIAL_SENSOR_DATA);
  const [historicalData, setHistoricalData] =
    useState<HistoricalData[]>(buildInitialHistory);
  const [timestamp, setTimestamp] = useState("Demo ready");
  const [counter, setCounter] = useState(10);

  const theme = THEMES[themeKey];

  const statuses = useMemo(() => {
    const heartRateStatus = getMetricStatus(sensorData.heartRate, 60, 100);
    const spo2Status = getMetricStatus(sensorData.spo2, 95, 100);
    const tempStatus = getMetricStatus(sensorData.temperature, 36.5, 37.5);
    const gsrValue = sensorData.sweat * 13;
    const gsrStatus: HealthStatus = gsrValue <= 1300 ? "optimal" : "warning";
    const values = [
      heartRateStatus,
      spo2Status,
      tempStatus,
      gsrStatus,
    ];
    const overallStatus: HealthStatus = values.includes("warning")
      ? "warning"
      : "optimal";

    return {
      heartRateStatus,
      spo2Status,
      tempStatus,
      gsrStatus,
      gsrValue,
      overallStatus,
    };
  }, [sensorData]);

  const resetSimulation = useCallback(() => {
    setSensorData(INITIAL_SENSOR_DATA);
    setHistoricalData(buildInitialHistory());
    setTimestamp("Demo reset");
    setCounter(10);
  }, []);

  useEffect(() => {
    let tick = HISTORY_LENGTH;

    const telemetryTimer = window.setInterval(() => {
      tick += 1;
      const nextReading = buildReading(tick);
      const nextTimestamp = formatTimestamp();

      setSensorData(nextReading);
      setTimestamp(nextTimestamp);
      setHistoricalData((current) => [
        ...current.slice(-(HISTORY_LENGTH - 1)),
        { ...nextReading, time: nextTimestamp },
      ]);
    }, 2500);

    const countdownTimer = window.setInterval(() => {
      setCounter((current) => (current <= 1 ? 10 : current - 1));
    }, 1000);

    return () => {
      window.clearInterval(telemetryTimer);
      window.clearInterval(countdownTimer);
    };
  }, []);

  return (
    <div
      className="relative min-h-screen lg:pl-64"
      style={{ backgroundColor: theme.background.primary }}
    >
      <GlobalStyles theme={theme} />
      <AnimatedBackground theme={theme} />
      <SimulationSidebar
        theme={theme}
        isLightMode={themeKey === "blueLight"}
        onReset={resetSimulation}
        onThemeToggle={() =>
          setThemeKey((current) =>
            current === "limeDark" ? "blueLight" : "limeDark"
          )
        }
      />

      <div className="relative z-10">
        <div
          className="flex items-center justify-between border-b px-4 py-3 lg:hidden"
          style={{
            backgroundColor: theme.background.secondary,
            borderColor: theme.border.medium,
          }}
        >
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-bold"
            style={{ color: theme.text.primary }}
          >
            <Home size={17} />
            VITALINK
          </Link>
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
            style={{
              color: theme.accent.primary,
              backgroundColor: theme.accent.light,
            }}
          >
            Simulation
          </span>
        </div>

        <DashboardHeader
          username="Demo Athlete"
          overallStatus={statuses.overallStatus}
          isConnected={false}
          dataMode="simulated"
          timestamp={timestamp}
          theme={theme}
          currentTheme={themeKey}
          onThemeToggle={() =>
            setThemeKey((current) =>
              current === "limeDark" ? "blueLight" : "limeDark"
            )
          }
          onDataModeChange={() => undefined}
          onClearData={resetSimulation}
          isDemo
        />

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8">
          <section id="overview" className="mb-12 scroll-mt-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-[0.18em]"
                  style={{ color: theme.accent.primary }}
                >
                  Demo workspace
                </p>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: theme.text.primary }}
                >
                  Athlete wellness snapshot
                </h2>
              </div>
              <div
                className="flex items-center gap-2 rounded-full border px-3 py-2 text-xs"
                style={{
                  color: theme.text.secondary,
                  borderColor: theme.border.medium,
                  backgroundColor: theme.background.secondary,
                }}
              >
                <WifiOff size={14} style={{ color: theme.accent.primary }} />
                Local simulation — no network feed
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <OverviewCard
                icon={ShieldCheck}
                label="Wellness score"
                value="88 / 100"
                detail="Strong recovery profile, up 3 points today"
                theme={theme}
              />
              <OverviewCard
                icon={BrainCircuit}
                label="AI metrics"
                value="12 / 12"
                detail="All demo signals analyzed and available"
                theme={theme}
              />
              <OverviewCard
                icon={Sparkles}
                label="Key insights"
                value="4 active"
                detail="Readiness, load, movement, and recovery"
                theme={theme}
              />
              <OverviewCard
                icon={Activity}
                label="Training load"
                value="Optimal"
                detail="Current workload is inside the target zone"
                theme={theme}
              />
            </div>
          </section>

          <section id="metrics" className="scroll-mt-6">
            <MetricsGrid
              theme={theme}
              sensorData={sensorData}
              statuses={statuses}
            />
          </section>

          <AIInsightPanel
            counter={counter}
            geminiResponse={DEMO_INSIGHTS}
            isAnalyzing={false}
            dataPointsCollected={10}
            theme={theme}
          />

          <section id="trends" className="scroll-mt-6">
            <ChartsGrid theme={theme} historicalData={historicalData} />
          </section>
        </main>

        <Footer theme={theme} />
      </div>
    </div>
  );
}
