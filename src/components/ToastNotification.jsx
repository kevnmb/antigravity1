import React, { useEffect } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

export default function ToastNotification({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose, message, type]);

  return (
    <div className={`toast ${type}`}>
      {type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
      <span>{message}</span>
      <button className="control-btn" style={{ marginLeft: 'auto', padding: 4 }} onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
}
