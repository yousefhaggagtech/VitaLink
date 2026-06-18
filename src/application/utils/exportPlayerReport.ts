import type { PlayerProfileData } from '@/application/mappers/toPlayerProfile';

const REPORT_WIDTH = 794;
const REPORT_HEIGHT = 1123;
const PDF_WIDTH_MM = 210;
const PDF_HEIGHT_MM = 297;

type MetricTone = 'lime' | 'cyan' | 'violet' | 'amber' | 'danger';

interface ExportPlayerReportOptions {
  player: PlayerProfileData;
  coachName: string;
}

export async function exportPlayerReport({
  player,
  coachName,
}: ExportPlayerReportOptions): Promise<void> {
  const generatedAt = new Date();
  const reportFrame = createReportFrame();
  document.body.appendChild(reportFrame);
  const reportRoot = mountReport(
    reportFrame,
    buildReportMarkup(player, coachName, generatedAt)
  );

  try {
    await waitForReportAssets(reportRoot);

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);

    const pages = Array.from(
      reportRoot.querySelectorAll<HTMLElement>('.vl-report-page')
    );
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    pdf.setProperties({
      title: `VitaLink Player Report - ${player.name}`,
      subject: 'Player wellness, performance, telemetry, and AI insights',
      author: 'VitaLink',
      creator: 'VitaLink Player Profile',
    });

    for (let index = 0; index < pages.length; index += 1) {
      const canvas = await html2canvas(pages[index], {
        backgroundColor: '#050816',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: REPORT_WIDTH,
        height: REPORT_HEIGHT,
        windowWidth: REPORT_WIDTH,
        windowHeight: REPORT_HEIGHT,
      });

      if (index > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.94),
        'JPEG',
        0,
        0,
        PDF_WIDTH_MM,
        PDF_HEIGHT_MM,
        undefined,
        'FAST'
      );
    }

    pdf.save(buildFileName(player.name, generatedAt));
  } finally {
    reportFrame.remove();
  }
}

function createReportFrame(): HTMLIFrameElement {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  frame.style.position = 'fixed';
  frame.style.left = '-10000px';
  frame.style.top = '0';
  frame.style.width = `${REPORT_WIDTH}px`;
  frame.style.height = `${REPORT_HEIGHT}px`;
  frame.style.border = '0';
  frame.style.pointerEvents = 'none';
  frame.style.opacity = '0';
  frame.style.zIndex = '-1';
  return frame;
}

function mountReport(frame: HTMLIFrameElement, markup: string): HTMLElement {
  const reportDocument = frame.contentDocument;

  if (!reportDocument) {
    throw new Error('Unable to create the isolated report document.');
  }

  reportDocument.open();
  reportDocument.write(`<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="color-scheme" content="dark" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: ${REPORT_WIDTH}px;
            min-height: ${REPORT_HEIGHT}px;
            overflow: hidden;
            color: #f8fafc;
            background: #050816;
          }
        </style>
      </head>
      <body>${markup}</body>
    </html>`);
  reportDocument.close();

  const reportRoot = reportDocument.querySelector<HTMLElement>('.vl-report-root');

  if (!reportRoot) {
    throw new Error('Unable to mount the player report.');
  }

  return reportRoot;
}

