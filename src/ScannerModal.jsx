import { useEffect, useRef, useState } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import './ScannerModal.css';

export default function ScannerModal({ onClose, onScanSuccess, processImage, isProcessing, scanProgress }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  
  // Use a ref to track if we are currently analyzing an image so we don't overlap scans
  const isAnalyzingRef = useRef(false);
  const scanIntervalRef = useRef(null);

  // 1. Turn on the camera
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied or unavailable", err);
        setError('Camera access denied. Please use the "Upload" button.');
      }
    }
    
    startCamera();

    // Cleanup: Turn off camera when closed
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);

  // 2. Auto-Scan Loop (Like a QR Scanner)
  useEffect(() => {
    if (!stream || error) return; // Wait until camera is active

    const attemptScan = async () => {
      // Don't start a new scan if one is already running
      if (isAnalyzingRef.current || !videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Safety check: wait for video to have actual dimensions
      if (video.videoWidth === 0) return;

      isAnalyzingRef.current = true;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      
      // Run the OCR engine silently in the background
      const extractedNumber = await processImage(imageDataUrl);
      
      if (extractedNumber) {
        // Boom! We found a number. Stop the loop and return it.
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        onScanSuccess(extractedNumber);
      } else {
        // No number found, release the lock so the next interval can try again
        isAnalyzingRef.current = false;
      }
    };

    // Run a frame analysis every 2 seconds
    scanIntervalRef.current = setInterval(attemptScan, 2000);

    return () => clearInterval(scanIntervalRef.current);
  }, [stream, error, processImage, onScanSuccess]);

  // 3. Handle the "Upload from Gallery" fallback button
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current); // Pause auto-scan
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const extractedNumber = await processImage(event.target.result);
        if (extractedNumber) {
          onScanSuccess(extractedNumber);
        } else {
          alert("No phone number found in that image. Please try again!");
          // Resume auto-scan if they failed an upload
          scanIntervalRef.current = setInterval(() => {}, 2000); 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-header">
        <h3>Auto-Scanning...</h3>
        <button className="close-btn" onClick={onClose} disabled={isProcessing}>
          <X size={24} />
        </button>
      </div>

      <div className="video-container">
        {error ? (
          <p style={{ color: '#ff4444', textAlign: 'center', padding: '2rem' }}>{error}</p>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="video-feed" 
            />
            {/* The visual targeting box the user aims with */}
            <div className="target-box"></div>
          </>
        )}
        
        {/* Hidden canvas used to grab the snapshot behind the scenes */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* We can show a subtle indicator that it's analyzing instead of a full blocking loader */}
        {isProcessing && !error && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: '20px',
            display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)',
            fontSize: '0.8rem', zIndex: 10
          }}>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            Analyzing {scanProgress}%
          </div>
        )}
      </div>

      <div className="modal-controls">
        <label className="upload-label">
          <ImageIcon size={20} />
          Upload from Gallery Instead
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload} 
            className="upload-input" 
            disabled={isProcessing}
          />
        </label>
      </div>
    </div>
  );
}
