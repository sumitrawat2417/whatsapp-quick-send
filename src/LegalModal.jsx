import { ChevronLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './LegalModal.css';

export default function LegalModal({ title, content, onClose }) {
  return (
    <div className="legal-modal">
      <div className="legal-header">
        <button className="back-btn" onClick={onClose} aria-label="Go back">
          <ChevronLeft size={24} />
        </button>
        <h2>{title}</h2>
        <div style={{ width: 44 }}></div> {/* Spacer for center alignment */}
      </div>
      <div className="legal-content">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
}
