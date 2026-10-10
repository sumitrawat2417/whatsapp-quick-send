import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

export function useOCR() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Helper function to extract valid phone numbers from a text block
  const extractPhoneNumbersWithBBox = (tesseractLines) => {
    const validNumbers = [];

    for (const line of (tesseractLines || [])) {
      // 1. Count how many digits are in the entire line
      const digitsOnly = line.text.replace(/[^0-9]/g, '');
      
      // 2. If the line has 10 to 15 digits, we treat it as a phone number!
      // This is highly forgiving of OCR mistakes, spaces, hyphens, and surrounding text.
      if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
        
        // 3. Extract the clean number. We keep digits and a leading plus if it exists.
        let cleaned = '';
        let foundDigit = false;
        
        for (const char of line.text.split('')) {
          if (char === '+' && !foundDigit) {
            cleaned += char; // Keep a plus only if it appears before any digits
          } else if (/[0-9]/.test(char)) {
            cleaned += char;
            foundDigit = true;
          }
        }

        validNumbers.push({
          text: cleaned,
          bbox: line.bbox // Highlight the entire line for easy tapping
        });
      }
    }
    
    // 4. Remove duplicates (if the exact same number appears multiple times)
    const uniqueNumbers = [];
    const seen = new Set();
    for (const item of validNumbers) {
      if (!seen.has(item.text)) {
        seen.add(item.text);
        uniqueNumbers.push(item);
      }
    }
    
    return uniqueNumbers;
  };

  const processImage = useCallback(async (imageSource) => {
    setIsScanning(true);
    setScanProgress(0);

    try {
      const result = await Tesseract.recognize(
        imageSource,
        'eng', 
        { 
          logger: m => {
            if (m.status === 'recognizing text') {
              setScanProgress(Math.floor(m.progress * 100));
            }
          }
        }
      );
      
      // Pass the detailed lines array to our parser to get bounding boxes
      const foundNumbers = extractPhoneNumbersWithBBox(result.data.lines);
      return { numbers: foundNumbers, naturalWidth: result.data.jobId ? null : null }; 
      // Note: We don't need Tesseract to give us natural dimensions, we can get that from the DOM Image element.
    } catch (error) {
      console.error("OCR Scanning failed: ", error);
      return { numbers: [] };
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  }, []);

  return { processImage, isScanning, scanProgress };
}
