import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

/**
 * A simple, beautiful success toast using Framer Motion.
 */
export const Toast = ({ message, isVisible, onClose }) => {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 bg-bg-base border border-accent/50 rounded-2xl shadow-2xl shadow-accent/20 backdrop-blur-md"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent">
                        <CheckCircle2 size={20} />
                    </div>
                    <span className="text-text-primary font-medium whitespace-nowrap">{message}</span>
                    <div className="w-px h-6 bg-bg-elevated mx-2" />
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-bg-surface rounded-lg text-text-secondary hover:text-text-primary transition-colors"
                        aria-label="Dismiss"
                    >
                        <X size={18} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
