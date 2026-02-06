import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

/**
 * A reusable, accessible Card component that handles:
 * - Keyboard interactions (Enter/Space)
 * - ARIA roles for accessibility
 * - Centralized styling (bg-slate-800, border-slate-700)
 * - Hover effects and scale animations
 */
export const Card = ({
    children,
    className,
    onClick,
    layoutId,
    initial,
    whileInView,
    whileHover,
    viewport,
    transition,
    ...props
}) => {
    const isClickable = !!onClick;

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.(e);
        }
    };

    return (
        <motion.div
            layoutId={layoutId}
            initial={initial}
            whileInView={whileInView}
            whileHover={isClickable ? (whileHover || { y: -8, transition: { duration: 0.3 } }) : undefined}
            viewport={viewport}
            transition={transition}
            role={isClickable ? "button" : "article"}
            tabIndex={isClickable ? 0 : undefined}
            onClick={onClick}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            className={cn(
                "glass-card transition-all",
                isClickable && "cursor-pointer hover:border-accent/50 hover:shadow-2xl hover:shadow-accent/10 focus:outline-none focus:ring-2 focus:ring-accent/50",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
