import { useState } from 'react';
import { X, Clock, Edit2, Trash2, MessageSquare } from 'lucide-react';
import './HistoryDrawer.css';

export default function HistoryDrawer({ 
  onClose, 
  history, 
  updateName, 
  deleteRecord, 
  onSelectContact 
}) {
  const [editingNumber, setEditingNumber] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');

  // Triggers the inline edit mode for a specific number
  const handleEditClick = (e, item) => {
    e.stopPropagation(); // Stop the drawer from closing or selecting the row
    setEditingNumber(item.number);
    setEditNameValue(item.name || '');
  };

  // Saves the edited name
  const handleSaveName = (e, number) => {
    e.stopPropagation();
    updateName(number, editNameValue);
    setEditingNumber(null); // Exit edit mode
  };

  const handleDelete = (e, number) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this number from your history?")) {
      deleteRecord(number);
    }
  };

  // When a user taps a row, auto-fill the main screen with this data
  const handleRowClick = (item) => {
    // If they are currently typing a name, don't trigger the row click
    if (editingNumber === item.number) return;
    
    onSelectContact(item.number, item.lastMessage || '');
  };

  return (
    <>
      <div className="history-overlay" onClick={onClose}></div>
      <div className="history-drawer">
        
        <div className="drawer-header">
          <div className="drawer-title">
            <Clock size={22} color="var(--primary)" />
            Recent History
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="history-list">
          {history.length === 0 ? (
            <div className="empty-state">
              <MessageSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No history yet.<br/>Numbers you message will automatically appear here!</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.number} 
                className="history-item"
                onClick={() => handleRowClick(item)}
              >
                <div className="history-info">
                  
                  {/* Name Editing Mode vs Display Mode */}
                  {editingNumber === item.number ? (
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input 
                        autoFocus
                        type="text" 
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        placeholder="Enter name..."
                        style={{
                          background: 'rgba(0,0,0,0.3)', border: '1px solid var(--primary)', 
                          color: 'white', padding: '0.6rem', borderRadius: '8px', width: '100%',
                          fontSize: '1rem'
                        }}
                        onClick={(e) => e.stopPropagation()} // Prevent row click
                      />
                      <button 
                        onClick={(e) => handleSaveName(e, item.number)}
                        style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '0 1rem', fontWeight: 'bold' }}
                      >Save</button>
                    </div>
                  ) : (
                    <>
                      {item.name && <div className="history-name">{item.name}</div>}
                      <div className="history-number" style={item.name ? {} : { fontSize: '1.2rem', color: 'white' }}>
                        {item.number}
                      </div>
                    </>
                  )}
                  
                  {item.lastMessage && (
                    <div className="history-message">
                      "{item.lastMessage}"
                    </div>
                  )}
                </div>

                <div className="history-actions">
                  <button className="action-btn" onClick={(e) => handleEditClick(e, item)} title="Edit Name">
                    <Edit2 size={18} />
                  </button>
                  <button className="action-btn delete" onClick={(e) => handleDelete(e, item.number)} title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}
