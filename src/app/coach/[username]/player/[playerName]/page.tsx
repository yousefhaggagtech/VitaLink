'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { usePlayerDetail } from '@/application/hooks/usePlayerDetail';
import { usePlayerProfileRealtime } from '@/application/hooks/usePlayerProfileRealtime';
import { toPlayerProfile } from '@/application/mappers/toPlayerProfile';

// ── Layout ────────────────────────────────────────────────────────────────────
import { PlayerProfileLayout } from '@/components/player-profile/layout/PlayerProfileLayout';

// ── Hero ──────────────────────────────────────────────────────────────────────
import { PlayerHero }         from '@/components/player-profile/hero/PlayerHero';

// ── Vitals ────────────────────────────────────────────────────────────────────
import { LiveVitalsSection }  from '@/components/player-profile/vitals/LiveVitalsSection';

// ── Load ──────────────────────────────────────────────────────────────────────
import { LoadMetricsSection } from '@/components/player-profile/load/LoadMetricSection';

// ── Wellness ──────────────────────────────────────────────────────────────────
import { WellnessScore }      from '@/components/player-profile/wellness/WellnessScore';

// ── AI ────────────────────────────────────────────────────────────────────────
import { GeminiInsightsPanel } from '@/components/player-profile/ai/GeminiInsightsPanel';
import { KeyInsights }         from '@/components/player-profile/ai/KeyInsights';

// ── Performance ───────────────────────────────────────────────────────────────
import { PerformanceScore }   from '@/components/player-profile/performance/PerformanceScore';
import { VSPreviousMatch }    from '@/components/player-profile/performance/VSPreviousMatch';

// ── Stats ─────────────────────────────────────────────────────────────────────
import { BottomStatsBar }     from '@/components/player-profile/stats/BottomStatsBar';

// ── UI Tokens ─────────────────────────────────────────────────────────────────
import { colors } from '@/styles/tokens/colors';

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PlayerProfilePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const coachName = decodeURIComponent((params?.username as string) ?? 'Coach');
  const beltId = searchParams.get('beltId') ?? '';

  // Fetch real player data using beltId from query param
  const { player, loading, error } = usePlayerDetail(beltId);

  // Map API response to UI shape
  const profileData = player ? toPlayerProfile(player) : null;

  // Enable realtime streaming when profile data is ready
  const realtime = usePlayerProfileRealtime({
    beltId,
    initialProfileData: profileData || {
      id: '',
      name: '',
      initials: '',
      position: '',
      jerseyNumber: 0,
      imageUrl: undefined,
      status: 'fit',
      age: 0,
      weight: 0,
      height: 0,
      foot: '',
      bloodType: '',
      beltId,
      lastSession: { date: '', duration: 0, opponent: '', id: '' },
      vitals: {
        heartRate: { value: 0, history: [] },
        spO2: { value: 0, history: [] },
        temperature: { value: 0, history: [] },
        stress: { value: 0, history: [] },
      },
      fatigue: 0,
      stressLoad: 0,
      wellnessScore: 0,
      performanceScore: 0,
      comparison: {
        fatigue: { value: 0, delta: 0 },
        load: { value: 0, delta: 0 },
        stress: { value: 0, delta: 0 },
      },
      aiInsight: {
        summary: '',
        highlight: '',
        subDetail: '',
        keyPoints: [],
        readiness: 'High',
      },
      sessionStats: {
        distance: 0,
        topSpeed: 0,
        sprints: 0,
        accelerations: 0,
        calories: 0,
      },
    },
  });

  // Use realtime data if available, otherwise use initially mapped data
  const p = realtime.profileData || profileData;

  // Render loading state
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
          html, body { background: #050816; }
        `}</style>

        <PlayerProfileLayout playerId={beltId} coachName={coachName}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            color: colors.textMuted,
          }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: `2px solid ${colors.border}`,
              borderTop: `2px solid #CCFF00`,
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </PlayerProfileLayout>
      </>
    );
  }

  // Render error state
  if (error || !profileData) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
          html, body { background: #050816; }
        `}</style>

        <PlayerProfileLayout playerId={beltId} coachName={coachName}>
          <div style={{
            background: colors.criticalBg,
            border: `1px solid ${colors.criticalBorder}`,
            borderRadius: '9px',
            padding: '24px',
            color: colors.critical,
            fontSize: '14px',
          }}>
            <p style={{ margin: '0 0 8px', fontWeight: 600 }}>Failed to load player profile</p>
            <p style={{ margin: 0, fontSize: '13px', opacity: 0.8 }}>
              {error || 'Unable to fetch player data. Please try again.'}
            </p>
          </div>
        </PlayerProfileLayout>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        html, body { background: #050816; }
      `}</style>

      <PlayerProfileLayout
        playerId={beltId}
        coachName={coachName}
      >
        {/* ── 1. Hero ─────────────────────────────────────────────────── */}
        <PlayerHero
          name={p.name}           initials={p.initials}
          position={p.position}   jerseyNumber={p.jerseyNumber}
          status={p.status}       imageUrl={p.imageUrl}
          age={p.age}             weight={p.weight}
          height={p.height}       foot={p.foot}
          bloodType={p.bloodType} beltId={p.beltId}
          lastSession={p.lastSession}
        />

        {/* ── 2. Live vitals ──────────────────────────────────────────── */}
        <LiveVitalsSection vitals={p.vitals} />

        {/* ── 3. Two-column: Load + right column ──────────────────────── */}
        <div className="vl-pg__mid">

          {/* Left: Load metrics */}
          <div className="vl-pg__left">
            <LoadMetricsSection fatigue={p.fatigue} stressLoad={p.stressLoad} />

            {/* Performance + VS previous */}
            <div className="vl-pg__perf-row">
              <PerformanceScore
                score={p.performanceScore}
                delta={6}
                deltaLabel="vs last 7 days"
              />
              <VSPreviousMatch
                fatigue={p.comparison.fatigue}
                load={p.comparison.load}
                stress={p.comparison.stress}
              />
            </div>
          </div>

          {/* Right: Wellness + AI + Key insights */}
          <div className="vl-pg__right">
            <WellnessScore score={p.wellnessScore} />

            <GeminiInsightsPanel
              summary={p.aiInsight.summary}
              highlight={p.aiInsight.highlight}
              subDetail={p.aiInsight.subDetail}
              readiness={p.aiInsight.readiness}
              isLive
            />

            <KeyInsights
              points={p.aiInsight.keyPoints}
            />
          </div>
        </div>

        {/* ── 4. Bottom stats bar ──────────────────────────────────────── */}
        <BottomStatsBar stats={p.sessionStats} />

      </PlayerProfileLayout>

      <style>{`
        /* ── Mid section: 2 columns ── */
        .vl-pg__mid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 14px;
          margin: 14px 0;
        }

        .vl-pg__left,
        .vl-pg__right {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* Performance + VS row inside left column */
        .vl-pg__perf-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .vl-pg__mid { grid-template-columns: 1fr; }
        }

        /* Mobile */
        @media (max-width: 560px) {
          .vl-pg__perf-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
