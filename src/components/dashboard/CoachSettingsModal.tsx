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
  Bell,
  ChevronDown,
  MoonStar,
  Settings2,
  UsersRound,
  X,
} from 'lucide-react';

export interface CoachSettings {
  notificationsEnabled: boolean;
  syncSystemTheme: boolean;
  defaultTeamView: string;
}

interface CoachSettingsModalProps {
  isOpen: boolean;
  coachName: string;
  role?: string;
  initialSettings?: CoachSettings;
  onClose: () => void;
  onSave?: (settings: CoachSettings) => void;
}

const DEFAULT_SETTINGS: CoachSettings = {
  notificationsEnabled: true,
  syncSystemTheme: true,
  defaultTeamView: 'all-athletes',
};

interface PreferenceRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const PreferenceRow: React.FC<PreferenceRowProps> = ({
  icon,
  title,
  description,
  checked,
  onChange,
}) => (
  <div className="vl-settings__preference">
    <div className="vl-settings__preference-copy">
      <span className="vl-settings__icon" aria-hidden="true">{icon}</span>
      <span>
        <span className="vl-settings__preference-title">{title}</span>
        <span className="vl-settings__preference-description">{description}</span>
      </span>
    </div>
    <Switch
      checked={checked}
      onChange={onChange}
      className={`vl-settings__switch ${checked ? 'vl-settings__switch--active' : ''}`}
    >
      <span className="sr-only">Toggle {title}</span>
      <span className="vl-settings__switch-thumb" />
    </Switch>
  </div>
);

