import { useState, useCallback } from 'react';
import Tesseract from 'tesseract.js';

export function useOCR() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Helper function to extract valid phone numbers from a text block
  const extractPhoneNumbersWithBBox = (tesseractLines) => {
    const validNumbers = [];
    const regex = /(\+?[0-9][0-9\s\-.()]{8,25}[0-9])/g;

    for (const line of tesseractLines) {
      const matches = line.text.match(regex);
      if (matches) {
        for (const match of matches) {
          const cleaned = match.replace(/[^0-9+]/g, '');
          const digitsOnly = cleaned.replace('+', '');
          
          if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
            validNumbers.push({
              text: cleaned,
              bbox: line.bbox // { x0, y0, x1, y1 }
            });
          }
        }
      }
    }
    return validNumbers;
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
