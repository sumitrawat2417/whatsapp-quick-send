import { useEffect, useRef, useState } from 'react';
import { X, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import './ScannerModal.css';

export default function ScannerModal({ onClose, onScanSuccess, processImage, isProcessing, scanProgress }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');

  // 1. Turn on the camera when the modal is opened
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' } // 'environment' requests the back camera on phones
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

    // Cleanup function: Turn off the camera when the modal is closed
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // 2. Handle the "Tap to Extract" button
  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set the invisible canvas to the exact size of the video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Grab a 1-millisecond frozen snapshot of the live video
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert that canvas drawing into a standard JPEG image string
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    
    // Send it to the OCR engine. (User can now shake their hands all they want!)
    const extractedNumber = await processImage(imageDataUrl);
    
    if (extractedNumber) {
      onScanSuccess(extractedNumber);
    } else {
      alert("No phone number found in that image. Please try again!");
    }
  };

  // 3. Handle the "Upload from Gallery" fallback button
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const extractedNumber = await processImage(event.target.result);
        if (extractedNumber) {
          onScanSuccess(extractedNumber);
        } else {
          alert("No phone number found in that image. Please try again!");
        }
      };
      reader.readAsDataURL(file); // Convert uploaded file to image string
    }
  };

  return (
    <div className="modal-overlay">
      
      <div className="modal-header">
        <h3>Scan Number</h3>
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
              playsInline /* crucial for iOS Safari so it doesn't open full screen player */
              muted 
              className="video-feed" 
            />
            {/* The visual targeting box the user aims with */}
            <div className="target-box"></div>
          </>
        )}
        
        {/* Hidden canvas used to grab the snapshot behind the scenes */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {/* Full screen loading spinner while Tesseract is analyzing the frozen snapshot */}
        {isProcessing && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
            background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', 
            justifyContent: 'center', alignItems: 'center', color: 'var(--primary)',
            zIndex: 10
          }}>
            <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <p style={{ fontWeight: 600, color: 'white' }}>Extracting text... {scanProgress}%</p>
          </div>
        )}
      </div>

      <div className="modal-controls">
        <button 
          className="capture-btn" 
          onClick={handleCapture} 
          disabled={isProcessing || error}
        >
          <Camera size={20} />
          Tap to Extract Number
        </button>

        <label className="upload-label">
          <ImageIcon size={20} />
          Upload from Gallery
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
