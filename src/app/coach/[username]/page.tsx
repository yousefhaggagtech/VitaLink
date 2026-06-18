'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/dashboard/Navbar';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { PlayerCard } from '@/components/dashboard/PlayerCard';
import { AddPlayerModal } from '@/components/dashboard/AddPlayerModal';
import { useCoachPlayers } from '@/application/hooks/useCoachPlayers';

export const dynamic = 'force-dynamic';

export default function CoachDashboardPage() {
  const params = useParams();
  const coachName = decodeURIComponent((params?.username as string) ?? 'Coach');

  const { players, loading, error, refetch, deletePlayer } = useCoachPlayers(coachName);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const criticalPlayers = players.filter(p => p.status === 'critical');

  useEffect(() => {
    if (!notification) return;

    const timeoutId = window.setTimeout(() => setNotification(null), 3500);
    return () => window.clearTimeout(timeoutId);
  }, [notification]);

  const handleDeletePlayer = async (beltId: string) => {
    try {
      await deletePlayer(beltId);
      setNotification({
        type: 'success',
        message: 'Athlete removed successfully.',
      });
    } catch (deleteError) {
      console.error('[CoachDashboardPage] Failed to delete player', deleteError);
      setNotification({
        type: 'error',
        message: 'Unable to remove this athlete. Please try again.',
      });
      throw deleteError;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0; padding: 0;
          background: #050816;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(182,255,46,0.22); border-radius: 2px; }
        select option { background: #07111F; color: #F8FAFC; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.45); }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes vl-toast-in {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vl-coach-dashboard {
          --vl-bg-0: #050816;
          --vl-bg-1: #07111F;
          --vl-bg-2: #0A1324;
          --vl-panel: rgba(11,18,32,0.72);
          --vl-panel-strong: rgba(13,22,38,0.84);
          --vl-panel-soft: rgba(255,255,255,0.045);
          --vl-border: rgba(255,255,255,0.08);
          --vl-border-strong: rgba(255,255,255,0.14);
          --vl-highlight: rgba(255,255,255,0.14);
          --vl-text: #F8FAFC;
          --vl-text-soft: rgba(255,255,255,0.70);
          --vl-muted: rgba(255,255,255,0.45);
          --vl-muted-deep: rgba(255,255,255,0.28);
          --vl-lime: #B6FF2E;
          --vl-green: #4ADE80;
          --vl-cyan: #38BDF8;
          --vl-violet: #8B5CF6;
          --vl-shadow-card: 0 24px 70px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.025);
          --vl-shadow-hover: 0 30px 84px rgba(0,0,0,0.50), inset 0 1px 0 rgba(255,255,255,0.11);
          min-height: 100vh;
          position: relative;
          isolation: isolate;
          overflow-x: hidden;
          background:
            linear-gradient(135deg, var(--vl-bg-0) 0%, var(--vl-bg-1) 48%, var(--vl-bg-2) 100%);
          color: var(--vl-text);
          font-family: 'DM Sans', sans-serif;
        }
        .vl-coach-dashboard::before,
        .vl-coach-dashboard::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .vl-coach-dashboard::before {
          background:
            linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
          background-size: 100% 7px, 92px 100%;
          opacity: 0.15;
          mask-image: linear-gradient(to bottom, transparent 0%, #000 14%, #000 78%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 14%, #000 78%, transparent 100%);
        }
        .vl-coach-dashboard::after {
          background:
            radial-gradient(circle at 50% -10%, transparent 0 40%, rgba(0,0,0,0.18) 72%, rgba(0,0,0,0.48) 100%),
            linear-gradient(90deg, rgba(0,0,0,0.28), transparent 20%, transparent 76%, rgba(0,0,0,0.34));
        }
        .vl-coach-dashboard > * {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <div className="vl-coach-dashboard">

        <Navbar coachName={coachName} latency={32} />

        <main style={{ padding: '22px 24px 48px', maxWidth: '1200px', margin: '0 auto' }}>

          {criticalPlayers.length > 0 && (
            <AlertBanner
              players={criticalPlayers}
              onSubstitute={p => console.log('Substitute:', p.name)}
            />
          )}

          <StatsRow players={players} />

          {/* Loading State */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'rgba(255,255,255,0.45)',
            }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: `2px solid rgba(255,255,255,0.08)`,
                borderTop: `2px solid #CCFF00`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ marginTop: '12px', fontSize: '13px' }}>Loading players...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={{
              background: 'linear-gradient(145deg, rgba(255,90,95,0.10), rgba(255,255,255,0.015) 48%), rgba(11,18,32,0.78)',
              border: `0.5px solid rgba(255,90,95,0.22)`,
              borderRadius: '24px',
              padding: '16px',
              marginBottom: '18px',
              color: '#FF5A5F',
              fontSize: '13px',
              backdropFilter: 'blur(18px) saturate(125%)',
              boxShadow: '0 24px 70px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(255,255,255,0.025)',
            }}>
              <p style={{ margin: '0 0 8px' }}>Failed to load players</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.8 }}>{error}</p>
            </div>
          )}

          {/* Content Section Header */}
          {!loading && (
            <div style={{
              display: 'flex', alignItems: 'flex-end',
              justifyContent: 'space-between', marginBottom: '18px',
            }}>
              <div>
                <h2 style={{
                  margin: 0, fontSize: '24px', fontWeight: 700,
                  color: '#F8FAFC',
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: '.04em',
                  lineHeight: 1,
                }}>
                  Squad Overview
                </h2>
                <p style={{ margin: '5px 0 0', fontSize: '11px', color: 'rgba(255,255,255,0.45)', letterSpacing: '.04em' }}>
                  Real-time biometric monitoring — {players.length} players active
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'linear-gradient(180deg, rgba(204,255,0,0.12), rgba(204,255,0,0.04)), rgba(11,18,32,0.68)',
                  border: '0.5px solid rgba(204,255,0,0.22)',
                  color: '#CCFF00',
                  fontSize: '11px', fontWeight: 700,
                  padding: '9px 16px', borderRadius: '13px',
                  cursor: 'pointer', letterSpacing: '.05em',
                  transition: 'background .18s, border-color .18s, box-shadow .18s, transform .18s',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 10px 28px rgba(0,0,0,0.18), 0 0 12px rgba(204,255,0,0.05)',
                  backdropFilter: 'blur(18px) saturate(128%)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(180deg, rgba(204,255,0,0.15), rgba(204,255,0,0.06)), rgba(11,18,32,0.78)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(204,255,0,0.32)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.11), 0 14px 32px rgba(0,0,0,0.24), 0 0 18px rgba(204,255,0,0.10)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(180deg, rgba(204,255,0,0.12), rgba(204,255,0,0.04)), rgba(11,18,32,0.68)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(204,255,0,0.22)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.09), 0 10px 28px rgba(0,0,0,0.18), 0 0 12px rgba(204,255,0,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                }}
              >
                <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span>
                Add Player
              </button>
            </div>
          )}

          {/* Players Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 w-full">
              {players.length === 0 ? (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'rgba(255,255,255,0.45)', padding: '40px 20px' }}>
                  No players yet. Click "Add Player" to get started.
                </p>
              ) : (
                players.map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onDelete={handleDeletePlayer}
                  />
                ))
              )}
            </div>
          )}

        </main>
      </div>

      {showModal && (
        <AddPlayerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            refetch();
            setShowModal(false);
          }}
        />
      )}

      {notification && (
        <div
          role={notification.type === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            zIndex: 1000,
            maxWidth: 'min(360px, calc(100vw - 40px))',
            padding: '12px 16px',
            color: '#F8FAFC',
            background: notification.type === 'success'
              ? 'rgba(22,101,52,0.96)'
              : 'rgba(153,27,27,0.96)',
            border: `1px solid ${notification.type === 'success'
              ? 'rgba(74,222,128,0.42)'
              : 'rgba(248,113,113,0.42)'}`,
            borderRadius: '12px',
            boxShadow: '0 18px 50px rgba(0,0,0,0.42)',
            backdropFilter: 'blur(16px)',
            fontSize: '13px',
            fontWeight: 600,
            animation: 'vl-toast-in 180ms ease-out',
          }}
        >
          {notification.message}
        </div>
      )}
    </>
  );
}
