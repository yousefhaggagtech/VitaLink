import { SensorData } from '@/domain/entities/SensorData';

export const generateSimulatedData = (): SensorData => {
  return {
    heartRate: 72 + Math.sin(Date.now() / 5000) * 15 + Math.random() * 2,
    spo2: 98 + Math.cos(Date.now() / 7000) * 2 + Math.random() * 0.5,
    temperature: 37 + Math.sin(Date.now() / 8000) * 0.5 + Math.random() * 0.1,
    accX: Math.sin(Date.now() / 3000) * 2 + Math.random() * 0.5,
    accY: Math.cos(Date.now() / 3500) * 2 + Math.random() * 0.5,
    accZ: 10 + Math.sin(Date.now() / 4000) * 0.5 + Math.random() * 0.5,
    sweat: 50 + Math.sin(Date.now() / 6000) * 30 + Math.random() * 5,
  };
};
