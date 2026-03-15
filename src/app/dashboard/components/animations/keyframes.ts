export const keyframes = `
@keyframes smooth-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes pulse-ring {
  0% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(204, 255, 0, 0); }
  100% { box-shadow: 0 0 0 0 rgba(204, 255, 0, 0); }
}

@keyframes slide-in-fade {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes bounce-in {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  50% { opacity: 1; transform: scale(1.02); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes gradient-shift-dark {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes gradient-shift-light {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
}
`;
