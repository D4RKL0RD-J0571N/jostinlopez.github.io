import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ZoomIn, CheckCircle2, Layers } from 'lucide-react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { useContent } from '../context/ContentContext';

export default function Gallery() {
    const { t } = useTranslation();
    const { gallery } = useContent();
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Operations', 'AI Systems', 'Game Dev', 'Web Systems'];

    // Ensure gallery is an array before filtering
    const items = Array.isArray(gallery) ? gallery : [];

    const filteredItems = filter === 'All'
        ? items
        : items.filter(item => item.type === filter);

    const handleKeyDown = (e, item) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedItem(item);
        }
    };

    return (
        <section id="creative" className="py-20 bg-bg-base border-t border-bg-elevated/60">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full text-text-primary">
                        {t('gallery.title', 'Technical Showcase & Architecture')}
                    </h2>
                    <p className="mt-6 text-text-secondary max-w-xl mx-auto text-sm md:text-base">
                        {t('gallery.subtitle', 'Dataflows, system blueprints, and engine mechanics in action.')}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-3 mb-12 overflow-x-auto pb-2 flex-wrap" role="tablist">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            role="tab"
                            aria-selected={filter === cat}
                            className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                                filter === cat
                                    ? 'bg-accent text-bg-base font-semibold shadow-lg shadow-accent/20'
                                    : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-bg-elevated'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Showcase Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map((item, i) => (
                            <Card
                                key={item.id || i}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.25 }}
                                onClick={() => setSelectedItem(item)}
                                onKeyDown={(e) => handleKeyDown(e, item)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View ${item.title}`}
                                className="group relative bg-bg-surface border border-bg-elevated/80 hover:border-accent/50 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:-translate-y-1.5 transition-all flex flex-col focus:outline-none focus:ring-2 focus:ring-accent"
                            >
                                {/* Media Banner Header */}
                                <div className="h-52 overflow-hidden bg-bg-base relative border-b border-bg-elevated/60">
                                    <img
                                        src={item.image || '/assets/project-placeholder.svg'}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/assets/project-placeholder.svg';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                    {/* Hover overlay with zoom icon */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-bg-base/40 backdrop-blur-[2px]">
                                        <div className="p-3 bg-bg-surface/90 rounded-full border border-accent/40 shadow-xl text-accent">
                                            <ZoomIn size={22} />
                                        </div>
                                    </div>

                                    <div className="absolute top-3 left-3">
                                        <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-bg-base/90 text-accent border border-accent/30 backdrop-blur-md">
                                            {item.type}
                                        </span>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-base md:text-lg font-bold text-text-primary group-hover:text-accent transition-colors mb-2 line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4">
                                        {item.summary}
                                    </p>

                                    {item.metrics && (
                                        <div className="mt-auto pt-3 border-t border-bg-elevated/50 flex items-center gap-1.5 text-[11px] text-text-secondary font-mono">
                                            <CheckCircle2 size={13} className="text-accent shrink-0" />
                                            <span className="truncate">{item.metrics}</span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </AnimatePresence>
                </div>

                <div className="text-center text-text-secondary mt-14 text-xs md:text-sm border-t border-bg-elevated/50 pt-8 max-w-xl mx-auto flex items-center justify-center gap-2">
                    <Layers size={16} className="text-accent shrink-0" />
                    <span>{t('gallery.disclaimer')}</span>
                </div>
            </div>

            {/* Lightbox Modal */}
            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={selectedItem?.title || ''}
                maxWidth="max-w-5xl"
            >
                {selectedItem && (
                    <div className="p-6 md:p-8 space-y-6 text-text-primary">
                        <div className="w-full rounded-xl overflow-hidden border border-bg-elevated shadow-2xl bg-bg-base">
                            <img
                                src={selectedItem.image || '/assets/project-placeholder.svg'}
                                alt={selectedItem.title}
                                className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/assets/project-placeholder.svg';
                                }}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs font-mono font-semibold text-accent uppercase">
                                    {selectedItem.type}
                                </span>
                            </div>

                            <p className="text-text-primary/90 text-sm md:text-base leading-relaxed">
                                {selectedItem.summary}
                            </p>

                            {selectedItem.metrics && (
                                <div className="p-3.5 bg-bg-surface rounded-xl border border-bg-elevated flex items-start gap-2.5 text-xs text-text-secondary font-mono">
                                    <CheckCircle2 size={16} className="text-accent shrink-0 mt-0.5" />
                                    <span>{selectedItem.metrics}</span>
                                </div>
                            )}

                            {selectedItem.stack && selectedItem.stack.length > 0 && (
                                <div className="flex gap-2 flex-wrap pt-2">
                                    {selectedItem.stack.map(st => (
                                        <span key={st} className="text-xs font-mono bg-bg-elevated/70 text-text-secondary px-2.5 py-1 rounded-md border border-bg-elevated">
                                            {st}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}
