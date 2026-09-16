import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * ConfirmModal — glassmorphic dark confirmation dialog.
 *
 * Props:
 *   isOpen       {boolean}  – whether the modal is visible
 *   onConfirm    {fn}       – called when user clicks confirm
 *   onCancel     {fn}       – called when user cancels / closes
 *   title        {string}   – modal heading
 *   message      {string}   – body text
 *   confirmLabel {string}   – confirm button label  (default "Confirm")
 *   cancelLabel  {string}   – cancel button label   (default "Cancel")
 *   variant      {string}   – 'danger' | 'warning' | 'info'  (default 'danger')
 */
export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title        = 'Are you sure?',
  message      = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel  = 'Cancel',
  variant      = 'danger',
}) {
  const confirmRef = useRef(null);
  const cancelRef  = useRef(null);

  // Focus cancel button when modal opens (safe default)
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => cancelRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const VARIANTS = {
    danger:  { icon: '#f43f5e', glow: 'rgba(244,63,94,0.18)',  bg: 'rgba(244,63,94,0.1)',  border: 'rgba(244,63,94,0.3)'  },
    warning: { icon: '#f59e0b', glow: 'rgba(245,158,11,0.18)', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
    info:    { icon: '#06b6d4', glow: 'rgba(6,182,212,0.18)',  bg: 'rgba(6,182,212,0.1)',  border: 'rgba(6,182,212,0.3)'  },
  };
  const v = VARIANTS[variant] || VARIANTS.danger;

  return (
    /* Backdrop */
    <div
      className="modal-backdrop"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Panel — stop propagation so clicking inside doesn't close */}
      <div
        className="modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon pill */}
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: v.bg,
          border: `1px solid ${v.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          boxShadow: `0 0 24px ${v.glow}`,
        }}>
          <AlertTriangle size={24} color={v.icon} strokeWidth={2.2} />
        </div>

        {/* Text */}
        <h3
          id="confirm-modal-title"
          style={{
            fontSize: '1.2rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '0.55rem',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h3>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          lineHeight: 1.6,
          marginBottom: '1.75rem',
        }}>
          {message}
        </p>

        {/* Action row */}
        <div style={{ display: 'flex', gap: '0.65rem' }}>
          {/* Cancel — autofocused */}
          <button
            ref={cancelRef}
            className="btn btn-secondary"
            onClick={onCancel}
            style={{ flex: 1 }}
          >
            {cancelLabel}
          </button>

          {/* Confirm */}
          <button
            ref={confirmRef}
            className="btn"
            onClick={onConfirm}
            style={{
              flex: 1,
              background: v.bg,
              color: v.icon,
              border: `1px solid ${v.border}`,
              fontWeight: 700,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = v.glow;
              e.currentTarget.style.boxShadow = `0 0 20px ${v.glow}`;
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = v.bg;
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
