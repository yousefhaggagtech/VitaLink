// Theme and UI Types
export type ThemeKey = 'limeDark' | 'blueLight';

export interface Theme {
  name: string;
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
  };
  accent: {
    primary: string;
    light: string;
    medium: string;
    dark: string;
    glow: string;
  };
  border: {
    light: string;
    medium: string;
    strong: string;
  };
  status: {
    success: string;
    warning: string;
    danger: string;
    info: string;
  };
  shadow: {
    soft: string;
    strong: string;
  };
}

// Data Mode
export type DataMode = 'live' | 'simulated';

// Health Status
export type HealthStatus = 'optimal' | 'warning' | 'danger';

// JWT Payload
export type JwtPayload = {
  ["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]?: string;
  sub?: string;
  email?: string;
  [key: string]: unknown;
};

// Component Props
export type IconLabel = 'Heart Rate' | 'Blood Oxygen' | 'Body Temperature' | 'GSR Level';

export interface MetricCardProps {
  label: IconLabel;
  value: number;
  unit: string;
  status: HealthStatus;
  theme: Theme;
  min: number;
  max: number;
}

export interface StatusIndicatorProps {
  label: string;
  status: boolean;
  details?: string;
  theme: Theme;
}

export interface DataStreamSelectorProps {
  mode: DataMode;
  onChange: (mode: DataMode) => void;
  theme: Theme;
}

export interface ChartWrapperProps {
  title: string;
  children: React.ReactNode;
  theme: Theme;
}

export interface CircularCountdownProps {
  counter: number;
  theme: Theme;
}

export interface HealthStatusChartProps {
  historicalData: import('../entities/SensorData').HistoricalData[];
  theme: Theme;
}

export interface AnimatedBackgroundProps {
  theme: Theme;
}

export interface GlobalStylesProps {
  theme: Theme;
}
