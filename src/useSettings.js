import { useState, useEffect } from 'react';
import localforage from 'localforage';

const SETTINGS_KEY = 'wa_quick_send_settings';

// Default settings values
const DEFAULT_SETTINGS = {
  countryCode: '91',
};

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Load settings from local storage on startup
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await localforage.getItem(SETTINGS_KEY);
      if (stored) {
        // Merge stored settings with defaults (in case we add new settings later)
        setSettings({ ...DEFAULT_SETTINGS, ...stored });
      }
    } catch (err) {
      console.error("Failed to load settings", err);
    }
  };

  // Update a single setting by key
  const updateSetting = async (key, value) => {
    try {
      const updated = { ...settings, [key]: value };
      await localforage.setItem(SETTINGS_KEY, updated);
      setSettings(updated);
    } catch (err) {
      console.error("Failed to save setting", err);
    }
  };

  return { settings, updateSetting };
}
