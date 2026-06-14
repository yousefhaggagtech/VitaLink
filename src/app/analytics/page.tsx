'use client';
export default function AnalyticsPage() {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <iframe
        src="https://athletrix-dashboard-xwxijwhx4fbnzvjak2wyuz.streamlit.app/?embed=true"
        allow="storage-access; clipboard-write"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        title="Vitalink Analytics Pro Dashboard"
      />
    </div>
  );
}