function buildReportMarkup(
  player: PlayerProfileData,
  coachName: string,
  generatedAt: Date
): string {
  const context = player.aiInsight.context;
  const reportDate = formatDateTime(generatedAt);
  const snapshotTime = context.timestamp
    ? formatDateTime(new Date(context.timestamp))
    : 'Not available';
  const statusTone = getStatusTone(player.status, context.isUrgent);
  const alertLabel = context.alertLevel ?? 'Pending';
  const alertTone = getAlertTone(context.alertLevel, context.isUrgent);
  const avatar = safeImageSource(player.imageUrl)
    ? `<img class="vl-report-avatar-image" src="${escapeHtml(safeImageSource(player.imageUrl))}" alt="" />`
    : `<span>${escapeHtml(player.initials || initialsFromName(player.name))}</span>`;

  const vitalCards = [
    {
      label: 'Heart rate',
      value: formatNumber(player.vitals.heartRate.value),
      unit: 'BPM',
      detail: getHeartRateInsight(player.vitals.heartRate.value),
      tone: 'danger' as MetricTone,
    },
    {
      label: 'Blood oxygen',
      value: formatNumber(player.vitals.spO2.value),
      unit: '%',
      detail: getSpO2Insight(player.vitals.spO2.value),
      tone: 'cyan' as MetricTone,
    },
    {
      label: 'Temperature',
      value: player.vitals.temperature.value.toFixed(1),
      unit: '°C',
      detail: getTemperatureInsight(player.vitals.temperature.value),
      tone: 'amber' as MetricTone,
    },
    {
      label: 'GSR / stress',
      value: formatNumber(player.vitals.stress.value),
      unit: '%',
      detail: getStressInsight(player.vitals.stress.value),
      tone: 'violet' as MetricTone,
    },
  ]
    .map(
      metric => `
        <div class="vl-report-metric vl-report-tone-${metric.tone}">
          <span class="vl-report-eyebrow">${metric.label}</span>
          <div class="vl-report-metric-value">
            <strong>${metric.value}</strong><span>${metric.unit}</span>
          </div>
          <span class="vl-report-metric-detail">${metric.detail}</span>
        </div>
      `
    )
    .join('');

  const latestMetrics = [
    {
      label: 'Cramp risk',
      value: formatPercent(player.comparison.fatigue.value ?? player.fatigue),
      detail: metricAvailability(player.comparison.fatigue.value ?? player.fatigue, context.visualState),
      tone: 'amber' as MetricTone,
    },
    {
      label: 'Power',
      value: formatPercent(player.comparison.load.value ?? player.performanceScore),
      detail: metricAvailability(player.comparison.load.value ?? player.performanceScore, context.visualState),
      tone: 'cyan' as MetricTone,
    },
    {
      label: 'Momentum',
      value: formatPercent(player.comparison.stress.value ?? player.stressLoad),
      detail: metricAvailability(player.comparison.stress.value ?? player.stressLoad, context.visualState),
      tone: 'violet' as MetricTone,
    },
  ]
    .map(
      metric => `
        <div class="vl-report-ai-metric vl-report-tone-${metric.tone}">
          <div class="vl-report-ai-metric-top">
            <span>${metric.label}</span>
            <i></i>
          </div>
          <strong>${metric.value}</strong>
          <small>${escapeHtml(metric.detail)}</small>
        </div>
      `
    )
    .join('');

  const insights = player.aiInsight.keyPoints.length
    ? player.aiInsight.keyPoints
        .map(
          point => `
            <li>
              <span class="vl-report-check">✓</span>
              <span dir="auto">${escapeHtml(point)}</span>
            </li>
          `
        )
        .join('')
    : `
        <li>
          <span class="vl-report-check">•</span>
          <span>No AI insights are available for this snapshot.</span>
        </li>
      `;

  const sessionStats = [
    ['Distance', `${formatDecimal(player.sessionStats.distance)} km`],
    ['Top speed', `${formatDecimal(player.sessionStats.topSpeed)} km/h`],
    ['Sprints', formatNumber(player.sessionStats.sprints)],
    ['Accelerations', formatNumber(player.sessionStats.accelerations)],
    ['Calories', `${formatNumber(player.sessionStats.calories)} kcal`],
  ]
    .map(
      ([label, value]) => `
        <div class="vl-report-stat">
          <span>${label}</span>
          <strong>${value}</strong>
        </div>
      `
    )
    .join('');

  return `
    <style>
      .vl-report-root,
      .vl-report-root * {
        box-sizing: border-box;
      }

      .vl-report-root {
        width: ${REPORT_WIDTH}px;
        color: #f8fafc;
        font-family: Arial, "Segoe UI", sans-serif;
        line-height: 1.4;
      }

      .vl-report-page {
        position: relative;
        width: ${REPORT_WIDTH}px;
        height: ${REPORT_HEIGHT}px;
        overflow: hidden;
        padding: 44px 50px 42px;
        background:
          radial-gradient(circle at 90% 0%, rgba(139, 92, 246, 0.16), transparent 31%),
          radial-gradient(circle at 6% 46%, rgba(56, 189, 248, 0.08), transparent 28%),
          linear-gradient(145deg, #050816 0%, #07111f 58%, #0a1324 100%);
      }

      .vl-report-page::before {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px);
        background-size: 44px 44px;
        opacity: 0.38;
        pointer-events: none;
      }

      .vl-report-content {
        position: relative;
        z-index: 1;
      }

      .vl-report-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(255,255,255,0.09);
      }

      .vl-report-brand {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .vl-report-logo {
        position: relative;
        width: 32px;
        height: 32px;
        border-radius: 11px;
        background: rgba(182,255,46,0.10);
        border: 1px solid rgba(182,255,46,0.24);
      }

      .vl-report-logo::after {
        content: "V";
        position: absolute;
        inset: 0;
        display: grid;
        place-items: center;
        color: #b6ff2e;
        font-size: 17px;
        font-weight: 800;
      }

      .vl-report-brand strong {
        display: block;
        font-size: 17px;
        letter-spacing: 0.08em;
      }

      .vl-report-brand span,
      .vl-report-page-label {
        display: block;
        margin-top: 1px;
        color: rgba(255,255,255,0.46);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.13em;
        text-transform: uppercase;
      }

      .vl-report-page-label {
        text-align: right;
      }

      .vl-report-hero {
        display: grid;
        grid-template-columns: 1fr 210px;
        gap: 22px;
        align-items: stretch;
        margin-top: 22px;
      }

      .vl-report-player,
      .vl-report-meta-card,
      .vl-report-panel,
      .vl-report-score,
      .vl-report-metric,
      .vl-report-ai-metric {
        background:
          linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.018) 52%),
          rgba(11,18,32,0.78);
        border: 1px solid rgba(255,255,255,0.09);
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 18px 45px rgba(0,0,0,0.22);
      }

      .vl-report-player {
        display: flex;
        align-items: center;
        gap: 18px;
        min-height: 132px;
        padding: 20px;
        border-radius: 24px;
      }

      .vl-report-avatar {
        display: grid;
        place-items: center;
        width: 76px;
        height: 76px;
        flex: 0 0 76px;
        overflow: hidden;
        border-radius: 24px;
        color: #b6ff2e;
        background: rgba(182,255,46,0.08);
        border: 1px solid rgba(182,255,46,0.25);
        font-size: 25px;
        font-weight: 800;
      }

      .vl-report-avatar-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .vl-report-player-copy {
        min-width: 0;
      }

      .vl-report-player-copy h1 {
        margin: 0;
        font-size: 29px;
        line-height: 1.08;
        letter-spacing: -0.02em;
      }

      .vl-report-player-copy p {
        margin: 7px 0 12px;
        color: rgba(255,255,255,0.58);
        font-size: 12px;
      }

      .vl-report-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
      }

      .vl-report-tag {
        padding: 5px 9px;
        border-radius: 999px;
        color: rgba(255,255,255,0.72);
        background: rgba(255,255,255,0.045);
        border: 1px solid rgba(255,255,255,0.08);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.04em;
      }

      .vl-report-tag-${statusTone},
      .vl-report-tag-${alertTone} {
        color: var(--tone-color);
        background: var(--tone-bg);
        border-color: var(--tone-border);
      }

      .vl-report-tag-lime,
      .vl-report-tone-lime {
        --tone-color: #b6ff2e;
        --tone-bg: rgba(182,255,46,0.08);
        --tone-border: rgba(182,255,46,0.22);
      }

      .vl-report-tag-cyan,
      .vl-report-tone-cyan {
        --tone-color: #38bdf8;
        --tone-bg: rgba(56,189,248,0.08);
        --tone-border: rgba(56,189,248,0.22);
      }

      .vl-report-tag-violet,
      .vl-report-tone-violet {
        --tone-color: #a78bfa;
        --tone-bg: rgba(139,92,246,0.10);
        --tone-border: rgba(139,92,246,0.24);
      }

      .vl-report-tag-amber,
      .vl-report-tone-amber {
        --tone-color: #fbbf24;
        --tone-bg: rgba(251,191,36,0.08);
        --tone-border: rgba(251,191,36,0.22);
      }

      .vl-report-tag-danger,
      .vl-report-tone-danger {
        --tone-color: #fb7185;
        --tone-bg: rgba(251,113,133,0.09);
        --tone-border: rgba(251,113,133,0.24);
      }

      .vl-report-meta-card {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 12px;
        padding: 18px;
        border-radius: 24px;
      }

      .vl-report-meta-row {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .vl-report-meta-row span,
      .vl-report-eyebrow {
        color: rgba(255,255,255,0.42);
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 0.13em;
        text-transform: uppercase;
      }

      .vl-report-meta-row strong {
        color: rgba(255,255,255,0.86);
        font-size: 11px;
      }

      .vl-report-section {
        margin-top: 22px;
      }

      .vl-report-section-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
      }

      .vl-report-section-heading h2 {
        margin: 0;
        color: rgba(255,255,255,0.64);
        font-size: 10px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
      }

      .vl-report-section-heading span {
        color: rgba(255,255,255,0.34);
        font-size: 9px;
      }

      .vl-report-score-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
      }

      .vl-report-score {
        min-height: 128px;
        padding: 16px;
        border-radius: 20px;
      }

      .vl-report-score strong {
        display: block;
        margin-top: 9px;
        color: var(--tone-color);
        font-size: 35px;
        line-height: 1;
      }

      .vl-report-score strong span {
        color: rgba(255,255,255,0.34);
        font-size: 14px;
      }

      .vl-report-score p {
        margin: 8px 0 0;
        color: rgba(255,255,255,0.58);
        font-size: 10px;
      }

      .vl-report-progress {
        height: 4px;
        margin-top: 11px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255,255,255,0.07);
      }

      .vl-report-progress i {
        display: block;
        height: 100%;
        width: var(--progress);
        border-radius: inherit;
        background: var(--tone-color);
      }

      .vl-report-vitals {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 9px;
      }

      .vl-report-metric {
        min-height: 103px;
        padding: 13px;
        border-radius: 18px;
      }

      .vl-report-metric-value {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin-top: 9px;
      }

      .vl-report-metric-value strong {
        color: var(--tone-color);
        font-size: 25px;
        line-height: 1;
      }

      .vl-report-metric-value span {
        color: rgba(255,255,255,0.38);
        font-size: 9px;
      }

      .vl-report-metric-detail {
        display: block;
        margin-top: 8px;
        color: var(--tone-color);
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .vl-report-panel {
        padding: 17px 19px;
        border-radius: 20px;
      }

      .vl-report-assessment {
        display: grid;
        grid-template-columns: 1fr 164px;
        gap: 18px;
        align-items: center;
      }

      .vl-report-assessment h3 {
        margin: 0 0 7px;
        color: #a78bfa;
        font-size: 10px;
        letter-spacing: 0.13em;
        text-transform: uppercase;
      }

      .vl-report-assessment p {
        margin: 0;
        color: rgba(255,255,255,0.72);
        font-size: 11px;
        line-height: 1.55;
      }

      .vl-report-assessment small {
        display: block;
        margin-top: 8px;
        color: rgba(255,255,255,0.42);
        font-size: 9px;
      }

      .vl-report-readiness {
        padding: 13px;
        border-radius: 16px;
        text-align: center;
        background: ${readinessBackground(player.aiInsight.readiness)};
        border: 1px solid ${readinessBorder(player.aiInsight.readiness)};
      }

      .vl-report-readiness span {
        display: block;
        color: rgba(255,255,255,0.46);
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .vl-report-readiness strong {
        display: block;
        margin-top: 4px;
        color: ${readinessColor(player.aiInsight.readiness)};
        font-size: 23px;
      }

      .vl-report-ai-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 11px;
      }

      .vl-report-ai-metric {
        min-height: 132px;
        padding: 18px;
        border-radius: 21px;
      }

      .vl-report-ai-metric-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgba(255,255,255,0.50);
        font-size: 9px;
        font-weight: 800;
        letter-spacing: 0.1em;
        text-transform: uppercase;
      }

      .vl-report-ai-metric-top i {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: var(--tone-color);
        box-shadow: 0 0 12px var(--tone-color);
      }

      .vl-report-ai-metric strong {
        display: block;
        margin: 15px 0 6px;
        color: var(--tone-color);
        font-size: 31px;
        line-height: 1;
      }

      .vl-report-ai-metric small {
        color: rgba(255,255,255,0.42);
        font-size: 9px;
      }

      .vl-report-context-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 9px;
      }

      .vl-report-context-item {
        min-height: 74px;
        padding: 12px;
        border-radius: 16px;
        background: rgba(8,15,28,0.72);
        border: 1px solid rgba(255,255,255,0.075);
      }

      .vl-report-context-item span {
        display: block;
        color: rgba(255,255,255,0.38);
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .vl-report-context-item strong {
        display: block;
        margin-top: 8px;
        color: rgba(255,255,255,0.82);
        font-size: 11px;
      }

      .vl-report-two-column {
        display: grid;
        grid-template-columns: 1.14fr 0.86fr;
        gap: 12px;
      }

      .vl-report-insights {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .vl-report-insights li {
        display: flex;
        gap: 9px;
        padding: 8px 0;
        color: rgba(255,255,255,0.68);
        border-bottom: 1px solid rgba(255,255,255,0.06);
        font-size: 9.5px;
        line-height: 1.45;
      }

      .vl-report-insights li:last-child {
        border-bottom: 0;
      }

      .vl-report-check {
        display: grid;
        place-items: center;
        width: 16px;
        height: 16px;
        flex: 0 0 16px;
        border-radius: 50%;
        color: #b6ff2e;
        background: rgba(182,255,46,0.09);
        border: 1px solid rgba(182,255,46,0.20);
        font-size: 9px;
        font-weight: 800;
      }

      .vl-report-profile-list {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .vl-report-profile-item {
        padding-bottom: 8px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
      }

      .vl-report-profile-item span {
        display: block;
        color: rgba(255,255,255,0.36);
        font-size: 8px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .vl-report-profile-item strong {
        display: block;
        margin-top: 4px;
        color: rgba(255,255,255,0.78);
        font-size: 10px;
      }

      .vl-report-stats {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
      }

      .vl-report-stat {
        padding: 12px 9px;
        border-radius: 14px;
        text-align: center;
        background: rgba(8,15,28,0.72);
        border: 1px solid rgba(255,255,255,0.07);
      }

      .vl-report-stat span {
        display: block;
        color: rgba(255,255,255,0.36);
        font-size: 7px;
        font-weight: 800;
        letter-spacing: 0.07em;
        text-transform: uppercase;
      }

      .vl-report-stat strong {
        display: block;
        margin-top: 6px;
        color: #b6ff2e;
        font-size: 11px;
      }

      .vl-report-note {
        margin: 10px 0 0;
        color: rgba(255,255,255,0.34);
        font-size: 8px;
        line-height: 1.5;
      }

      .vl-report-footer {
        position: absolute;
        z-index: 1;
        left: 50px;
        right: 50px;
        bottom: 25px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: rgba(255,255,255,0.28);
        font-size: 8px;
        letter-spacing: 0.05em;
      }
    </style>

    <div class="vl-report-root">
      <section class="vl-report-page">
        <div class="vl-report-content">
          ${reportHeader('Player Performance Report', '01 / 02')}

          <div class="vl-report-hero">
            <div class="vl-report-player">
              <div class="vl-report-avatar">${avatar}</div>
              <div class="vl-report-player-copy">
                <h1 dir="auto">${escapeHtml(player.name)}</h1>
                <p>${escapeHtml(player.position)}${player.jerseyNumber ? ` · #${player.jerseyNumber}` : ''}</p>
                <div class="vl-report-tags">
                  <span class="vl-report-tag vl-report-tag-${statusTone}">Status: ${escapeHtml(player.status.toUpperCase())}</span>
                  <span class="vl-report-tag vl-report-tag-${alertTone}">Alert: ${escapeHtml(alertLabel.replace(/_/g, ' '))}</span>
                  <span class="vl-report-tag">Belt ${escapeHtml(player.beltId || 'N/A')}</span>
                </div>
              </div>
            </div>

            <div class="vl-report-meta-card">
              <div class="vl-report-meta-row">
                <span>Prepared for</span>
                <strong dir="auto">${escapeHtml(coachName)}</strong>
              </div>
              <div class="vl-report-meta-row">
                <span>Generated</span>
                <strong>${escapeHtml(reportDate)}</strong>
              </div>
              <div class="vl-report-meta-row">
                <span>AI snapshot</span>
                <strong>${escapeHtml(snapshotTime)}</strong>
              </div>
            </div>
          </div>

          <div class="vl-report-section">
            ${sectionHeading('Executive scores', context.freshnessLabel)}
            <div class="vl-report-score-grid">
              ${scoreCard(
                'Wellness score',
                player.wellnessScore,
                getWellnessDescription(player.wellnessScore, context.recoveryTimeMin),
                player.wellnessScore === null ? 'violet' : scoreTone(player.wellnessScore)
              )}
              ${scoreCard(
                'Performance score',
                player.performanceScore,
                getPerformanceDescription(player.performanceScore, context.isUrgent),
                player.performanceScore === null ? 'violet' : scoreTone(player.performanceScore)
              )}
              <div class="vl-report-score vl-report-tone-${readinessTone(player.aiInsight.readiness)}">
                <span class="vl-report-eyebrow">Match readiness</span>
                <strong>${escapeHtml(player.aiInsight.readiness)}</strong>
                <p>${escapeHtml(getReadinessDescription(player.aiInsight.readiness))}</p>
                <div class="vl-report-progress"><i style="--progress:${readinessProgress(player.aiInsight.readiness)}%"></i></div>
              </div>
            </div>
          </div>

          <div class="vl-report-section">
            ${sectionHeading('Live telemetry', 'Snapshot at export time')}
            <div class="vl-report-vitals">${vitalCards}</div>
          </div>

          <div class="vl-report-section">
            ${sectionHeading('AI coach assessment', context.analysisTimeLabel)}
            <div class="vl-report-panel vl-report-assessment">
              <div>
                <h3>${escapeHtml(player.aiInsight.highlight || 'Gemini AI')}</h3>
                <p dir="auto">${escapeHtml(player.aiInsight.summary)}</p>
                ${player.aiInsight.subDetail ? `<small dir="auto">${escapeHtml(player.aiInsight.subDetail)}</small>` : ''}
              </div>
              <div class="vl-report-readiness">
                <span>Readiness</span>
                <strong>${escapeHtml(player.aiInsight.readiness)}</strong>
              </div>
            </div>
          </div>
        </div>
        ${reportFooter(player.name, 'Confidential performance report')}
      </section>

      <section class="vl-report-page">
        <div class="vl-report-content">
          ${reportHeader('AI Intelligence & Detail', '02 / 02')}

          <div class="vl-report-section">
            ${sectionHeading('Latest AI metrics', context.visualState.replace(/-/g, ' '))}
            <div class="vl-report-ai-grid">${latestMetrics}</div>
          </div>

          <div class="vl-report-section">
            ${sectionHeading('Operational context', context.isUrgent ? 'Coach attention recommended' : 'Monitoring active')}
            <div class="vl-report-context-grid">
              ${contextCard('Alert level', alertLabel.replace(/_/g, ' '))}
              ${contextCard('Player state', context.playerState ?? 'Pending')}
              ${contextCard('Recovery estimate', formatMinutes(context.recoveryTimeMin))}
              ${contextCard('Time to fail', formatMinutes(context.timeToFailMin))}
              ${contextCard('Freshness', context.freshnessLabel)}
              ${contextCard('Analysis state', context.visualState.replace(/-/g, ' '))}
              ${contextCard('Substitution window', context.substitutionWindow ?? 'Not specified')}
              ${contextCard('Snapshot belt', context.snapshotBeltId ?? 'Pending')}
            </div>
          </div>

          <div class="vl-report-section">
            ${sectionHeading('Key insights', `${player.aiInsight.keyPoints.length} observations`)}
            <div class="vl-report-two-column">
              <div class="vl-report-panel">
                <ul class="vl-report-insights">${insights}</ul>
              </div>
              <div class="vl-report-panel">
                <div class="vl-report-profile-list">
                  ${profileItem('Age', player.age ? `${player.age} years` : 'N/A')}
                  ${profileItem('Weight', player.weight ? `${formatDecimal(player.weight)} kg` : 'N/A')}
                  ${profileItem('Height', player.height ? `${formatDecimal(player.height)} cm` : 'N/A')}
                  ${profileItem('Preferred foot', player.foot || 'N/A')}
                  ${profileItem('Blood type', player.bloodType || 'N/A')}
                  ${profileItem('Sport / position', player.position || 'N/A')}
                  ${profileItem('Last session', player.lastSession.date || 'N/A')}
                  ${profileItem('Session duration', player.lastSession.duration ? `${player.lastSession.duration} min` : 'N/A')}
                </div>
              </div>
            </div>
          </div>

          <div class="vl-report-section">
            ${sectionHeading('Session output', player.lastSession.opponent && player.lastSession.opponent !== 'N/A' ? `vs ${player.lastSession.opponent}` : 'Latest available session')}
            <div class="vl-report-stats">${sessionStats}</div>
            <p class="vl-report-note">
              This report is a point-in-time snapshot of the VitaLink dashboard. Live telemetry and AI recommendations may change after export and should support, not replace, professional coaching or medical judgment.
            </p>
          </div>
        </div>
        ${reportFooter(player.name, `Prepared for ${coachName}`)}
      </section>
    </div>
  `;
}

function reportHeader(title: string, pageNumber: string): string {
  return `
    <header class="vl-report-header">
      <div class="vl-report-brand">
        <div class="vl-report-logo"></div>
        <div>
          <strong>VITALINK</strong>
          <span>${escapeHtml(title)}</span>
        </div>
      </div>
      <span class="vl-report-page-label">${pageNumber}</span>
    </header>
  `;
}

function reportFooter(playerName: string, label: string): string {
  return `
    <footer class="vl-report-footer">
      <span>VitaLink · ${escapeHtml(label)}</span>
      <span dir="auto">${escapeHtml(playerName)}</span>
    </footer>
  `;
}

function sectionHeading(title: string, detail: string): string {
  return `
    <div class="vl-report-section-heading">
      <h2>${escapeHtml(title)}</h2>
      <span>${escapeHtml(detail)}</span>
    </div>
  `;
}

function scoreCard(
  label: string,
  score: number | null,
  description: string,
  tone: MetricTone
): string {
  const safeScore = score === null ? 0 : clamp(score, 0, 100);
  return `
    <div class="vl-report-score vl-report-tone-${tone}">
      <span class="vl-report-eyebrow">${escapeHtml(label)}</span>
      <strong>${score === null ? '--' : Math.round(score)}${score === null ? '' : '<span>/100</span>'}</strong>
      <p>${escapeHtml(description)}</p>
      <div class="vl-report-progress"><i style="--progress:${safeScore}%"></i></div>
    </div>
  `;
}

function contextCard(label: string, value: string): string {
  return `
    <div class="vl-report-context-item">
      <span>${escapeHtml(label)}</span>
      <strong dir="auto">${escapeHtml(value)}</strong>
    </div>
  `;
}

function profileItem(label: string, value: string): string {
  return `
    <div class="vl-report-profile-item">
      <span>${escapeHtml(label)}</span>
      <strong dir="auto">${escapeHtml(value)}</strong>
    </div>
  `;
}

async function waitForReportAssets(root: HTMLElement): Promise<void> {
  const reportDocument = root.ownerDocument;

  if ('fonts' in reportDocument) {
    await reportDocument.fonts.ready;
  }

  const images = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    images.map(
      image =>
        new Promise<void>(resolve => {
          if (image.complete) {
            resolve();
            return;
          }

          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        })
    )
  );

  await new Promise<void>(resolve => {
    const reportWindow = reportDocument.defaultView;

    if (reportWindow) {
      reportWindow.requestAnimationFrame(() => resolve());
      return;
    }

    requestAnimationFrame(() => resolve());
  });
}

function safeImageSource(value: string | undefined): string {
  if (!value) return '';
  return /^(data:image\/|https?:\/\/)/i.test(value) ? value : '';
}

function buildFileName(playerName: string, date: Date): string {
  const safeName =
    playerName
      .normalize('NFKD')
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'Player';
  const datePart = date.toISOString().slice(0, 10);
  return `VitaLink-${safeName}-Report-${datePart}.pdf`;
}

function formatDateTime(value: Date): string {
  if (Number.isNaN(value.getTime())) return 'Not available';

  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(value);
}

function formatNumber(value: number): string {
  return Number.isFinite(value) ? String(Math.round(value)) : '--';
}

function formatDecimal(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : '--';
}

function formatPercent(value: number | null): string {
  return value === null || !Number.isFinite(value) ? '--' : `${Math.round(value)}%`;
}

function formatMinutes(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return 'Pending';
  if (value < 1) return '<1 min';
  return `${Math.round(value)} min`;
}

function metricAvailability(
  value: number | null,
  visualState: PlayerProfileData['aiInsight']['context']['visualState']
): string {
  if (value !== null) return 'Latest AI snapshot';
  return visualState === 'no-data' || visualState === 'loading'
    ? 'Analysis pending'
    : `State: ${visualState.replace(/-/g, ' ')}`;
}

function getHeartRateInsight(value: number): string {
  if (value > 185) return 'Max zone';
  if (value > 165) return 'High zone';
  if (value > 140) return 'Active zone';
  return 'Recovery';
}

function getSpO2Insight(value: number): string {
  if (value >= 97) return 'Optimal';
  if (value >= 94) return 'Acceptable';
  return 'Low - act';
}

function getTemperatureInsight(value: number): string {
  if (value > 38.5) return 'Heat alert';
  if (value > 37.8) return 'Elevated';
  if (value > 36.5) return 'Normal';
  return 'Low';
}

function getStressInsight(value: number): string {
  if (value > 75) return 'High load';
  if (value > 50) return 'Elevated';
  if (value > 30) return 'Manageable';
  return 'Calm';
}

function getWellnessDescription(
  score: number | null,
  recoveryTimeMin: number | null
): string {
  if (score === null) return 'Waiting for an AI recovery estimate.';
  const recovery =
    recoveryTimeMin === null ? '' : ` Recovery: ${Math.round(recoveryTimeMin)} min.`;
  if (score >= 80) return `Recovery readiness is in a good range.${recovery}`;
  if (score >= 60) return `Some recovery indicators need attention.${recovery}`;
  return `Recovery is below optimal. Monitor closely.${recovery}`;
}

function getPerformanceDescription(score: number | null, isUrgent: boolean): string {
  if (score === null) return 'Waiting for the latest AI power metric.';
  if (isUrgent) return 'Coach attention is recommended now.';
  if (score >= 80) return 'Peak performance output in this snapshot.';
  if (score >= 65) return 'Consistent performance output.';
  if (score >= 50) return 'Moderate output; continue monitoring.';
  return 'Performance output needs attention.';
}

function getReadinessDescription(readiness: PlayerProfileData['aiInsight']['readiness']): string {
  if (readiness === 'High') return 'Ready for normal training or match load.';
  if (readiness === 'Medium') return 'Review load and recovery before selection.';
  return 'Reduce exposure and assess before participation.';
}

function scoreTone(score: number): MetricTone {
  if (score >= 70) return 'lime';
  if (score >= 40) return 'amber';
  return 'danger';
}

function readinessTone(
  readiness: PlayerProfileData['aiInsight']['readiness']
): MetricTone {
  if (readiness === 'High') return 'lime';
  if (readiness === 'Medium') return 'amber';
  return 'danger';
}

function readinessProgress(
  readiness: PlayerProfileData['aiInsight']['readiness']
): number {
  if (readiness === 'High') return 90;
  if (readiness === 'Medium') return 58;
  return 28;
}

function readinessColor(
  readiness: PlayerProfileData['aiInsight']['readiness']
): string {
  if (readiness === 'High') return '#b6ff2e';
  if (readiness === 'Medium') return '#fbbf24';
  return '#fb7185';
}

function readinessBackground(
  readiness: PlayerProfileData['aiInsight']['readiness']
): string {
  if (readiness === 'High') return 'rgba(182,255,46,0.08)';
  if (readiness === 'Medium') return 'rgba(251,191,36,0.08)';
  return 'rgba(251,113,133,0.09)';
}

function readinessBorder(
  readiness: PlayerProfileData['aiInsight']['readiness']
): string {
  if (readiness === 'High') return 'rgba(182,255,46,0.22)';
  if (readiness === 'Medium') return 'rgba(251,191,36,0.22)';
  return 'rgba(251,113,133,0.24)';
}

function getStatusTone(
  status: PlayerProfileData['status'],
  isUrgent: boolean
): MetricTone {
  if (isUrgent || status === 'critical') return 'danger';
  if (status === 'moderate') return 'amber';
  return 'lime';
}

function getAlertTone(alertLevel: string | null, isUrgent: boolean): MetricTone {
  if (isUrgent || alertLevel?.toUpperCase() === 'CRITICAL') return 'danger';
  if (
    alertLevel?.toUpperCase() === 'WARNING' ||
    alertLevel?.toUpperCase() === 'STALE'
  ) {
    return 'amber';
  }
  if (alertLevel?.toUpperCase() === 'WARMUP') return 'cyan';
  return alertLevel ? 'lime' : 'violet';
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .map(part => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    character =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
      })[character] ?? character
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
