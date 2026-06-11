'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { colors } from '@/styles/tokens/colors';
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

  const { players, loading, error, refetch } = useCoachPlayers();
  const [showModal, setShowModal] = useState(false);
  const criticalPlayers = players.filter(p => p.status === 'critical');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0; padding: 0;
          background: ${colors.bgPrimary};
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        select option { background: #0F1218; color: ${colors.text}; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.45); }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: colors.bgPrimary,
        color: colors.text,
        fontFamily: "'DM Sans', sans-serif",
      }}>

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
              color: colors.textMuted,
            }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: `2px solid ${colors.border}`,
                borderTop: `2px solid ${colors.lime}`,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ marginTop: '12px', fontSize: '13px' }}>Loading players...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={{
              background: colors.criticalBg,
              border: `1px solid ${colors.criticalBorder}`,
              borderRadius: '9px',
              padding: '16px',
              marginBottom: '18px',
              color: colors.critical,
              fontSize: '13px',
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
                  margin: 0, fontSize: '18px', fontWeight: 600,
                  color: colors.text,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  letterSpacing: '.03em',
                }}>
                  Squad Overview
                </h2>
                <p style={{ margin: '3px 0 0', fontSize: '11px', color: colors.textMuted }}>
                  Real-time biometric monitoring — {players.length} players active
                </p>
              </div>

              <button
                onClick={() => setShowModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  background: 'rgba(204,255,0,0.08)',
                  border: '0.5px solid rgba(204,255,0,0.25)',
                  color: '#CCFF00',
                  fontSize: '11px', fontWeight: 700,
                  padding: '8px 16px', borderRadius: '9px',
                  cursor: 'pointer', letterSpacing: '.05em',
                  transition: 'background .18s, border-color .18s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(204,255,0,0.14)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(204,255,0,0.40)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(204,255,0,0.08)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(204,255,0,0.25)';
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
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: colors.textMuted, padding: '40px 20px' }}>
                  No players yet. Click "Add Player" to get started.
                </p>
              ) : (
                players.map(player => (
                  <PlayerCard
                    key={player.id}
                    player={player}
                    onDelete={() => refetch()}
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
    </>
  );
}
