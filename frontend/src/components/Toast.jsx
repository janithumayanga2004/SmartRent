import React, { createContext, useContext, useCallback, useReducer, useRef } from 'react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

// ─── Context & Reducer ────────────────────────────────────────────────────────
const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 size={17} />,
  error:   <XCircle     size={17} />,
  info:    <Info        size={17} />,
  warning: <AlertTriangle size={17} />,
};

const COLORS = {
  success: { accent: '#10b981', glow: 'rgba(16,185,129,0.18)', text: '#34d399' },
  error:   { accent: '#f43f5e', glow: 'rgba(244,63,94,0.18)',  text: '#fb7185' },
  info:    { accent: '#06b6d4', glow: 'rgba(6,182,212,0.18)',  text: '#38bdf8' },
  warning: { accent: '#f59e0b', glow: 'rgba(245,158,11,0.18)', text: '#fbbf24' },
};

function reducer(state, action) {
  switch (action.type) {
    case 'ADD':    return [...state, action.toast];
    case 'REMOVE': return state.filter(t => t.id !== action.id);
    default:       return state;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(reducer, []);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current[id]);
    dispatch({ type: 'REMOVE', id });
  }, []);

  const toast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `${Date.now()}-${Math.random()}`;
    dispatch({ type: 'ADD', toast: { id, message, type } });
    timers.current[id] = setTimeout(() => dispatch({ type: 'REMOVE', id }), duration);
    return id;
  }, []);

  // Convenience methods
  toast.success = (msg, dur) => toast(msg, 'success', dur);
  toast.error   = (msg, dur) => toast(msg, 'error',   dur);
  toast.info    = (msg, dur) => toast(msg, 'info',    dur);
  toast.warning = (msg, dur) => toast(msg, 'warning', dur);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastItem({ toast: t, dismiss }) {
  const c = COLORS[t.type] || COLORS.info;

  return (
    <div
      className="sr-toast"
      style={{ '--toast-accent': c.accent, '--toast-glow': c.glow, '--toast-text': c.text }}
      role="alert"
    >
      {/* Progress bar */}
      <div className="sr-toast-progress" />

      {/* Icon */}
      <div className="sr-toast-icon" style={{ color: c.accent }}>
        {ICONS[t.type] || ICONS.info}
      </div>

      {/* Message */}
      <span className="sr-toast-msg">{t.message}</span>

      {/* Dismiss */}
      <button
        className="sr-toast-close"
        onClick={() => dismiss(t.id)}
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─── Container ────────────────────────────────────────────────────────────────
function ToastContainer({ toasts, dismiss }) {
  if (toasts.length === 0) return null;
  return (
    <div className="sr-toast-container" aria-live="polite">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} dismiss={dismiss} />
      ))}
    </div>
  );
}
