import { useState } from 'react';
import { MessageCircle, Phone, Send, ScanLine, Type } from 'lucide-react';
import './App.css';
import './index.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Basic formatting: remove all non-numeric characters from the input
    let cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // Safety check: Don't do anything if no number exists after cleaning
    if (!cleanedNumber) return;

    // Construct the WhatsApp Deep Link protocol
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanedNumber}${message ? `?text=${encodedMessage}` : ''}`;
    
    // Open in a new tab (this natively triggers the WhatsApp app on mobile)
    window.open(url, '_blank');
  };

  const handleScan = (e) => {
    e.preventDefault();
    // Placeholder for future OCR functionality
    alert("OCR Scanning feature coming in a later step!");
  };

  return (
    <div className="app-container">
      
      {/* Header Section */}
      <div className="header">
        <div className="icon-wrapper">
          <MessageCircle size={32} color="white" />
        </div>
        <h1 className="title">WA Quick Send</h1>
        <p className="subtitle">Message instantly. No saving required.</p>
      </div>

      {/* Form Section */}
      <div className="form-container">
        
        {/* Phone Number Input */}
        <div className="form-group">
          <label className="label">Phone Number</label>
          <div className="input-container">
            <Phone size={20} className="input-icon" />
            <input 
              type="tel" 
              className="input-field" 
              placeholder="e.g. +1 234 567 8900" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button className="action-icon" onClick={handleScan} title="Scan Number" aria-label="Scan number from image">
              <ScanLine size={20} />
            </button>
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
          disabled={!phoneNumber.trim()} 
        >
          <span>Open in WhatsApp</span>
          <Send size={18} />
        </button>

      </div>
    </div>
  );
}

export default App;
