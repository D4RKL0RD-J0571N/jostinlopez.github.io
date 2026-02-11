import React, { useState } from 'react';
import { X } from 'lucide-react';

/**
 * Custom Widget for RJSF to handle Tag arrays.
 * Using a Widget instead of a Field for better compatibility and scoped updates.
 */
export const TagsWidget = ({ value, onChange, placeholder }) => {
    const [inputValue, setInputValue] = useState('');
    const tags = Array.isArray(value) ? value : [];

    const handleAdd = () => {
        const val = inputValue.trim();
        if (val && !tags.includes(val)) {
            onChange([...tags, val]);
            setInputValue('');
        }
    };

    const handleRemove = (tagToRemove) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAdd();
        }
        if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            handleRemove(tags[tags.length - 1]);
        }
    };

    return (
        <div className="tags-widget-wrapper">
            <div className="flex flex-wrap gap-2.5 p-4 bg-bg-surface border border-bg-elevated rounded-2xl focus-within:border-accent/50 focus-within:ring-4 focus-within:ring-accent/5 transition-all duration-300">
                {tags.map((tag, i) => (
                    <span key={i} className="flex items-center gap-2 pl-3 pr-2 py-1.5 bg-bg-elevated text-text-primary border border-bg-elevated rounded-xl text-sm font-semibold hover:border-accent/30 transition-colors group">
                        <span className="opacity-80 group-hover:opacity-100">{tag}</span>
                        <button
                            type="button"
                            onClick={() => handleRemove(tag)}
                            className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all opacity-40 group-hover:opacity-100"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleAdd}
                    className="flex-grow min-w-[140px] bg-transparent outline-none text-text-primary placeholder:text-text-secondary/30 font-medium py-1"
                    placeholder={placeholder || "Add technology..."}
                />
            </div>
            <div className="flex items-center gap-2 mt-3 pl-1">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.1em] opacity-40">
                    Press Enter to tokenize tags.
                </p>
            </div>
        </div>
    );
};
