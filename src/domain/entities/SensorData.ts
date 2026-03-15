// Sensor Data Entity
export interface SensorData {
  heartRate: number;
  spo2: number;
  temperature: number;
  accX: number;
  accY: number;
  accZ: number;
  sweat: number;
}

// Historical Data Entity (extends SensorData with time)
export interface HistoricalData extends SensorData {
  time: string;
}

// Analysis Data Entity (SensorData with ISO timestamp)
export type AnalysisData = SensorData & { time: string };