export const CoachSettingsModal: React.FC<CoachSettingsModalProps> = ({
  isOpen,
  coachName,
  role = 'Head Coach',
  initialSettings = DEFAULT_SETTINGS,
  onClose,
  onSave,
}) => {
  const [settings, setSettings] = useState<CoachSettings>(initialSettings);

  useEffect(() => {
    if (isOpen) {
      setSettings(initialSettings);
    }
  }, [initialSettings, isOpen]);

  const initials = coachName
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'C';

  const handleSave = () => {
    onSave?.(settings);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="vl-settings">
      <DialogBackdrop transition className="vl-settings__backdrop" />

      <div className="vl-settings__viewport">
        <div className="vl-settings__positioner">
          <DialogPanel transition className="vl-settings__panel">
            <header className="vl-settings__header">
              <div className="vl-settings__heading">
                <span className="vl-settings__heading-icon" aria-hidden="true">
                  <Settings2 size={17} strokeWidth={1.8} />
                </span>
                <div>
                  <DialogTitle className="vl-settings__title">Coach Settings</DialogTitle>
                  <p className="vl-settings__subtitle">
                    Manage your dashboard preferences and active workspace.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="vl-settings__close"
                onClick={onClose}
                aria-label="Close coach settings"
              >
                <X size={17} strokeWidth={1.8} />
              </button>
            </header>

            <div className="vl-settings__content">
              <section className="vl-settings__section" aria-labelledby="profile-overview-title">
                <div className="vl-settings__section-heading">
                  <div>
                    <h3 id="profile-overview-title">Profile Overview</h3>
                    <p>Your account identity across the coaching dashboard.</p>
                  </div>
                  <span className="vl-settings__status">Active</span>
                </div>

                <div className="vl-settings__profile">
                  <div className="vl-settings__avatar" aria-label={`${coachName} avatar placeholder`}>
                    {initials}
                  </div>
                  <div className="vl-settings__profile-details">
                    <span className="vl-settings__profile-name">{coachName}</span>
                    <span className="vl-settings__profile-role">{role}</span>
                  </div>
                  <span className="vl-settings__profile-badge">Coach account</span>
                </div>
              </section>

              <section className="vl-settings__section" aria-labelledby="account-preferences-title">
                <div className="vl-settings__section-heading">
                  <div>
                    <h3 id="account-preferences-title">Account Preferences</h3>
                    <p>Choose how the dashboard behaves for this account.</p>
                  </div>
                </div>

                <div className="vl-settings__preference-list">
                  <PreferenceRow
                    icon={<Bell size={16} strokeWidth={1.8} />}
                    title="Notification Preferences"
                    description="Receive alerts for player status and session updates."
                    checked={settings.notificationsEnabled}
                    onChange={notificationsEnabled => {
                      setSettings(current => ({ ...current, notificationsEnabled }));
                    }}
                  />
                  <PreferenceRow
                    icon={<MoonStar size={16} strokeWidth={1.8} />}
                    title="Sync System Theme"
                    description="Match the dashboard appearance to your device theme."
                    checked={settings.syncSystemTheme}
                    onChange={syncSystemTheme => {
                      setSettings(current => ({ ...current, syncSystemTheme }));
                    }}
                  />
                </div>
              </section>

              <section className="vl-settings__section" aria-labelledby="session-controls-title">
                <div className="vl-settings__section-heading">
                  <div>
                    <h3 id="session-controls-title">Session Controls</h3>
                    <p>Set the view that opens when you start a coaching session.</p>
                  </div>
                </div>

                <label className="vl-settings__field">
                  <span className="vl-settings__field-label">
                    <UsersRound size={15} strokeWidth={1.8} aria-hidden="true" />
                    Default Team View
                  </span>
                  <span className="vl-settings__select-wrap">
                    <select
                      value={settings.defaultTeamView}
                      onChange={event => {
                        setSettings(current => ({
                          ...current,
                          defaultTeamView: event.target.value,
                        }));
                      }}
                    >
                      <option value="all-athletes">All Athletes</option>
                      <option value="performance-status">Performance Status</option>
                      <option value="training-groups">Active Training Groups</option>
                    </select>
                    <ChevronDown size={16} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </label>
              </section>
            </div>

            <footer className="vl-settings__footer">
              <p>Settings are saved for this dashboard session.</p>
              <div className="vl-settings__actions">
                <button type="button" className="vl-settings__button vl-settings__button--secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="button" className="vl-settings__button vl-settings__button--primary" onClick={handleSave}>
                  Save Changes
                </button>
              </div>
            </footer>
          </DialogPanel>
        </div>
      </div>

      <style>{`
        .vl-settings {
          position: relative;
          z-index: 300;
          font-family: 'DM Sans', sans-serif;
        }

        .vl-settings__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 6, 18, 0.78);
          backdrop-filter: blur(13px) saturate(115%);
          -webkit-backdrop-filter: blur(13px) saturate(115%);
          transition: opacity 220ms ease;
        }
        .vl-settings__backdrop[data-closed] { opacity: 0; }

        .vl-settings__viewport {
          position: fixed;
          inset: 0;
          overflow-y: auto;
          padding: 14px;
        }

        .vl-settings__positioner {
          display: flex;
          min-height: 100%;
          align-items: center;
          justify-content: center;
        }

        .vl-settings__panel {
          width: min(100%, 620px);
          max-height: calc(100vh - 28px);
          overflow: hidden;
          color: #F8FAFC;
          background:
            radial-gradient(circle at 100% 0%, rgba(182,255,46,0.075), transparent 30%),
            linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.025) 46%),
            rgba(8,14,28,0.96);
          border: 0.5px solid rgba(255,255,255,0.15);
          border-radius: 24px;
          box-shadow:
            0 32px 100px rgba(0,0,0,0.58),
            inset 0 1px 0 rgba(255,255,255,0.11);
          backdrop-filter: blur(24px) saturate(128%);
          -webkit-backdrop-filter: blur(24px) saturate(128%);
          transition: opacity 220ms ease, transform 220ms ease;
        }
        .vl-settings__panel[data-closed] {
          opacity: 0;
          transform: translateY(12px) scale(0.975);
        }

        .vl-settings__header,
        .vl-settings__footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 20px 22px;
        }

        .vl-settings__header {
          border-bottom: 0.5px solid rgba(255,255,255,0.08);
        }

        .vl-settings__heading {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .vl-settings__heading-icon,
        .vl-settings__icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: #B6FF2E;
          background: rgba(182,255,46,0.08);
          border: 0.5px solid rgba(182,255,46,0.2);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.07);
        }

        .vl-settings__heading-icon {
          width: 36px;
          height: 36px;
          border-radius: 12px;
        }

        .vl-settings__title {
          margin: 0;
          color: #F8FAFC;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: .035em;
          line-height: 1;
        }

        .vl-settings__subtitle {
          margin: 5px 0 0;
          color: rgba(255,255,255,0.42);
          font-size: 11px;
          line-height: 1.45;
        }

        .vl-settings__close {
          display: inline-flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: rgba(255,255,255,0.48);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.075), rgba(255,255,255,0.025)),
            rgba(11,18,32,0.62);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: 11px;
          cursor: pointer;
          transition: color .18s ease, border-color .18s ease, background .18s ease;
        }
        .vl-settings__close:hover {
          color: #F8FAFC;
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
        }
        .vl-settings__close:focus-visible,
        .vl-settings__button:focus-visible,
        .vl-settings__switch:focus-visible,
        .vl-settings__field select:focus-visible {
          outline: 2px solid rgba(182,255,46,0.72);
          outline-offset: 2px;
        }

        .vl-settings__content {
          display: flex;
          max-height: calc(100vh - 190px);
          flex-direction: column;
          gap: 12px;
          overflow-y: auto;
          padding: 16px 22px 18px;
          scrollbar-width: thin;
          scrollbar-color: rgba(182,255,46,0.22) transparent;
        }

        .vl-settings__section {
          padding: 16px;
          background:
            linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.018)),
            rgba(11,18,32,0.55);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 17px;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.055);
        }

        .vl-settings__section-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 14px;
        }
        .vl-settings__section-heading h3 {
          margin: 0;
          color: rgba(255,255,255,0.92);
          font-size: 13px;
          font-weight: 650;
          letter-spacing: .01em;
        }
        .vl-settings__section-heading p {
          margin: 4px 0 0;
          color: rgba(255,255,255,0.34);
          font-size: 10px;
          line-height: 1.45;
        }

        .vl-settings__status {
          padding: 4px 8px;
          color: #B6FF2E;
          background: rgba(182,255,46,0.07);
          border: 0.5px solid rgba(182,255,46,0.18);
          border-radius: 999px;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .vl-settings__profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.025);
          border: 0.5px solid rgba(255,255,255,0.065);
          border-radius: 14px;
        }

        .vl-settings__avatar {
          display: flex;
          width: 46px;
          height: 46px;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
          color: #B6FF2E;
          background:
            radial-gradient(circle at 35% 28%, rgba(255,255,255,0.18), transparent 36%),
            rgba(182,255,46,0.095);
          border: 0.5px solid rgba(182,255,46,0.28);
          border-radius: 15px;
          box-shadow: 0 0 20px rgba(182,255,46,0.08);
          font-size: 13px;
          font-weight: 750;
          letter-spacing: .04em;
        }

        .vl-settings__profile-details {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
          gap: 3px;
        }

        .vl-settings__profile-name {
          overflow: hidden;
          color: #F8FAFC;
          font-size: 13px;
          font-weight: 650;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .vl-settings__profile-role {
          color: rgba(255,255,255,0.38);
          font-size: 10px;
        }

        .vl-settings__profile-badge {
          color: rgba(255,255,255,0.36);
          font-size: 9px;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .vl-settings__preference-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .vl-settings__preference {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 11px 12px;
          background: rgba(255,255,255,0.022);
          border: 0.5px solid rgba(255,255,255,0.06);
          border-radius: 14px;
        }

        .vl-settings__preference-copy {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 10px;
        }

        .vl-settings__icon {
          width: 31px;
          height: 31px;
          border-radius: 10px;
        }

        .vl-settings__preference-title,
        .vl-settings__preference-description {
          display: block;
        }

        .vl-settings__preference-title {
          color: rgba(255,255,255,0.86);
          font-size: 11px;
          font-weight: 600;
        }

        .vl-settings__preference-description {
          margin-top: 3px;
          color: rgba(255,255,255,0.32);
          font-size: 9px;
          line-height: 1.4;
        }

        .vl-settings__switch {
          position: relative;
          width: 38px;
          height: 22px;
          flex: 0 0 auto;
          padding: 0;
          background: rgba(255,255,255,0.08);
          border: 0.5px solid rgba(255,255,255,0.11);
          border-radius: 999px;
          cursor: pointer;
          transition: background .2s ease, border-color .2s ease;
        }

        .vl-settings__switch--active {
          background: rgba(182,255,46,0.16);
          border-color: rgba(182,255,46,0.3);
        }

        .vl-settings__switch-thumb {
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

        .vl-settings__switch--active .vl-settings__switch-thumb {
          background: #B6FF2E;
          transform: translateX(16px);
        }

        .vl-settings__field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .vl-settings__field-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: rgba(255,255,255,0.52);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .035em;
        }

        .vl-settings__field-label svg { color: #B6FF2E; }

        .vl-settings__select-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .vl-settings__field select {
          width: 100%;
          appearance: none;
          padding: 10px 38px 10px 12px;
          color: rgba(255,255,255,0.86);
          background: rgba(255,255,255,0.035);
          border: 0.5px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          cursor: pointer;
          font: inherit;
          font-size: 11px;
          transition: border-color .18s ease, background .18s ease;
        }

        .vl-settings__field select:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.15);
        }

        .vl-settings__select-wrap > svg {
          position: absolute;
          right: 12px;
          color: rgba(255,255,255,0.36);
          pointer-events: none;
        }

        .vl-settings__footer {
          border-top: 0.5px solid rgba(255,255,255,0.08);
        }

        .vl-settings__footer p {
          margin: 0;
          color: rgba(255,255,255,0.28);
          font-size: 9px;
        }

        .vl-settings__actions {
          display: flex;
          gap: 8px;
        }

        .vl-settings__button {
          padding: 9px 14px;
          border-radius: 11px;
          cursor: pointer;
          font: inherit;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .035em;
          transition: transform .18s ease, background .18s ease, border-color .18s ease;
        }

        .vl-settings__button:hover { transform: translateY(-1px); }

        .vl-settings__button--secondary {
          color: rgba(255,255,255,0.58);
          background: rgba(255,255,255,0.035);
          border: 0.5px solid rgba(255,255,255,0.09);
        }
        .vl-settings__button--secondary:hover {
          color: #F8FAFC;
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.16);
        }

        .vl-settings__button--primary {
          color: #B6FF2E;
          background:
            linear-gradient(180deg, rgba(182,255,46,0.14), rgba(182,255,46,0.045)),
            rgba(11,18,32,0.68);
          border: 0.5px solid rgba(182,255,46,0.25);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 24px rgba(0,0,0,0.18);
        }
        .vl-settings__button--primary:hover {
          background:
            linear-gradient(180deg, rgba(182,255,46,0.19), rgba(182,255,46,0.065)),
            rgba(11,18,32,0.78);
          border-color: rgba(182,255,46,0.36);
        }

        @media (max-width: 520px) {
          .vl-settings__viewport { padding: 8px; }
          .vl-settings__positioner { align-items: flex-end; }
          .vl-settings__panel {
            max-height: calc(100vh - 8px);
            border-radius: 22px 22px 16px 16px;
          }
          .vl-settings__header,
          .vl-settings__footer { padding: 16px; }
          .vl-settings__content {
            max-height: calc(100vh - 172px);
            padding: 12px 16px 14px;
          }
          .vl-settings__subtitle { display: none; }
          .vl-settings__profile-badge,
          .vl-settings__footer p { display: none; }
          .vl-settings__footer { justify-content: flex-end; }
          .vl-settings__actions { width: 100%; }
          .vl-settings__button { flex: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .vl-settings__backdrop,
          .vl-settings__panel,
          .vl-settings__switch,
          .vl-settings__switch-thumb,
          .vl-settings__button {
            transition: none;
          }
        }
      `}</style>
    </Dialog>
  );
};
