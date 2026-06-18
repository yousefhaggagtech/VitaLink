'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Switch,
} from '@headlessui/react';
import {
  BellRing,
  Camera,
  CircleUserRound,
  Mail,
  Radio,
  Settings2,
  Unplug,
  X,
} from 'lucide-react';

export interface PlayerSettings {
  playerName: string;
  registeredId: string;
  realtimeAlerts: boolean;
  weeklyReports: boolean;
  hardwareSync: boolean;
}

interface PlayerSettingsModalProps {
  isOpen: boolean;
  initials: string;
  isConnected?: boolean;
  initialSettings: PlayerSettings;
  onClose: () => void;
  onSave: (settings: PlayerSettings) => void;
}

interface ToggleRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleRow: React.FC<ToggleRowProps> = ({
  icon,
  title,
  description,
  checked,
  onChange,
}) => (
  <div className="vl-player-settings__toggle-row">
    <span className="vl-player-settings__row-icon" aria-hidden="true">
      {icon}
    </span>
    <span className="vl-player-settings__toggle-copy">
      <span className="vl-player-settings__toggle-title">{title}</span>
      <span className="vl-player-settings__toggle-description">{description}</span>
    </span>
    <Switch
      checked={checked}
      onChange={onChange}
      className={`vl-player-settings__switch ${
        checked ? 'vl-player-settings__switch--active' : ''
      }`}
    >
      <span className="vl-player-settings__sr-only">Toggle {title}</span>
      <span className="vl-player-settings__switch-thumb" />
    </Switch>
  </div>
);

