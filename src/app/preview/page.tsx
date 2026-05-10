'use client';

import React from 'react';
import { useParams } from 'next/navigation';

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

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PLAYER = {
  id:           'ath-1',
  name:         'Ahmed Hassan',
  initials:     'AH',
  position:     'Midfielder',
  jerseyNumber: 10,
  imageUrl:     '/athlete.png',
  status:       'fit'  as const,
  age:          24,
  weight:       72,
  height:       180,
  foot:         'Right',
  bloodType:    'A+',
  beltId:       'band-123',

  lastSession: { date: 'Today', duration: 74, opponent: 'Al-Zamalek', id: 'sess-001' },

  vitals: {
    heartRate:   { value: 142, history: [128,135,140,138,142,139,144,142,141,143,142,145,142,140,142,141,143,142,141,142] },
    spO2:        { value: 98,  history: [98,97,98,99,98,98,97,98,98,99,98,97,98,99,98,98,97,98,98,98] },
    temperature: { value: 37.1,history: [36.9,37.0,37.1,37.1,37.2,37.1,37.0,37.1,37.1,37.2,37.1,37.0,37.1,37.1,37.2,37.1,37.0,37.1,37.1,37.1] },
    stress:      { value: 18,  history: [15,16,17,18,17,16,18,19,18,17,16,18,18,17,16,18,19,18,17,18] },
  },

  fatigue:          32,
  stressLoad:       18,
  wellnessScore:    82,
  performanceScore: 78,

  comparison: {
    fatigue: { value: 70, delta: -5  },
    load:    { value: 87, delta: +8  },
    stress:  { value: 60, delta: -10 },
  },

  aiInsight: {
    summary:   'Based on current biometrics, Ahmed is performing optimally.',
    highlight: 'performing optimally',
    subDetail: 'HR trend is stable over the last 8 minutes. No intervention required.',
    keyPoints: [
      'HR trend is stable over the last 8 minutes.',
      'No intervention required.',
      'Maintain current training load.',
    ],
    readiness: 'High' as const,
  },

  sessionStats: {
    distance:      9.2,
    topSpeed:      29.6,
    sprints:       18,
    accelerations: 24,
    calories:      820,
  },
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PlayerProfilePage() {
  const params   = useParams();
  const playerId = (params?.playerId as string) ?? MOCK_PLAYER.id;
  const p        = MOCK_PLAYER;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        html, body { background: #050816; }
      `}</style>

      <PlayerProfileLayout
        playerId={playerId}
        coachName="Coach Ahmed"
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
