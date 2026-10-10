import { useState } from 'react';
import { MessageCircle, Phone, Send, ScanLine, Type, History, Settings, CheckCircle2 } from 'lucide-react';
import { useOCR } from './useOCR';
import { useHistory } from './useHistory';
import { useSettings } from './useSettings';
import ScannerModal from './ScannerModal';
import HistoryDrawer from './HistoryDrawer';
import SettingsDrawer from './SettingsDrawer';
import appLogo from './assets/logo.svg';
import './App.css';
import './index.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Bring in our custom engines
  const { processImage, isScanning, scanProgress } = useOCR();
  const { history, saveInteraction, updateName, deleteRecord } = useHistory();
  const { settings, updateSetting } = useSettings();

  // Validate format for green tick
  const isValidFormat = settings.countryCode 
    ? phoneNumber.length === 10 
    : phoneNumber.length >= 10 && phoneNumber.length <= 15;

  const handleSend = () => {
    // Basic formatting: remove all non-numeric characters from the input
    let cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // Safety check: Don't do anything if no number exists after cleaning
    if (!cleanedNumber) return;

    // Auto-prepend the user's configured country code for 10-digit numbers
    if (cleanedNumber.length === 10 && settings.countryCode) {
      cleanedNumber = settings.countryCode + cleanedNumber;
    }

    // Save this interaction to our local database before leaving the app
    saveInteraction(cleanedNumber, message);

    // Construct the WhatsApp Deep Link protocol
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanedNumber}${message ? `?text=${encodedMessage}` : ''}`;
    
    // Open in a new tab (this natively triggers the WhatsApp app on mobile)
    window.open(url, '_blank');
  };

  const handleScanClick = (e) => {
    e.preventDefault();
    setShowScanner(true);
  };

  const setFormattedPhoneNumber = (rawNumber) => {
    let val = rawNumber.replace(/\D/g, '');
    if (settings.countryCode) {
      // If the scanned/pasted number starts with the country code, strip it to avoid duplication
      if (val.startsWith(settings.countryCode) && val.length > 10) {
        val = val.substring(settings.countryCode.length);
      }
      setPhoneNumber(val.substring(0, 10)); // max 10 digits when country code is fixed
    } else {
      setPhoneNumber(val.substring(0, 15)); // standard international max
    }
  };

  const handleScanSuccess = (extractedNumber) => {
    setFormattedPhoneNumber(extractedNumber);
    setShowScanner(false); // Close modal on success
  };

  // Called when a user taps a contact inside the History Drawer
  const handleSelectContact = (selectedNumber, selectedMessage) => {
    setFormattedPhoneNumber(selectedNumber);
    setMessage(selectedMessage);
    setShowHistory(false); // Close the drawer automatically
  };

  return (
    <div className="app-container">
      
      {/* Header Section */}
      <div className="header">
        <div className="icon-wrapper">
          <img 
            src={appLogo} 
            alt="App Logo" 
            style={{ width: '28px', height: '28px', filter: 'brightness(0) invert(1)' }} 
          />
        </div>
        <h1 className="title">WA Quick Send.</h1>
        <p className="subtitle">Message anyone instantly. No contact saving.</p>
        
        {/* Header Action Buttons (Top Right) */}
        <div style={{ position: 'absolute', top: '3rem', right: '1.5rem', display: 'flex', gap: '0.5rem', zIndex: 5 }}>
          <button 
            className="history-btn"
            onClick={() => setShowHistory(true)} 
            title="Recent History"
            style={{ position: 'static' }}
          >
            <History size={22} />
          </button>
          <button 
            className="history-btn"
            onClick={() => setShowSettings(true)} 
            title="Settings"
            style={{ position: 'static' }}
          >
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="form-container">
        
        {/* Phone Number Input */}
        <div className="form-group">
          <label className="label">Phone Number</label>
          <div className="input-container">
            {settings.countryCode ? (
              <div className="country-prefix">
                +{settings.countryCode}
              </div>
            ) : (
              <Phone size={20} className="input-icon" />
            )}
            
            <input 
              type="tel" 
              className={`input-field ${settings.countryCode ? 'with-prefix' : ''}`} 
              placeholder="e.g. 98765 43210" 
              value={phoneNumber}
              onChange={(e) => setFormattedPhoneNumber(e.target.value)}
            />
            
            <div className="input-actions-right">
              {isValidFormat && (
                <div className="valid-tick">
                  <CheckCircle2 size={20} />
                </div>
              )}
              <button className="action-icon" onClick={handleScanClick} title="Scan Number" aria-label="Scan number from image">
                <ScanLine size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Optional Message Input */}
        <div className="form-group">
          <label className="label">Message (Optional)</label>
          <div className="input-container">
            <Type size={20} className="input-icon" style={{ top: '1rem' }} />
            <textarea 
              className="input-field" 
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          className="submit-btn" 
          onClick={handleSend}
          disabled={!phoneNumber.trim() || !isValidFormat} 
        >
          <span>Open in WhatsApp</span>
          <Send size={18} />
        </button>

      </div>

      {/* Render the Scanner UI overlay if active */}
      {showScanner && (
        <ScannerModal 
          onClose={() => setShowScanner(false)}
          onScanSuccess={handleScanSuccess}
          processImage={processImage}
          isProcessing={isScanning}
          scanProgress={scanProgress}
        />
      )}

      {/* Render the History Drawer if active */}
      {showHistory && (
        <HistoryDrawer 
          onClose={() => setShowHistory(false)}
          history={history}
          updateName={updateName}
          deleteRecord={deleteRecord}
          onSelectContact={handleSelectContact}
        />
      )}

      {/* Render the Settings Drawer if active */}
      {showSettings && (
        <SettingsDrawer 
          onClose={() => setShowSettings(false)}
          settings={settings}
          updateSetting={updateSetting}
          history={history}
        />
      )}
    </div>
  );
}

export default App;
