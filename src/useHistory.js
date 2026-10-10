import { useState, useEffect } from 'react';
import localforage from 'localforage';

// The key used to store our data inside the browser's IndexedDB
const HISTORY_KEY = 'wa_quick_send_history';

export function useHistory() {
  const [history, setHistory] = useState([]);

  // Load history from the database when the app starts
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const storedHistory = await localforage.getItem(HISTORY_KEY);
      if (storedHistory) {
        // Sort by timestamp descending (newest messages at the top)
        const sorted = storedHistory.sort((a, b) => b.timestamp - a.timestamp);
        setHistory(sorted);
      }
    } catch (err) {
      console.error("Failed to load history from local storage", err);
    }
  };

  // Called when the user clicks "Open in WhatsApp"
  const saveInteraction = async (number, message) => {
    try {
      let currentHistory = await localforage.getItem(HISTORY_KEY) || [];
      
      // Check if we already have this number saved
      const existingIndex = currentHistory.findIndex(item => item.number === number);
      
      if (existingIndex >= 0) {
        // Update existing record (don't overwrite the name they might have set!)
        currentHistory[existingIndex].lastMessage = message;
        currentHistory[existingIndex].timestamp = Date.now();
      } else {
        // Add a brand new record
        currentHistory.push({
          number: number,
          name: '', // Empty name by default
          lastMessage: message,
          timestamp: Date.now()
        });
      }
      
      await localforage.setItem(HISTORY_KEY, currentHistory);
      loadHistory(); // Refresh the React state so the UI updates
    } catch (err) {
      console.error("Failed to save interaction", err);
    }
  };

  // Called when the user edits a contact's name in the history drawer
  const updateName = async (number, newName) => {
    try {
      let currentHistory = await localforage.getItem(HISTORY_KEY) || [];
      const existingIndex = currentHistory.findIndex(item => item.number === number);
      
      if (existingIndex >= 0) {
        currentHistory[existingIndex].name = newName;
        await localforage.setItem(HISTORY_KEY, currentHistory);
        loadHistory();
      }
    } catch (err) {
      console.error("Failed to update name", err);
    }
  };

  // Called when the user clicks the Trash icon on a specific number
  const deleteRecord = async (number) => {
    try {
      let currentHistory = await localforage.getItem(HISTORY_KEY) || [];
      // Filter out the one we want to delete
      currentHistory = currentHistory.filter(item => item.number !== number);
      
      await localforage.setItem(HISTORY_KEY, currentHistory);
      loadHistory();
    } catch (err) {
      console.error("Failed to delete record", err);
    }
  };

  return {
    history,
    saveInteraction,
    updateName,
    deleteRecord
  };
}
