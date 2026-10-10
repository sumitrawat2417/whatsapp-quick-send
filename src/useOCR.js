import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

export function useOCR() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Helper function to find a phone number from a big block of messy OCR text
  const extractPhoneNumber = (text) => {
    // 1. Regex to find blocks of text that look like phone numbers (allowing spaces, dashes, parens)
    // Starts with optional +, then a digit, then 8-25 characters of digits/spaces/punctuation, ending in a digit
    const regex = /(\+?[0-9][0-9\s\-.()]{8,25}[0-9])/g;
    const matches = text.match(regex);
    
    if (matches) {
      for (const match of matches) {
        // 2. Clean the match to only contain digits and a leading plus
        const cleaned = match.replace(/[^0-9+]/g, '');
        const digitsOnly = cleaned.replace('+', '');
        
        // 3. If it has between 10 and 15 digits, it's a valid phone number!
        if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
          return cleaned;
        }
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
