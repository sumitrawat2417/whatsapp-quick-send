import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

export function useOCR() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Helper function to find a phone number from a big block of messy OCR text
  const extractPhoneNumber = (text) => {
    // 1. Remove all characters except digits, plus signs, and spaces
    const rawNumbers = text.replace(/[^0-9+\s]/g, ' '); 
    
    // 2. Split by spaces into individual words
    const words = rawNumbers.split(/\s+/);
    
    // 3. Look for the first word that resembles a phone number (10 to 15 digits)
    for (const word of words) {
      const cleaned = word.replace('+', '');
      if (cleaned.length >= 10 && cleaned.length <= 15) {
        return word; // We found a valid looking number!
      }
    }
    return null;
  };

  const processImage = useCallback(async (imageSource) => {
    setIsScanning(true);
    setScanProgress(0);

    try {
      // Run Tesseract entirely in the browser using WebAssembly
      const result = await Tesseract.recognize(
        imageSource,
        'eng', // English language recognition
        { 
          logger: m => {
            if (m.status === 'recognizing text') {
              // Update progress state (0 to 100)
              setScanProgress(Math.floor(m.progress * 100));
            }
          }
        }
      );
      
      // Pass the massive text block to our regex parser
      const foundNumber = extractPhoneNumber(result.data.text);
      return foundNumber;

    } catch (error) {
      console.error("OCR Scanning failed: ", error);
      return null;
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  }, []);

  return { processImage, isScanning, scanProgress };
}
