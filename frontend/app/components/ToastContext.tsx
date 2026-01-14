'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 5000);
    }, []);

    const dismissToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map(toast => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.9 }}
                            transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
                            className="pointer-events-auto"
                        >
                            <ToastCard toast={toast} onDismiss={() => dismissToast(toast.id)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

function ToastCard({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const styles = {
        success: {
            bg: 'bg-green-500/10 border-green-500/30',
            text: 'text-green-500',
            icon: CheckCircle,
        },
        error: {
            bg: 'bg-red-500/10 border-red-500/30',
            text: 'text-red-500',
            icon: AlertCircle,
        },
        info: {
            bg: 'bg-blue-500/10 border-blue-500/30',
            text: 'text-blue-500',
            icon: Info,
        },
    };

    const style = styles[toast.type];
    const Icon = style.icon;

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg min-w-[300px] max-w-[400px] ${style.bg}`}
        >
            <Icon className={`w-5 h-5 flex-shrink-0 ${style.text}`} />
            <p className="flex-1 text-sm text-[var(--foreground)]">{toast.message}</p>
            <button
                onClick={onDismiss}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
