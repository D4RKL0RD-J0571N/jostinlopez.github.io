import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

/**
 * A reusable, accessible fixed modal component.
 * Features:
 * - Backdrop blur
 * - Framer-motion animations
 * - Portal-ready (though using fixed position here)
 * - Accessible close button
 */
export const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-4xl" }) => {
    // Close on Escape key
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-bg-base/90 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className={cn(
                            "relative w-full bg-bg-base border border-bg-elevated rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col",
                            maxWidth
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-bg-elevated">
                            <h3 className="text-xl font-bold text-text-primary">{title}</h3>
                            <button
                                aria-label="Close Modal"
                                onClick={onClose}
                                className="p-2 text-text-secondary hover:text-text-primary hover:bg-bg-surface rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="overflow-y-auto flex-grow">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
