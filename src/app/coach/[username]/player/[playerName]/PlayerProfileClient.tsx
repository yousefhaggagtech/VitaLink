'use client';

import React, { useState } from 'react';

// ── Hooks ─────────────────────────────────────────────────────────────────────
import { usePlayerDetail } from '@/application/hooks/usePlayerDetail';
import { usePlayerProfileRealtime } from '@/application/hooks/usePlayerProfileRealtime';
import { useAIAnalysis } from '@/application/hooks/useAIAnalysis';
import { toPlayerProfile } from '@/application/mappers/toPlayerProfile';
import { applyAIAnalysisToProfile } from '@/application/mappers/applyAIAnalysisToProfile';
import { exportPlayerReport } from '@/application/utils/exportPlayerReport';

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

interface PlayerProfileClientProps {
  coachName: string;
  beltId: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function PlayerProfileClient({ coachName, beltId }: PlayerProfileClientProps) {
  const [isExportingReport, setIsExportingReport] = useState(false);

  // Fetch real player data using beltId from query param
  const { player, loading, error } = usePlayerDetail(beltId);
  const aiAnalysis = useAIAnalysis(beltId || null);

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
      fatigue: null,
      stressLoad: null,
      wellnessScore: null,
      performanceScore: null,
      comparison: {
        fatigue: { value: null, delta: null },
        load: { value: null, delta: null },
        stress: { value: null, delta: null },
      },
      aiInsight: {
        summary: '',
        highlight: '',
        subDetail: '',
        keyPoints: [],
        readiness: 'High',
        context: {
          visualState: 'no-data',
          selectedBeltId: beltId,
          snapshotBeltId: null,
          timestamp: null,
          analysisTimeLabel: 'No AI analysis yet',
          ageSinceLastUpdate: null,
          freshnessLabel: 'No data yet',
          isStale: false,
          isInWarmup: false,
          alertLevel: null,
          playerState: null,
          substitutionWindow: null,
          isUrgent: false,
          recoveryTimeMin: null,
          timeToFailMin: null,
        },
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

  // Use realtime vitals plus latest AI analysis when available
  const realtimeProfile = realtime.profileData || profileData;
  const p = realtimeProfile
    ? applyAIAnalysisToProfile(realtimeProfile, {
        recommendation: aiAnalysis.recommendation,
        rawResponse: aiAnalysis.rawResponse,
        waitingState: aiAnalysis.waitingState,
        clientStatus: aiAnalysis.clientStatus,
        isLoading: aiAnalysis.isLoading,
        isError: aiAnalysis.isError,
        error: aiAnalysis.error,
      })
    : null;

  // Render loading state
  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
          html, body { background: #050816; }
        `}</style>

        <PlayerProfileLayout coachName={coachName}>
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

        <PlayerProfileLayout coachName={coachName}>
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

  if (!p) return null;

  const aiContext = p.aiInsight.context;
  const handleExportReport = async () => {
    if (isExportingReport) return;

    setIsExportingReport(true);

    try {
      await exportPlayerReport({ player: p, coachName });
    } catch (exportError) {
      console.error('Failed to export player report:', exportError);
      window.alert('The player report could not be exported. Please try again.');
    } finally {
      setIsExportingReport(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600;700&display=swap');
        html, body { background: #050816; }
      `}</style>

      <PlayerProfileLayout
        coachName={coachName}
        onExportReport={handleExportReport}
        isExportingReport={isExportingReport}
        playerName={p.name}
        playerInitials={p.initials}
        jerseyNumber={p.jerseyNumber}
        beltId={p.beltId}
        isTelemetryConnected
      >
        {/* ── 1. Hero ─────────────────────────────────────────────────── */}
        <PlayerHero
          name={p.name}           initials={p.initials}
          position={p.position}   jerseyNumber={p.jerseyNumber}
          status={p.status}       imageUrl={p.imageUrl}
          age={p.age}             weight={p.weight}
          height={174}            foot={p.foot}
          bloodType={p.bloodType} beltId={p.beltId}
          lastSession={p.lastSession}
        />

        {/* ── 2. Live vitals ──────────────────────────────────────────── */}
        <LiveVitalsSection vitals={p.vitals} />

        {/* ── 3. Two-column: Load + right column ──────────────────────── */}
        <div className="vl-pg__mid">

          {/* Left: Load metrics */}
          <div className="vl-pg__left">
            <LoadMetricsSection
              fatigue={p.fatigue}
              stressLoad={p.stressLoad}
              visualState={aiContext.visualState}
            />

            {/* Performance + VS previous */}
            <div className="vl-pg__perf-row">
              <PerformanceScore
                score={p.performanceScore}
                delta={p.comparison.load.delta}
                deltaLabel="from latest AI"
                visualState={aiContext.visualState}
                alertLevel={aiContext.alertLevel}
                isUrgent={aiContext.isUrgent}
                freshnessLabel={aiContext.freshnessLabel}
              />
              <VSPreviousMatch
                fatigue={p.comparison.fatigue}
                load={p.comparison.load}
                stress={p.comparison.stress}
                matchLabel="latest AI metrics"
                visualState={aiContext.visualState}
              />
            </div>
          </div>

          {/* Right: Wellness + AI + Key insights */}
          <div className="vl-pg__right">
            <WellnessScore
              score={p.wellnessScore}
              visualState={aiContext.visualState}
              recoveryTimeMin={aiContext.recoveryTimeMin}
              freshnessLabel={aiContext.freshnessLabel}
            />

            <GeminiInsightsPanel
              summary={p.aiInsight.summary}
              highlight={p.aiInsight.highlight}
              subDetail={p.aiInsight.subDetail}
              readiness={p.aiInsight.readiness}
              visualState={aiContext.visualState}
              isUrgent={aiContext.isUrgent}
              alertLevel={aiContext.alertLevel}
              playerState={aiContext.playerState}
              isLive
            />

            <KeyInsights
              points={p.aiInsight.keyPoints}
              visualState={aiContext.visualState}
              isUrgent={aiContext.isUrgent}
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
