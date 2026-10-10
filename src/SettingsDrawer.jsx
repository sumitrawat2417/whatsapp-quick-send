import { Globe, Trash2, FileDown, Shield, Settings, Code2, ExternalLink, ChevronLeft, Sun, Moon, Monitor, Check, FileText, HelpCircle, Download } from 'lucide-react';
import { useState } from 'react';
import localforage from 'localforage';
import LegalModal from './LegalModal';
import privacyPolicyMd from '../docs/privacy_policy_wa_quick_send.md?raw';
import termsMd from '../docs/terms_and_conditions_wa_quick_send.md?raw';
import howItWorksMd from '../docs/how_it_works.md?raw';
import './SettingsDrawer.css';

const HISTORY_KEY = 'wa_quick_send_history';

export default function SettingsDrawer({ onClose, settings, updateSetting, history, deferredPrompt }) {
  const [activeLegalDoc, setActiveLegalDoc] = useState(null);

  // Clear all history from IndexedDB
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);
    }
  };
  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to permanently delete all history?")) {
      await localforage.removeItem(HISTORY_KEY);
      window.location.reload();
    }
  };

  // Export history as a CSV file download
  const handleExportHistory = () => {
    if (history.length === 0) {
      alert("No history to export yet!");
      return;
    }

    const headers = "Number,Name,Last Message,Date";
    const rows = history.map(item => {
      const date = new Date(item.timestamp).toLocaleString();
      return `"${item.number}","${item.name || ''}","${(item.lastMessage || '').replace(/"/g, '""')}","${date}"`;
    });

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `wa-quick-send-history-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="settings-page">

      {/* Gradient Hero Header */}
      <div className="settings-hero">
        <button className="back-btn" onClick={onClose}>
          <ChevronLeft size={24} />
        </button>
        <div className="settings-hero-text">
          <h1>Settings</h1>
        </div>
      </div>

      {/* Scrollable Content (slides over header) */}
      <div className="settings-content">

        {/* ─── Appearance ───────────────────────── */}
        <div className="settings-section">
          <div className="section-label">Appearance</div>
          <div className="settings-card">
            <div className="settings-row clickable" onClick={() => updateSetting('theme', 'system')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <Monitor size={20} />
                </div>
                <div className="row-text">
                  <h4>System Default</h4>
                </div>
              </div>
              {settings.theme === 'system' && <Check size={20} color="var(--color-primary)" />}
            </div>
            <div className="settings-row clickable" onClick={() => updateSetting('theme', 'light')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <Sun size={20} />
                </div>
                <div className="row-text">
                  <h4>Light Mode</h4>
                </div>
              </div>
              {settings.theme === 'light' && <Check size={20} color="var(--color-primary)" />}
            </div>
            <div className="settings-row clickable" onClick={() => updateSetting('theme', 'dark')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <Moon size={20} />
                </div>
                <div className="row-text">
                  <h4>Dark Mode</h4>
                </div>
              </div>
              {settings.theme === 'dark' && <Check size={20} color="var(--color-primary)" />}
            </div>
          </div>
        </div>

        {/* ─── General ──────────────────────────── */}
        <div className="settings-section">
          <div className="section-label">General</div>
          <div className="settings-card">
            <div className="settings-row">
              <div className="row-info">
                <div className="row-icon brand">
                  <Globe size={20} />
                </div>
                <div className="row-text">
                  <h4>Default Country Code</h4>
                  <p>Auto-prepended to 10-digit numbers</p>
                </div>
              </div>
              <input 
                type="text"
                className="code-input"
                value={settings.countryCode}
                onChange={(e) => updateSetting('countryCode', e.target.value.replace(/\D/g, ''))}
                placeholder="91"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        {/* ─── Data & Privacy ───────────────────── */}
        <div className="settings-section">
          <div className="section-label">Data & Privacy</div>
          <div className="settings-card">
            <div className="settings-row clickable" onClick={handleExportHistory}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <FileDown size={20} />
                </div>
                <div className="row-text">
                  <h4>Export History (CSV)</h4>
                  <p>Open in Excel or Google Sheets</p>
                </div>
              </div>
              <span className="row-value">{history.length} records</span>
            </div>
            <div className="settings-row clickable" onClick={handleClearHistory}>
              <div className="row-info">
                <div className="row-icon danger">
                  <Trash2 size={20} />
                </div>
                <div className="row-text">
                  <h4>Clear All History</h4>
                  <p>Permanently delete all saved contacts</p>
                </div>
              </div>
            </div>
          </div>
          <div className="privacy-badge">
            <Shield size={18} />
            <p>All data stays on this device. Nothing is uploaded.</p>
          </div>
        </div>

        {/* ─── About ────────────────────────────── */}
        <div className="settings-section">
          <div className="section-label">About</div>
          <div className="settings-card">
            
            <div className="settings-row">
              <div className="row-info">
                <div className="row-icon brand">
                  <Settings size={20} />
                </div>
                <div className="row-text">
                  <h4>WA Quick Send</h4>
                  <p>Version 1.0.0 (Offline-first PWA)</p>
                </div>
              </div>
            </div>

            {deferredPrompt && (
              <div className="settings-row clickable" onClick={handleInstallApp}>
                <div className="row-info">
                  <div className="row-icon brand" style={{ background: 'var(--color-primary)', color: '#000' }}>
                    <Download size={20} />
                  </div>
                  <div className="row-text">
                    <h4 style={{ color: 'var(--color-primary)' }}>Install App</h4>
                    <p>Add to Home Screen</p>
                  </div>
                </div>
              </div>
            )}

            <div className="settings-row">
              <div className="row-info">
                <div className="row-icon neutral">
                  <Shield size={20} />
                </div>
                <div className="row-text">
                  <h4>Not affiliated with WhatsApp</h4>
                  <p>Independent deep-link generation tool</p>
                </div>
              </div>
            </div>

            <div className="settings-row clickable" onClick={() => setActiveLegalDoc('help')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <HelpCircle size={20} />
                </div>
                <div className="row-text">
                  <h4>How it works (Help)</h4>
                </div>
              </div>
              <ChevronLeft size={16} color="var(--color-text-3)" style={{ transform: 'rotate(180deg)' }} />
            </div>

            <div className="settings-row clickable" onClick={() => setActiveLegalDoc('privacy')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <FileText size={20} />
                </div>
                <div className="row-text">
                  <h4>Privacy Policy</h4>
                </div>
              </div>
              <ChevronLeft size={16} color="var(--color-text-3)" style={{ transform: 'rotate(180deg)' }} />
            </div>

            <div className="settings-row clickable" onClick={() => setActiveLegalDoc('terms')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <FileText size={20} />
                </div>
                <div className="row-text">
                  <h4>Terms of Use</h4>
                </div>
              </div>
              <ChevronLeft size={16} color="var(--color-text-3)" style={{ transform: 'rotate(180deg)' }} />
            </div>

            <div className="settings-row clickable" onClick={() => window.open('mailto:sumitrawat2417@gmail.com')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <Globe size={20} />
                </div>
                <div className="row-text">
                  <h4>Contact / Support</h4>
                  <p>sumitrawat2417@gmail.com</p>
                </div>
              </div>
              <ExternalLink size={16} color="var(--color-text-3)" />
            </div>

            <div className="settings-row clickable" onClick={() => window.location.reload()}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <Settings size={20} />
                </div>
                <div className="row-text">
                  <h4>Check for Updates</h4>
                  <p>Tap to check and reload</p>
                </div>
              </div>
              <ChevronLeft size={16} color="var(--color-text-3)" style={{ transform: 'rotate(180deg)' }} />
            </div>



            <div className="settings-row clickable" onClick={() => window.open('https://github.com/sumitrawat2417/whatsapp-quick-send', '_blank')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <Code2 size={20} />
                </div>
                <div className="row-text">
                  <h4>Source Code</h4>
                  <p>Open source on GitHub</p>
                </div>
              </div>
              <ExternalLink size={16} color="var(--color-text-3)" />
            </div>

            <div className="settings-row clickable" onClick={() => window.open('https://github.com/sumitrawat2417', '_blank')}>
              <div className="row-info">
                <div className="row-icon neutral">
                  <Code2 size={20} />
                </div>
                <div className="row-text">
                  <h4>Developer</h4>
                  <p>Forbit (Sumit Rawat)</p>
                </div>
              </div>
              <ExternalLink size={16} color="var(--color-text-3)" />
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <p>Not affiliated with WhatsApp or Meta.</p>
          <p style={{ marginTop: '0.3rem' }}>
            Built by <a href="https://github.com/sumitrawat2417" target="_blank" rel="noreferrer">Forbit (Sumit Rawat)</a>
          </p>
        </div>

      </div>
      
      {activeLegalDoc === 'privacy' && (
        <LegalModal 
          title="Privacy Policy" 
          content={privacyPolicyMd} 
          onClose={() => setActiveLegalDoc(null)} 
        />
      )}

      {activeLegalDoc === 'terms' && (
        <LegalModal 
          title="Terms & Conditions" 
          content={termsMd} 
          onClose={() => setActiveLegalDoc(null)} 
        />
      )}

      {activeLegalDoc === 'help' && (
        <LegalModal 
          title="How it works" 
          content={howItWorksMd} 
          onClose={() => setActiveLegalDoc(null)} 
        />
      )}
    </div>
  );
}
