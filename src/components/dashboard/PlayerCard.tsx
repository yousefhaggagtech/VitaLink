'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Activity, Brain, Zap } from 'lucide-react';
import { Player } from '@/domain/entities/player';
import { colors, font, radius, statusConfig } from '@/styles/tokens/colors';
import { DonutRing }      from '@/components/ui/DonutRing';
import { PlayerImage }    from '@/components/dashboard/PlayerImage';
import { SegmentedBar }   from '@/components/ui/SegmentedBar';
import { LiveSparkline }  from '@/components/ui/LiveSparkLine';
import { HeartBeat }      from '@/components/ui/HeartBeat';
import { HydrationDrop }  from '@/components/ui/HydrationDrop';
import { usePlayerCardRealtime } from '@/application/hooks/usePlayerCardRealtime';

interface PlayerCardProps {
  player:    Player;
  onClick?:  (player: Player) => void;
  onDelete?: () => void;
}

type CardVars = React.CSSProperties & Record<string, string>;
type RowVars  = React.CSSProperties & { '--row-color': string };

const clamp = (v: number) => Math.max(0, Math.min(100, v));

// ── Insight label — replaces raw % with actionable text ──────────────────────
const fatigueLabel = (v: number) =>
  v > 80 ? 'Replace now' : v > 60 ? 'Watch closely' : v > 40 ? 'Building up' : 'Good shape';

const stressLabel  = (v: number) =>
  v > 75 ? 'High load'  : v > 50 ? 'Elevated'    : v > 30 ? 'Manageable'  : 'Calm';

const hrLabel = (bpm: number) =>
  bpm > 185 ? 'Max zone' : bpm > 165 ? 'High zone' : bpm > 140 ? 'Active zone' : 'Recovery';

