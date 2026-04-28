'use client';
// Toast notification system - hiển thị thông báo nhanh cho người dùng
// Sử dụng React Context để chia sẻ toast từ bất kỳ component nào

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let nextId = 1;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    // Tự động xóa sau 3.5 giây
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Container hiển thị tất cả toast */}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Hook để dùng toast từ bất kỳ component nào
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast phải được dùng trong ToastProvider');
  return ctx;
}

// Map kiểu toast sang màu và icon
const toastConfig: Record<ToastType, { icon: string; bg: string; border: string; text: string }> = {
  success: { icon: '✅', bg: 'bg-green-900/90', border: 'border-green-500/50', text: 'text-green-200' },
  error:   { icon: '❌', bg: 'bg-red-900/90',   border: 'border-red-500/50',   text: 'text-red-200'   },
  warning: { icon: '⚠️', bg: 'bg-yellow-900/90', border: 'border-yellow-500/50', text: 'text-yellow-200' },
  info:    { icon: 'ℹ️', bg: 'bg-lol-panel/95',  border: 'border-lol-gold/40',  text: 'text-lol-gold-light' },
};

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const cfg = toastConfig[toast.type];
  return (
    <div
      className={`
        pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg
        max-w-xs min-w-[220px] backdrop-blur-sm
        ${cfg.bg} ${cfg.border} ${cfg.text}
        animate-in slide-in-from-right-5 fade-in duration-300
      `}
    >
      <span className="text-lg shrink-0">{cfg.icon}</span>
      <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
      <button
        onClick={onClose}
        className="shrink-0 text-gray-400 hover:text-white transition-colors text-xs ml-1"
        aria-label="Đóng"
      >
        ✕
      </button>
    </div>
  );
}
