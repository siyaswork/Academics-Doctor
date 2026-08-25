import React, { useState } from 'react';
import { UserPreferences } from '../../types/preferences';
import { EDUCATION_LEVELS, STUDY_SESSION_PRESETS } from '../../utils/constants';
import styles from './Preferences.module.css';

interface SettingsPageProps {
  preferences: UserPreferences;
  onAppearanceChange: (theme: 'light' | 'dark' | 'system', reducedMotion: boolean) => void;
  onWorkspaceChange: (updates: any) => void;
  onStudyChange: (updates: any) => void;
  onExport?: () => void;
  onClear?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  preferences,
  onAppearanceChange,
  onWorkspaceChange,
  onStudyChange,
  onExport,
  onClear,
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('appearance');

  return (
    <div className={styles.settingsPage}>
      <div className={styles.settingsContainer}>
        <h1>Settings</h1>

        {/* Appearance Section */}
        <div className={styles.settingsSection}>
          <div
            className={styles.sectionHeader}
            onClick={() => setExpandedSection(expandedSection === 'appearance' ? null : 'appearance')}
          >
            <span>🎨 Appearance</span>
            <span className={styles.toggleIcon}>{expandedSection === 'appearance' ? '▼' : '▶'}</span>
          </div>
          {expandedSection === 'appearance' && (
            <div className={styles.sectionContent}>
              <div className={styles.settingItem}>
                <label>Theme</label>
                <div className={styles.themeOptions}>
                  {['light', 'dark', 'system'].map(theme => (
                    <button
                      key={theme}
                      className={`${styles.themeButton} ${preferences.appearance.theme === theme ? styles.active : ''}`}
                      onClick={() => onAppearanceChange(theme as any, preferences.appearance.reducedMotion)}
                    >
                      {theme === 'light' && '☀️ Light'}
                      {theme === 'dark' && '🌙 Dark'}
                      {theme === 'system' && '💻 System'}
                    </button>
                  ))}
                </div>
              </div>
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.appearance.reducedMotion}
                    onChange={e => onAppearanceChange(preferences.appearance.theme, e.target.checked)}
                  />
                  Reduce motion
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Workspace Section */}
        <div className={styles.settingsSection}>
          <div
            className={styles.sectionHeader}
            onClick={() => setExpandedSection(expandedSection === 'workspace' ? null : 'workspace')}
          >
            <span>🔧 Workspace</span>
            <span className={styles.toggleIcon}>{expandedSection === 'workspace' ? '▼' : '▶'}</span>
          </div>
          {expandedSection === 'workspace' && (
            <div className={styles.sectionContent}>
              <div className={styles.settingItem}>
                <label>Dashboard Layout</label>
                <select
                  value={preferences.workspace.dashboardLayout}
                  onChange={e => onWorkspaceChange({ dashboardLayout: e.target.value })}
                >
                  <option value="compact">Compact</option>
                  <option value="comfortable">Comfortable</option>
                  <option value="spacious">Spacious</option>
                </select>
              </div>
              <div className={styles.settingItem}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={preferences.workspace.favoritesSectionEnabled}
                    onChange={e => onWorkspaceChange({ favoritesSectionEnabled: e.target.checked })}
                  />
                  Show favorites section
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Study Section */}
        <div className={styles.settingsSection}>
          <div
            className={styles.sectionHeader}
            onClick={() => setExpandedSection(expandedSection === 'study' ? null : 'study')}
          >
            <span>📚 Study</span>
            <span className={styles.toggleIcon}>{expandedSection === 'study' ? '▼' : '▶'}</span>
          </div>
          {expandedSection === 'study' && (
            <div className={styles.sectionContent}>
              <div className={styles.settingItem}>
                <label>Default Study Duration</label>
                <select
                  value={preferences.study.defaultStudyDuration}
                  onChange={e => onStudyChange({ defaultStudyDuration: parseInt(e.target.value) })}
                >
                  {STUDY_SESSION_PRESETS.map(preset => (
                    <option key={preset.minutes} value={preset.minutes}>
                      {preset.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Data Section */}
        <div className={styles.settingsSection}>
          <div
            className={styles.sectionHeader}
            onClick={() => setExpandedSection(expandedSection === 'data' ? null : 'data')}
          >
            <span>💾 Data</span>
            <span className={styles.toggleIcon}>{expandedSection === 'data' ? '▼' : '▶'}</span>
          </div>
          {expandedSection === 'data' && (
            <div className={styles.sectionContent}>
              <div className={styles.dataActions}>
                {onExport && (
                  <button className={styles.exportButton} onClick={onExport}>
                    📥 Export Data
                  </button>
                )}
                {onClear && (
                  <button className={styles.dangerButton} onClick={onClear}>
                    🗑️ Clear All Data
                  </button>
                )}
              </div>
              <p className={styles.dataWarning}>
                ⚠️ Clearing data will delete everything. This action cannot be undone.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
