import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/custom.css';

function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    // Nếu đang ở trang Profile hoặc các trang con của nó, luôn về Home
    if (window.location.pathname.startsWith('/profile') || window.location.pathname.startsWith('/admin')) {
      navigate('/');
    }
    // Còn lại, nếu có lịch sử thì quay lại, không thì về Home
    else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Quay lại"
      title="Quay lại"
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.9rem',
        backgroundColor: '#6d28d9',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        boxShadow: '0 6px 18px rgba(109,40,217,0.18)',
        cursor: 'pointer'
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span style={{ fontWeight: 600 }}>Quay lại</span>
    </button>
  );
}

export default BackButton;
