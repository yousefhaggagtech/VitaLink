'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { colors } from '@/styles/tokens/colors';
import { Player } from '@/domain/entities/player';
import { Navbar } from '@/components/dashboard/Navbar';
import { AlertBanner } from '@/components/dashboard/AlertBanner';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { PlayerCard } from '@/components/dashboard/PlayerCard';
import { AddPlayerModal } from '@/components/dashboard/AddPlayerModal';

const MOCK_PLAYERS: Player[] = [
  {
    id: 'ath-1', name: 'Ahmed Hassan', initials: 'AH', position: 'Midfielder', jerseyNumber: 10,
    age: 24, weight: 72, beltId: 'band-123', status: 'fit',
    heartRate: 142, spO2: 98, temperature: 37.1,
    hrHistory: [128, 135, 140, 138, 142, 139, 144, 142, 141, 143, 142, 145, 142, 140, 142, 141, 143, 142, 141, 142],
    fatigue: 32, stress: 18, imageUrl: '/salah.jpg',
  },
  {
    id: 'ath-2', name: 'Omar Khaled', initials: 'OK', position: 'Forward', jerseyNumber: 9,
    age: 26, weight: 78, beltId: 'band-456', status: 'moderate',
    heartRate: 168, spO2: 50, temperature: 37.6,
    hrHistory: [145, 150, 155, 158, 162, 165, 162, 166, 168, 167, 168, 170, 168, 165, 168, 167, 169, 168, 167, 168],
    fatigue: 61, stress: 45, imageUrl: '/messi.jpg',
  },
  {
    id: 'ath-3', name: 'Mohamed Salah', initials: 'MS', position: 'Forward', jerseyNumber: 11,
    age: 28, weight: 71, beltId: 'band-111', status: 'critical',
    heartRate: 191, spO2: 30, temperature: 38.2,
    hrHistory: [160, 168, 172, 178, 182, 185, 186, 188, 190, 189, 191, 192, 191, 190, 191, 192, 193, 191, 190, 191],
    fatigue: 89, stress: 72,
  },
  {
    id: 'ath-4', name: 'Karim Nasser', initials: 'KN', position: 'Defender', jerseyNumber: 5,
    age: 25, weight: 80, beltId: 'band-222', status: 'fit',
    heartRate: 138, spO2: 99, temperature: 37.0,
    hrHistory: [120, 125, 130, 132, 135, 138, 136, 138, 137, 139, 138, 140, 138, 136, 138, 137, 139, 138, 137, 138],
    fatigue: 28, stress: 12,
  },
  {
    id: 'ath-5', name: 'Youssef Ali', initials: 'YA', position: 'Defender', jerseyNumber: 3,
    age: 23, weight: 76, beltId: null, status: 'fit',
    heartRate: 155, spO2: 97, temperature: 37.3,
    hrHistory: [140, 144, 148, 150, 153, 155, 154, 156, 155, 157, 155, 158, 155, 153, 155, 154, 156, 155, 154, 155],
    fatigue: 48, stress: 33,
  },
  {
    id: 'ath-6', name: 'Tamer Samir', initials: 'TS', position: 'Goalkeeper', jerseyNumber: 1,
    age: 30, weight: 85, beltId: 'band-333', status: 'fit',
    heartRate: 110, spO2: 99, temperature: 36.8,
    hrHistory: [98, 102, 106, 108, 110, 109, 111, 110, 109, 111, 110, 112, 110, 108, 110, 109, 111, 110, 109, 110],
    fatigue: 15, stress: 8,
  },
];

export default function CoachDashboardPage() {
  
  const params = useParams();
  const coachName = decodeURIComponent((params?.username as string) ?? 'Coach');

  const [players, setPlayers] = useState<Player[]>(MOCK_PLAYERS);
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

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5 w-full">
            {players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                onDelete={() => setPlayers(prev => prev.filter(p => p.id !== player.id))}
              />
            ))}
          </div>

        </main>
      </div>

      {showModal && (
        <AddPlayerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => console.log('Player added — TODO: refetch')}
        />
      )}
    </>
  );
}