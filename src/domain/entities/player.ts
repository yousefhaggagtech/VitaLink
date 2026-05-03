

export interface Player {
  id:         string;
  name:       string;
  initials:   string;
  position:   string;     // 'Midfielder' | 'Forward' | 'Defender' | 'Goalkeeper'
  jerseyNumber: number;
  imageUrl?:  string;
  age?:       number;
  weight?:    number;
  beltId?:    string | null;
  status:     'fit' | 'moderate' | 'critical';

  // Live vitals — updated every second from .NET SignalR
  heartRate:  number;
  spO2:       number;
  temperature:number;
  hrHistory:  number[];   // last 20 readings for sparkline

  // perfromance metrics 
  fatigue:    number;     
  stress:     number;     
}