export const PlayerSettingsModal: React.FC<PlayerSettingsModalProps> = ({
  isOpen,
  initials,
  isConnected = true,
  initialSettings,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<PlayerSettings>(initialSettings);

  useEffect(() => {
    if (isOpen) {
      setSettings(initialSettings);
    }
  }, [initialSettings, isOpen]);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="vl-player-settings">
      <DialogBackdrop transition className="vl-player-settings__backdrop" />

      <div className="vl-player-settings__viewport">
        <div className="vl-player-settings__positioner">
          <DialogPanel transition className="vl-player-settings__panel">
            <header className="vl-player-settings__header">
              <div className="vl-player-settings__heading">
                <span className="vl-player-settings__heading-icon" aria-hidden="true">
                  <Settings2 size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <DialogTitle className="vl-player-settings__title">
                    Player Settings
                  </DialogTitle>
                  <p className="vl-player-settings__subtitle">
                    Manage identity, alerts, reports, and connected hardware.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="vl-player-settings__close"
                onClick={onClose}
                aria-label="Close player settings"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </header>

            <div className="vl-player-settings__content">
              <section
                className="vl-player-settings__section"
                aria-labelledby="player-identity-title"
              >
                <div className="vl-player-settings__section-heading">
                  <div>
                    <h3 id="player-identity-title">Profile &amp; Identity</h3>
                    <p>Basic details used across reports and live sessions.</p>
                  </div>
                  <CircleUserRound size={17} aria-hidden="true" />
                </div>

                <div className="vl-player-settings__identity">
                  <div className="vl-player-settings__avatar-wrap">
                    <div
                      className="vl-player-settings__avatar"
                      aria-label={`${settings.playerName || 'Player'} avatar placeholder`}
                    >
                      {initials || 'P'}
                    </div>
                    <span className="vl-player-settings__avatar-badge" aria-hidden="true">
                      <Camera size={11} />
                    </span>
                  </div>

                  <div className="vl-player-settings__fields">
                    <label className="vl-player-settings__field">
                      <span>Player Name</span>
                      <input
                        type="text"
                        value={settings.playerName}
                        onChange={event => {
                          setSettings(current => ({
                            ...current,
                            playerName: event.target.value,
                          }));
                        }}
                        placeholder="Player name"
                      />
                    </label>

                    <label className="vl-player-settings__field">
                      <span>Registered Jersey / Belt ID</span>
                      <input
                        type="text"
                        value={settings.registeredId}
                        onChange={event => {
                          setSettings(current => ({
                            ...current,
                            registeredId: event.target.value,
                          }));
                        }}
                        placeholder="Jersey number or belt ID"
                      />
                    </label>
                  </div>
                </div>
              </section>

              <section
                className="vl-player-settings__section"
                aria-labelledby="player-preferences-title"
              >
                <div className="vl-player-settings__section-heading">
                  <div>
                    <h3 id="player-preferences-title">Preferences</h3>
                    <p>Choose how this player&apos;s updates are delivered.</p>
                  </div>
                </div>

                <div className="vl-player-settings__toggle-list">
                  <ToggleRow
                    icon={<BellRing size={16} strokeWidth={1.8} />}
                    title="Enable Real-time Alerts"
                    description="Show immediate alerts when live readings need attention."
                    checked={settings.realtimeAlerts}
                    onChange={realtimeAlerts => {
                      setSettings(current => ({ ...current, realtimeAlerts }));
                    }}
                  />
                  <ToggleRow
                    icon={<Mail size={16} strokeWidth={1.8} />}
                    title="Receive Weekly Reports via Email"
                    description="Send a compact weekly performance summary to the coaching team."
                    checked={settings.weeklyReports}
                    onChange={weeklyReports => {
                      setSettings(current => ({ ...current, weeklyReports }));
                    }}
                  />
                </div>
              </section>

              <section
                className="vl-player-settings__section"
                aria-labelledby="connection-status-title"
              >
                <div className="vl-player-settings__section-heading">
                  <div>
                    <h3 id="connection-status-title">Connection Status</h3>
                    <p>Telemetry and wearable synchronization preferences.</p>
                  </div>
                  <span
                    className={`vl-player-settings__status ${
                      isConnected ? '' : 'vl-player-settings__status--offline'
                    }`}
                  >
                    <span />
                    {isConnected ? 'Connected' : 'Offline'}
                  </span>
                </div>

                <div className="vl-player-settings__connection">
                  <div className="vl-player-settings__device">
                    <span className="vl-player-settings__device-icon" aria-hidden="true">
                      {isConnected
                        ? <Radio size={17} strokeWidth={1.8} />
                        : <Unplug size={17} strokeWidth={1.8} />}
                    </span>
                    <span>
                      <strong>Player telemetry</strong>
                      <small>
                        {isConnected
                          ? 'Live sensor stream is available.'
                          : 'Waiting for the registered wearable.'}
                      </small>
                    </span>
                  </div>

                  <ToggleRow
                    icon={<Radio size={16} strokeWidth={1.8} />}
                    title="Automatic Hardware Sync"
                    description="Reconnect and sync the registered wearable when available."
                    checked={settings.hardwareSync}
                    onChange={hardwareSync => {
                      setSettings(current => ({ ...current, hardwareSync }));
                    }}
                  />
                </div>
              </section>
            </div>

            <footer className="vl-player-settings__footer">
              <p>Changes are saved for this dashboard session.</p>
              <div className="vl-player-settings__actions">
                <button
                  type="button"
                  className="vl-player-settings__button vl-player-settings__button--secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="vl-player-settings__button vl-player-settings__button--primary"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </footer>
          </DialogPanel>
        </div>
      </div>

      <style>{`
        .vl-player-settings {
          --vps-bg: #080e1c;
          --vps-panel: rgba(11,18,32,0.72);
          --vps-text: #f8fafc;
          --vps-soft: rgba(255,255,255,0.68);
          --vps-muted: rgba(255,255,255,0.38);
          --vps-border: rgba(255,255,255,0.09);
          --vps-lime: #b6ff2e;
          position: relative;
          z-index: 320;
          font-family: 'DM Sans', sans-serif;
        }

        .vl-player-settings__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3,6,18,0.78);
          backdrop-filter: blur(13px) saturate(115%);
          -webkit-backdrop-filter: blur(13px) saturate(115%);
          transition: opacity 220ms ease;
        }
        .vl-player-settings__backdrop[data-closed] { opacity: 0; }

        .vl-player-settings__viewport {
          position: fixed;
          inset: 0;
          overflow-y: auto;
          padding: 16px;
        }

        .vl-player-settings__positioner {
          display: flex;
          min-height: 100%;
          align-items: center;
          justify-content: center;
        }

        .vl-player-settings__panel {
          width: min(100%, 660px);
          max-height: calc(100vh - 32px);
          overflow: hidden;
          color: var(--vps-text);
          background:
            radial-gradient(circle at 100% 0%, rgba(182,255,46,0.075), transparent 32%),
            linear-gradient(145deg, rgba(255,255,255,0.075), rgba(255,255,255,0.02) 46%),
            rgba(8,14,28,0.97);
          border: 0.5px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          box-shadow:
            0 34px 110px rgba(0,0,0,0.62),
            inset 0 1px 0 rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(128%);
          -webkit-backdrop-filter: blur(24px) saturate(128%);
          transition: opacity 220ms ease, transform 220ms ease;
        }
        .vl-player-settings__panel[data-closed] {
          opacity: 0;
          transform: translateY(14px) scale(0.975);
        }

        .vl-player-settings__header,
        .vl-player-settings__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 22px;
        }

        .vl-player-settings__header {
          border-bottom: 0.5px solid var(--vps-border);
        }

        .vl-player-settings__heading {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 12px;
        }

        .vl-player-settings__heading-icon,
        .vl-player-settings__row-icon,
        .vl-player-settings__device-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: var(--vps-lime);
          background: rgba(182,255,46,0.08);
          border: 0.5px solid rgba(182,255,46,0.2);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .vl-player-settings__heading-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
        }

        .vl-player-settings__title {
          margin: 0;
          color: var(--vps-text);
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 25px;
          font-weight: 700;
          letter-spacing: .035em;
          line-height: 1;
        }

        .vl-player-settings__subtitle {
          margin: 5px 0 0;
          color: var(--vps-muted);
          font-size: 11px;
          line-height: 1.45;
        }

        .vl-player-settings__close {
          display: inline-flex;
          width: 35px;
          height: 35px;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: rgba(255,255,255,0.48);
          background: rgba(255,255,255,0.04);
          border: 0.5px solid var(--vps-border);
          border-radius: 11px;
          cursor: pointer;
          transition: color .18s ease, background .18s ease, border-color .18s ease;
        }
        .vl-player-settings__close:hover {
          color: var(--vps-text);
          background: rgba(255,255,255,0.08);
          border-color: rgba(255,255,255,0.17);
        }

        .vl-player-settings__content {
          display: flex;
          max-height: calc(100vh - 190px);
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          padding: 16px 22px 18px;
          scrollbar-width: thin;
          scrollbar-color: rgba(182,255,46,0.22) transparent;
        }

        .vl-player-settings__section {
          padding: 16px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.047), rgba(255,255,255,0.016)),
            rgba(11,18,32,0.56);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 17px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
        }

        .vl-player-settings__section-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .vl-player-settings__section-heading h3 {
          margin: 0;
          color: rgba(255,255,255,0.92);
          font-size: 13px;
          font-weight: 650;
          letter-spacing: .01em;
        }
        .vl-player-settings__section-heading p {
          margin: 4px 0 0;
          color: rgba(255,255,255,0.34);
          font-size: 10px;
          line-height: 1.45;
        }
        .vl-player-settings__section-heading > svg {
          color: rgba(182,255,46,0.68);
        }

        .vl-player-settings__identity {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 16px;
        }

        .vl-player-settings__avatar-wrap {
          position: relative;
        }

        .vl-player-settings__avatar {
          display: flex;
          width: 70px;
          height: 70px;
          align-items: center;
          justify-content: center;
          color: var(--vps-lime);
          background:
            radial-gradient(circle at 35% 28%, rgba(255,255,255,0.2), transparent 36%),
            rgba(182,255,46,0.095);
          border: 0.5px solid rgba(182,255,46,0.28);
          border-radius: 20px;
          box-shadow: 0 0 24px rgba(182,255,46,0.08);
          font-size: 17px;
          font-weight: 750;
          letter-spacing: .04em;
        }

        .vl-player-settings__avatar-badge {
          position: absolute;
          right: -5px;
          bottom: -5px;
          display: flex;
          width: 24px;
          height: 24px;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.64);
          background: #111a2b;
          border: 2px solid #0b1220;
          border-radius: 9px;
        }

        .vl-player-settings__fields {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .vl-player-settings__field {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 7px;
        }
        .vl-player-settings__field > span {
          color: rgba(255,255,255,0.48);
          font-size: 9px;
          font-weight: 650;
          letter-spacing: .05em;
          text-transform: uppercase;
        }
        .vl-player-settings__field input {
          min-width: 0;
          width: 100%;
          padding: 10px 11px;
          color: rgba(255,255,255,0.88);
          background: rgba(255,255,255,0.032);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: 11px;
          font: inherit;
          font-size: 11px;
          transition: background .18s ease, border-color .18s ease;
        }
        .vl-player-settings__field input:hover {
          background: rgba(255,255,255,0.045);
          border-color: rgba(255,255,255,0.14);
        }

        .vl-player-settings__toggle-list,
        .vl-player-settings__connection {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vl-player-settings__toggle-row,
        .vl-player-settings__device {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          background: rgba(255,255,255,0.022);
          border: 0.5px solid rgba(255,255,255,0.06);
          border-radius: 14px;
        }

        .vl-player-settings__row-icon,
        .vl-player-settings__device-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
        }

        .vl-player-settings__toggle-copy {
          min-width: 0;
          flex: 1;
        }

        .vl-player-settings__toggle-title,
        .vl-player-settings__toggle-description {
          display: block;
        }
        .vl-player-settings__toggle-title,
        .vl-player-settings__device strong {
          color: rgba(255,255,255,0.86);
          font-size: 11px;
          font-weight: 600;
        }
        .vl-player-settings__toggle-description,
        .vl-player-settings__device small {
          display: block;
          margin-top: 3px;
          color: rgba(255,255,255,0.32);
          font-size: 9px;
          font-weight: 400;
          line-height: 1.4;
        }

        .vl-player-settings__switch {
          position: relative;
          width: 39px;
          height: 22px;
          flex: 0 0 auto;
          padding: 0;
          background: rgba(255,255,255,0.08);
          border: 0.5px solid rgba(255,255,255,0.11);
          border-radius: 999px;
          cursor: pointer;
          transition: background .2s ease, border-color .2s ease;
        }
        .vl-player-settings__switch--active {
          background: rgba(182,255,46,0.16);
          border-color: rgba(182,255,46,0.3);
        }
        .vl-player-settings__switch-thumb {
          position: absolute;
          top: 3px;
          left: 3px;
          width: 15px;
          height: 15px;
          background: rgba(255,255,255,0.58);
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.28);
          transition: transform .2s ease, background .2s ease;
        }
        .vl-player-settings__switch--active .vl-player-settings__switch-thumb {
          background: var(--vps-lime);
          transform: translateX(17px);
        }

        .vl-player-settings__status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 8px;
          color: var(--vps-lime);
          background: rgba(182,255,46,0.07);
          border: 0.5px solid rgba(182,255,46,0.18);
          border-radius: 999px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
          white-space: nowrap;
        }
        .vl-player-settings__status > span {
          width: 6px;
          height: 6px;
          background: currentColor;
          border-radius: 50%;
          box-shadow: 0 0 8px currentColor;
        }
        .vl-player-settings__status--offline {
          color: rgba(255,255,255,0.42);
          background: rgba(255,255,255,0.035);
          border-color: rgba(255,255,255,0.09);
        }

        .vl-player-settings__device {
          border-color: rgba(182,255,46,0.1);
        }
        .vl-player-settings__device > span:last-child {
          min-width: 0;
          flex: 1;
        }

        .vl-player-settings__footer {
          border-top: 0.5px solid var(--vps-border);
        }
        .vl-player-settings__footer p {
          margin: 0;
          color: rgba(255,255,255,0.28);
          font-size: 9px;
        }

        .vl-player-settings__actions {
          display: flex;
          gap: 8px;
        }

        .vl-player-settings__button {
          padding: 9px 14px;
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .035em;
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }
        .vl-player-settings__button:hover { transform: translateY(-1px); }
        .vl-player-settings__button--secondary {
          color: rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.035);
          border: 0.5px solid rgba(255,255,255,0.09);
        }
        .vl-player-settings__button--secondary:hover {
          color: var(--vps-text);
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.16);
        }
        .vl-player-settings__button--primary {
          color: var(--vps-lime);
          background:
            linear-gradient(180deg, rgba(182,255,46,0.14), rgba(182,255,46,0.045)),
            rgba(11,18,32,0.68);
          border: 0.5px solid rgba(182,255,46,0.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.18);
        }
        .vl-player-settings__button--primary:hover {
          background:
            linear-gradient(180deg, rgba(182,255,46,0.19), rgba(182,255,46,0.065)),
            rgba(11,18,32,0.78);
          border-color: rgba(182,255,46,0.36);
        }

        .vl-player-settings__close:focus-visible,
        .vl-player-settings__field input:focus-visible,
        .vl-player-settings__switch:focus-visible,
        .vl-player-settings__button:focus-visible {
          outline: 2px solid rgba(182,255,46,0.72);
          outline-offset: 2px;
        }

        .vl-player-settings__sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        @media (max-width: 600px) {
          .vl-player-settings__viewport { padding: 8px; }
          .vl-player-settings__positioner { align-items: flex-end; }
          .vl-player-settings__panel {
            max-height: calc(100vh - 8px);
            border-radius: 22px 22px 16px 16px;
          }
          .vl-player-settings__header,
          .vl-player-settings__footer { padding: 16px; }
          .vl-player-settings__content {
            max-height: calc(100vh - 172px);
            padding: 12px 16px 14px;
          }
          .vl-player-settings__identity {
            grid-template-columns: 1fr;
          }
          .vl-player-settings__avatar-wrap {
            width: max-content;
          }
          .vl-player-settings__fields {
            grid-template-columns: 1fr;
          }
          .vl-player-settings__subtitle,
          .vl-player-settings__footer p { display: none; }
          .vl-player-settings__footer { justify-content: flex-end; }
          .vl-player-settings__actions { width: 100%; }
          .vl-player-settings__button { flex: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vl-player-settings__backdrop,
          .vl-player-settings__panel,
          .vl-player-settings__switch,
          .vl-player-settings__switch-thumb,
          .vl-player-settings__button {
            transition: none;
          }
        }
      `}</style>
    </Dialog>
  );
};
