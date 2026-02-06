import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { X, ZoomIn } from 'lucide-react';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { cn } from '../lib/utils';

import { useContent } from '../context/ContentContext';

export default function Gallery() {
    const { t } = useTranslation();
    const { gallery } = useContent();
    const [selectedItem, setSelectedItem] = useState(null);
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'AI Art', 'Illustration', '3D', 'Experiment'];

    // Ensure gallery is an array before filtering
    const items = Array.isArray(gallery) ? gallery : [];

    const filteredItems = filter === 'All'
        ? items
        : items.filter(item => item.type === filter);

    return (
        <section id="creative" className="py-20 bg-bg-base border-t border-bg-elevated">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full">
                        {t('gallery.title')}
                    </h2>
                </div>

                {/* Filters */}
                <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-4">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap 
                        ${filter === cat
                                    ? 'bg-accent text-bg-base'
                                    : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]">
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map((item, i) => (
                            <Card
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setSelectedItem(item)}
                                className={`relative group ${(i % 5 === 0) ? 'md:col-span-2 md:row-span-2' : ''} ${item.color}`}
                            >
                                {/* Placeholder content */}
                                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 transition-opacity group-hover:opacity-10">
                                    <div className="w-20 h-20 rounded-full bg-current opacity-10 animate-pulse" />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                                {/* Hover Overlay Icon */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ZoomIn className="text-accent w-10 h-10 drop-shadow-lg" />
                                </div>

                                <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="text-xs font-mono text-accent block mb-1 uppercase tracking-wider">{item.type}</span>
                                    <h3 className="text-xl font-bold text-text-primary leading-tight">{item.title}</h3>
                                </div>
                            </Card>
                        ))}
                    </AnimatePresence>
                </div>

                <p className="text-center text-text-secondary mt-12 italic text-sm border-t border-bg-elevated/50 pt-8 max-w-lg mx-auto">
                    "{t('gallery.disclaimer')}"
                </p>
            </div>

            {/* Lightbox Modal */}
            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title={selectedItem?.title || ''}
                maxWidth="max-w-5xl"
            >
                <div className="flex flex-col items-center p-6 text-text-primary">
                    <div className={cn(
                        "w-full aspect-video rounded-lg flex items-center justify-center mb-6 border border-bg-elevated",
                        selectedItem?.color
                    )}>
                        <span className="text-text-secondary font-mono">Image Placeholder: {selectedItem?.title}</span>
                    </div>
                    <div className="text-center">
                        <span className="px-3 py-1 bg-bg-surface rounded-full text-xs font-mono text-accent">{selectedItem?.type}</span>
                    </div>
                </div>
            </Modal>

        </section>
    );
}