const LoadRow: React.FC<{
  label:   string;
  insight: string;
  value:   number;
  color:   string;
  icon:    React.ReactNode;
}> = ({ label, insight, value, color, icon }) => (
  <div className="vl2-load-row" style={{ '--row-color': color } as RowVars}>
    <div className="vl2-load-left">
      <span className="vl2-load-icon">{icon}</span>
      <div>
        <div className="vl2-load-label">{label}</div>
        <div className="vl2-load-insight">{insight}</div>
      </div>
    </div>
    <div className="vl2-load-right">
      <SegmentedBar
        value={clamp(value)}
        total={14}
        activeColor={color}
        inactiveColor="rgba(255,255,255,0.05)"
        height="clamp(0.38rem,1.45cqw,0.7rem)"
        gap="clamp(0.13rem,0.55cqw,0.28rem)"
        rounded="clamp(0.1rem,0.4cqw,0.22rem)"
        showGlow={false}
      />
    </div>
    <strong className="vl2-load-val">{clamp(value)}%</strong>
  </div>
);

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, onClick }) => {
  const router = useRouter();
  const params = useParams();
  const coachName = decodeURIComponent((params?.username as string) ?? '');

  // Initialize realtime connection for live vitals
  const { livePlayer } = usePlayerCardRealtime({
    player,
    beltId: player.beltId,
  });

  const cfg        = statusConfig[player.status];
  const isCritical = player.status === 'critical';

  const fatigueColor = livePlayer.fatigue > 80 ? colors.fatigueHigh
    : livePlayer.fatigue > 55 ? colors.fatigueMed : colors.athleteCard.green;
  const stressColor  = livePlayer.stress > 75 ? colors.stressHigh : colors.athleteCard.blue;

  const vars: CardVars = {
    '--accent':      cfg.color,
    '--accent-soft': cfg.border,
    '--accent-glow': cfg.glow,
    '--rx': '0deg', '--ry': '0deg',
    '--sx': '50%',  '--sy': '18%',
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    e.currentTarget.style.setProperty('--rx', `${((0.5-y)*3).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--ry', `${((x-0.5)*4).toFixed(2)}deg`);
    e.currentTarget.style.setProperty('--sx', `${(x*100).toFixed(1)}%`);
    e.currentTarget.style.setProperty('--sy', `${(y*100).toFixed(1)}%`);
  };
  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    ['--rx','--ry'].forEach(p => e.currentTarget.style.setProperty(p,'0deg'));
    e.currentTarget.style.setProperty('--sx','50%');
    e.currentTarget.style.setProperty('--sy','18%');
  };

  return (
    <div
      className={`vl2-card${isCritical ? ' is-critical' : ''}`}
      onClick={() => {
        // Navigate to player profile with beltId as query param
        const targetUrl = `/coach/${coachName}/player/${encodeURIComponent(player.name)}?beltId=${encodeURIComponent(player.beltId ?? '')}`;
        router.push(targetUrl);
      }}
      onPointerMove={onMove} onPointerLeave={onLeave}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={vars}
    >
      {/* Glassmorphism shine */}
      <div className="vl2-card__shine" />

      {/* ── HERO ── */}
      <section className="vl2-hero">
        <PlayerImage
          name={player.name} initials={player.initials}
          status={player.status} imageUrl={player.imageUrl}
        />

        <div className="vl2-identity">
          <h3>{player.name}</h3>
          <p className="vl2-position">{player.position}</p>
          <div className="vl2-divider" />
          <div className="vl2-meta">
            {player.age    && <span>{player.age} yrs</span>}
            {player.weight && <span>{player.weight} kg</span>}
          </div>
        </div>

        <div className="vl2-status-col">
          <div className="vl2-status-pill">
            <Activity size={16} strokeWidth={2.2}/>
            <span>{cfg.label}</span>
          </div>
          <div className="vl2-jersey" aria-hidden>{player.jerseyNumber}</div>
        </div>
      </section>

      {/* ── VITALS ── */}
      <section className="vl2-vitals">

        {/* Heart Rate */}
        <article className="vl2-panel vl2-panel--hr">
          <div className="vl2-orb vl2-orb--red">
            <HeartBeat bpm={livePlayer.heartRate} size={24} color={colors.athleteCard.red}/>
          </div>
          <div className="vl2-stat-copy">
            <span className="vl2-stat-label">Heart Rate</span>
            <div className="vl2-stat-value">
              <strong style={{ color: colors.athleteCard.red }}>{livePlayer.heartRate}</strong>
              <em>BPM</em>
            </div>
            <span className="vl2-insight-tag" style={{ color: colors.athleteCard.red }}>
              {hrLabel(livePlayer.heartRate)}
            </span>
          </div>
          <LiveSparkline
            data={livePlayer.hrHistory}
            color={colors.athleteCard.red}
            width={80} height={30} strokeWidth={1.8}
          />
        </article>

        {/* SpO2 */}
        <article className="vl2-panel vl2-panel--spo2">
          <div className="vl2-orb vl2-orb--cyan">
            <HydrationDrop value={livePlayer.spO2} size={22} color={colors.athleteCard.cyan}/>
          </div>
          <div className="vl2-stat-copy">
            <span className="vl2-stat-label">SpO2</span>
            <div className="vl2-stat-value">
              <strong style={{ color: colors.athleteCard.cyan }}>{livePlayer.spO2}</strong>
              <em>%</em>
            </div>
            <span className="vl2-insight-tag" style={{
              color: livePlayer.spO2 >= 97 ? colors.fit : livePlayer.spO2 >= 94 ? colors.moderate : colors.critical,
            }}>
              {livePlayer.spO2 >= 97 ? 'Optimal' : livePlayer.spO2 >= 94 ? 'Acceptable' : 'Low — act'}
            </span>
          </div>
          <DonutRing
            value={livePlayer.spO2} size={52} stroke={6}
            color={colors.athleteCard.cyan}
            secondaryColor={colors.athleteCard.cyanBright}
            trackColor="rgba(255,255,255,0.05)"
            showGlow={false}
          />
        </article>
      </section>

      {/* ── LOAD METRICS ── */}
      <section className="vl2-load">
        <LoadRow
          label="Fatigue" insight={fatigueLabel(livePlayer.fatigue)}
          value={livePlayer.fatigue} color={fatigueColor}
          icon={<Zap size={16} fill="currentColor" strokeWidth={1.5}/>}
        />
        <LoadRow
          label="Stress"  insight={stressLabel(livePlayer.stress)}
          value={livePlayer.stress}  color={stressColor}
          icon={<Brain size={16} strokeWidth={1.9}/>}
        />
      </section>

      {!player.beltId && (
        <div className="vl2-no-belt">⚠ No belt assigned</div>
      )}

      <style>{`
        /* ── Card (glassmorphism shell) ─────────────────────── */
        .vl2-card {
          position: relative;
          isolation: isolate;
          container-type: inline-size;
          width: min(100%, 880px);
          max-width: 880px;
          margin-inline: auto;
          padding: clamp(14px,1.8cqw,20px);
          overflow: hidden;
          color: ${colors.text};
          cursor: ${onClick ? 'pointer' : 'default'};

          /* Glass */
          background: rgba(255,255,255,0.030);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: ${radius.xl};
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);

          box-shadow:
            0 4px 24px rgba(0,0,0,0.50),
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 -1px 0 rgba(0,0,0,0.25) inset;

          transform:
            perspective(1200px)
            rotateX(var(--rx)) rotateY(var(--ry))
            translateZ(0);
          transform-style: preserve-3d;
          transition: transform 160ms ease, border-color 200ms ease, box-shadow 200ms ease;
          will-change: transform;
        }

        .vl2-card:hover {
          border-color: rgba(255,255,255,0.14);
          box-shadow:
            0 8px 36px rgba(0,0,0,0.56),
            0 1px 0 rgba(255,255,255,0.08) inset;
        }

        /* Critical — border pulses, no ambient spread */
        .vl2-card.is-critical {
          border-color: ${colors.criticalBorder};
          animation: vl2-crit-border 2s ease-in-out infinite;
        }
        @keyframes vl2-crit-border {
          0%,100% { border-color: ${colors.criticalBorder}; }
          50%      { border-color: rgba(200,75,90,0.38); }
        }

        /* Glass shine on hover */
        .vl2-card__shine {
          position: absolute; inset: 0; z-index: 0;
          background: radial-gradient(
            ellipse at var(--sx) var(--sy),
            rgba(255,255,255,0.06) 0%,
            transparent 55%
          );
          opacity: 0; transition: opacity 160ms ease; pointer-events: none;
          border-radius: inherit;
        }
        .vl2-card:hover .vl2-card__shine { opacity: 1; }

        /* All sections sit above glass layers */
        .vl2-hero, .vl2-vitals, .vl2-load, .vl2-no-belt { position: relative; z-index: 1; }

        /* ── Hero ─────────────────────────────────────────── */
        .vl2-hero {
          display: grid;
          grid-template-columns: minmax(0,0.68fr) minmax(0,1.5fr) minmax(0,0.5fr);
          gap: clamp(12px,1.9cqw,22px);
          align-items: start;
        }

        .vl2-identity { min-width:0; padding-top: clamp(8px,2.5cqw,20px); }

        .vl2-identity h3 {
          margin: 0;
          color: ${colors.text};
          font-family: ${font.display};
          font-size: clamp(24px,4.4cqw,40px);
          font-weight: 700; line-height: 1;
          letter-spacing: .01em;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }

        .vl2-position {
          margin: clamp(5px,.9cqw,9px) 0 0;
          color: var(--accent);
          font-family: ${font.body};
          font-size: clamp(9px,1.4cqw,13px);
          font-weight: 700;
          letter-spacing: clamp(.12em,.6cqw,.18em);
          text-transform: uppercase;
        }

        .vl2-divider {
          width:100%; height: 0.5px;
          margin: clamp(9px,1.3cqw,13px) 0 clamp(7px,1.1cqw,11px);
          background: linear-gradient(90deg,
            rgba(255,255,255,0.12),
            rgba(255,255,255,0.04),
            transparent
          );
        }

        .vl2-meta {
          display: flex; gap: clamp(8px,1.4cqw,14px);
          color: ${colors.textSecondary};
          font-family: ${font.body};
          font-size: clamp(9px,1cqw,11px);
          font-weight: 600; letter-spacing: .04em; text-transform: uppercase;
        }

        .vl2-meta span {
          position: relative;
        }
        .vl2-meta span:not(:last-child)::after {
          content: "";
          position: absolute; right: -7px; top: 50%;
          transform: translateY(-50%);
          width: 0.5px; height: 12px;
          background: rgba(255,255,255,0.18);
        }

        /* Status column */
        .vl2-status-col {
          display: flex; flex-direction: column; align-items: flex-end;
          gap: clamp(10px,2.4cqw,20px);
          padding-top: clamp(5px,1.2cqw,10px);
          min-width: 0;
        }

        .vl2-status-pill {
          display: inline-flex; align-items: center;
          gap: clamp(4px,.8cqw,8px);
          min-height: clamp(32px,3.8cqw,42px);
          padding: 0 clamp(8px,1.2cqw,14px);
          color: var(--accent);
          border: 0.5px solid var(--accent-soft);
          border-radius: ${radius.full};
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(8px);
          white-space: nowrap;
        }

        .vl2-status-pill span {
          font-family: ${font.display};
          font-size: clamp(12px,1.8cqw,18px);
          font-weight: 700; letter-spacing: .07em;
        }

        .vl2-jersey {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.10);
          font-family: ${font.display};
          font-size: clamp(44px,7cqw,70px);
          font-weight: 700; line-height: .8;
          user-select: none; overflow: hidden;
        }

        /* ── Vitals ───────────────────────────────────────── */
        .vl2-vitals {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: clamp(7px,1.2cqw,12px);
          margin-top: clamp(10px,1.5cqw,16px);
        }

        /* Glass panel */
        .vl2-panel {
          display: grid; align-items: center;
          background: rgba(255,255,255,0.025);
          border: 0.5px solid rgba(255,255,255,0.07);
          border-radius: clamp(10px,1.3cqw,16px);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.04);
        }

        .vl2-panel--hr {
          grid-template-columns: auto minmax(80px,1fr) minmax(60px,.46fr);
          gap: clamp(6px,.9cqw,11px);
          padding: clamp(8px,.95cqw,12px) clamp(10px,1.3cqw,15px);
        }

        .vl2-panel--spo2 {
          grid-template-columns: auto minmax(80px,1fr) auto;
          gap: clamp(6px,.9cqw,11px);
          padding: clamp(8px,.95cqw,12px) clamp(10px,1.3cqw,15px);
        }

        /* Orb */
        .vl2-orb {
          width: clamp(40px,4.6cqw,52px); height: clamp(40px,4.6cqw,52px);
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.10);
          flex-shrink: 0;
        }
        .vl2-orb--red  { color: ${colors.athleteCard.red};  border-color: rgba(212,96,122,0.25); }
        .vl2-orb--cyan { color: ${colors.athleteCard.cyan}; border-color: rgba(74,150,196,0.25); }

        /* Stat copy */
        .vl2-stat-label {
          display: block;
          color: ${colors.textSecondary};
          font-family: ${font.body};
          font-size: clamp(8px,.9cqw,11px);
          font-weight: 700; letter-spacing: .08em;
          text-transform: uppercase;
          margin-bottom: clamp(2px,.5cqw,5px);
        }

        .vl2-stat-value {
          display: flex; align-items: flex-end;
          gap: clamp(2px,.5cqw,5px);
          margin-bottom: 3px;
        }

        .vl2-stat-value strong {
          font-family: ${font.display};
          font-size: clamp(24px,3.6cqw,36px);
          font-weight: 700; line-height: .9;
        }

        .vl2-stat-value em {
          color: ${colors.textMuted};
          font-family: ${font.body};
          font-size: clamp(10px,1.2cqw,14px);
          font-style: normal; font-weight: 600; line-height: 1;
        }

        /* Insight tag — the "actionable" text under the number */
        .vl2-insight-tag {
          font-family: ${font.body};
          font-size: clamp(8px,.85cqw,10px);
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
          opacity: 0.85;
        }

        /* ── Load panel ────────────────────────────────────── */
        .vl2-load {
          display: grid;
          margin-top: clamp(8px,1.2cqw,12px);
          background: rgba(255,255,255,0.020);
          border: 0.5px solid rgba(255,255,255,0.06);
          border-radius: clamp(10px,1.3cqw,16px);
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.035);
        }

        .vl2-load-row {
          display: grid;
          grid-template-columns: minmax(0,.36fr) minmax(0,1fr) max-content;
          gap: clamp(6px,1.4cqw,14px);
          align-items: center;
          min-height: clamp(42px,4.9cqw,54px);
          padding: 0 clamp(10px,1.5cqw,16px);
        }
        .vl2-load-row + .vl2-load-row {
          border-top: 0.5px solid rgba(255,255,255,0.05);
        }

        .vl2-load-left {
          display: flex; align-items: center;
          gap: clamp(6px,.9cqw,10px);
          min-width: 0;
        }

        .vl2-load-icon {
          width: clamp(26px,3.1cqw,36px); height: clamp(26px,3.1cqw,36px);
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          color: var(--row-color);
          border: 0.5px solid color-mix(in srgb, var(--row-color) 30%, transparent);
          border-radius: 50%;
          background: color-mix(in srgb, var(--row-color) 8%, transparent);
        }

        .vl2-load-label {
          color: ${colors.text};
          font-family: ${font.display};
          font-size: clamp(12px,1.5cqw,17px);
          font-weight: 700; letter-spacing: .07em; text-transform: uppercase;
          line-height: 1;
        }

        /* Insight text below label */
        .vl2-load-insight {
          color: var(--row-color);
          font-family: ${font.body};
          font-size: clamp(8px,.8cqw,10px);
          font-weight: 600;
          letter-spacing: .05em;
          opacity: 0.8;
          margin-top: 2px;
        }

        .vl2-load-right { min-width: 0; }

        .vl2-load-val {
          color: var(--row-color);
          font-family: ${font.display};
          font-size: clamp(16px,2cqw,22px);
          font-weight: 700; line-height: 1; text-align: right;
          white-space: nowrap;
        }

        .vl2-no-belt {
          display: inline-flex; align-items: center;
          margin-top: 8px; padding: 3px 10px;
          color: ${colors.moderate};
          border: 0.5px solid ${colors.moderateBorder};
          border-radius: ${radius.full};
          background: ${colors.moderateBg};
          font-family: ${font.body}; font-size: 10px;
          font-weight: 700; letter-spacing: .04em; text-transform: uppercase;
        }

        /* ── Responsive ────────────────────────────────────── */
        @container (max-width: 640px) {
          .vl2-hero { grid-template-columns: minmax(0,.44fr) minmax(0,.56fr); }
          .vl2-status-col { grid-column:1/-1; flex-direction:row; align-items:center; justify-content:space-between; padding-top:0; }
          .vl2-vitals { grid-template-columns: 1fr; }
        }
        @container (max-width: 460px) {
          .vl2-card { padding: 13px; border-radius: ${radius.lg}; }
          .vl2-hero { grid-template-columns: 1fr; gap: 12px; }
          .vl2-identity { padding-top: 0; text-align: center; }
          .vl2-meta { justify-content: center; flex-wrap: wrap; }
          .vl2-status-col { align-items: center; justify-content: center; }
          .vl2-load-row { grid-template-columns: minmax(0,.9fr) max-content; row-gap: 7px; padding-block: 9px; }
          .vl2-load-row > :nth-child(2) { grid-column:1/-1; grid-row:2; }
          .vl2-load-val { grid-column:2; grid-row:1; }
        }
      `}</style>
    </div>
  );
};