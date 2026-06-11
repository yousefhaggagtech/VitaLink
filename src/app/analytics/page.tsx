'use client';
import { useAuth } from '@/app/features/auth/hooks/useAuth';

export default function AnalyticsPage() {
  const { logout } = useAuth();

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#0b1016' }}>
      <iframe
        src="https://athletrix-dashboard-xaciftja6fq8jew87vhzvk.streamlit.app?embed=true"
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allow="autoplay; encrypted-media"
        title="Athletrix Performance Hub"
      />
    </div>
  );
}