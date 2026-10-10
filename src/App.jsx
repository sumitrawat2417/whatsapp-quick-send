import { useState } from 'react';
import { MessageCircle, Phone, Send, ScanLine, Type } from 'lucide-react';
import { useOCR } from './useOCR';
import ScannerModal from './ScannerModal';
import './App.css';
import './index.css';

function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  
  // Bring in our custom OCR engine
  const { processImage, isScanning, scanProgress } = useOCR();

  const handleSend = () => {
    // Basic formatting: remove all non-numeric characters from the input
    let cleanedNumber = phoneNumber.replace(/\D/g, '');
    
    // Safety check: Don't do anything if no number exists after cleaning
    if (!cleanedNumber) return;

    // Temporary fix: Default to India country code (+91) if a 10-digit number is entered
    if (cleanedNumber.length === 10) {
      cleanedNumber = '91' + cleanedNumber;
    }

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

  const handleImageCaptured = async (imageDataUrl) => {
    const extractedNumber = await processImage(imageDataUrl);
    
    if (extractedNumber) {
      setPhoneNumber(extractedNumber);
      setShowScanner(false); // Close modal on success
    } else {
      alert("No phone number found in that image. Please try again!");
    }
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
            <button className="action-icon" onClick={handleScanClick} title="Scan Number" aria-label="Scan number from image">
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

      {/* Render the Scanner UI overlay if active */}
      {showScanner && (
        <ScannerModal 
          onClose={() => setShowScanner(false)}
          onScanComplete={handleImageCaptured}
          isProcessing={isScanning}
          scanProgress={scanProgress}
        />
      )}
    </div>
  );
}

export default App;
