import { useEffect, useRef, useState } from 'react';
import { X, Camera, Image as ImageIcon, Loader2, RotateCcw } from 'lucide-react';
import './ScannerModal.css';

export default function ScannerModal({ onClose, onScanSuccess, processImage, isProcessing, scanProgress }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState('');
  
  // New state for Live Text Mode
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedNumbers, setDetectedNumbers] = useState([]);
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 1, height: 1 });

  // 1. Turn on the camera when the modal is opened (only if we aren't viewing a captured image)
  useEffect(() => {
    async function startCamera() {
      if (capturedImage) return; // Don't start camera if we have an image
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
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

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [capturedImage]); // Restart camera if capturedImage goes back to null

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg');
    setCapturedImage(imageDataUrl); // Switch UI to static image view
    
    // Shut down the camera stream to save battery
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }

    const { numbers } = await processImage(imageDataUrl);
    setDetectedNumbers(numbers);
    
    if (numbers.length === 0) {
      alert("No phone number found in that image. Please try again!");
      setCapturedImage(null); // Go back to camera
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageDataUrl = event.target.result;
        setCapturedImage(imageDataUrl);
        
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }

        const { numbers } = await processImage(imageDataUrl);
        setDetectedNumbers(numbers);
        if (numbers.length === 0) {
          alert("No phone number found in that image. Please try again!");
          setCapturedImage(null); 
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageLoad = (e) => {
    // Save the original resolution of the image so we can calculate bounding box percentages
    setNaturalDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-header">
        <h3>{capturedImage ? 'Select a Number' : 'Scan Number'}</h3>
        <button className="close-btn" onClick={onClose} disabled={isProcessing}>
          <X size={24} />
        </button>
      </div>

      <div className="video-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {capturedImage ? (
          <div className="captured-image-wrapper">
            <img 
              ref={imageRef}
              src={capturedImage} 
              alt="Captured" 
              className="captured-image" 
              onLoad={handleImageLoad}
            />
            {/* Render bounding boxes over the image */}
            {detectedNumbers.map((num, idx) => {
              // Convert absolute coordinates to percentages so they scale perfectly
              const top = (num.bbox.y0 / naturalDimensions.height) * 100;
              const left = (num.bbox.x0 / naturalDimensions.width) * 100;
              const width = ((num.bbox.x1 - num.bbox.x0) / naturalDimensions.width) * 100;
              const height = ((num.bbox.y1 - num.bbox.y0) / naturalDimensions.height) * 100;
              
              return (
                <div 
                  key={idx}
                  className="bbox-overlay"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                    width: `${width}%`,
                    height: `${height}%`
                  }}
                  onClick={() => onScanSuccess(num.text)}
                >
                  {/* Optional: Add a label above the box */}
                  <span className="bbox-label">{num.text}</span>
                </div>
              );
            })}
          </div>
        ) : error ? (
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
            <div className="target-box"></div>
          </>
        )}
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        {isProcessing && (
          <div className="scan-loading">
            <Loader2 size={48} color="var(--color-primary)" style={{ animation: 'spin 1s linear infinite' }} />
            <p>Extracting text... {scanProgress}%</p>
          </div>
        )}
      </div>

      <div className="modal-controls">
        {capturedImage ? (
          <button 
            className="capture-btn" 
            onClick={() => {
              setCapturedImage(null);
              setDetectedNumbers([]);
            }} 
            disabled={isProcessing}
          >
            <RotateCcw size={20} />
            Scan Again
          </button>
        ) : (
          <>
            <button 
              className="capture-btn" 
              onClick={handleCapture} 
              disabled={isProcessing || error}
            >
              <Camera size={20} />
              Tap to Capture
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
          </>
        )}
      </div>
    </div>
  );
}
