import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { useContent } from '../context/ContentContext';
import { useEffect } from 'react';

export default function Projects() {
    const { projects } = useContent();
    const [selectedProject, setSelectedProject] = useState(null);
    const { t } = useTranslation();

    const featured = projects.filter(p => p.featured);
    const others = projects.filter(p => !p.featured);

    useEffect(() => {
        if (!selectedProject) return;

        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, [selectedProject]);

    const handleKeyDown = (e, project) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedProject(project);
        }
    };

    return (
        <section id="projects" className="py-20 bg-bg-base">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full">
                        {t('projects.featured')}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featured.map((project, index) => (
                        <Card
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            layoutId={`card-${project.id}`}
                            onClick={() => setSelectedProject(project)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => handleKeyDown(e, project)}
                            className="group hover:-translate-y-2 h-full flex flex-col shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
                        >
                            <div className="h-56 overflow-hidden bg-bg-base relative border-b border-bg-elevated/50">
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                    onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
                                />
                                <div className="hidden absolute inset-0 items-center justify-center bg-bg-base text-text-secondary font-mono text-sm">
                                    // NO_ASSET
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    {project.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-text-secondary text-sm mb-4 line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="text-accent text-sm font-medium flex items-center mt-auto opacity-70 group-hover:opacity-100 transition-opacity">
                                    {t('projects.details')} &rarr;
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h3 className="text-2xl font-bold text-text-secondary inline-block relative after:content-[''] after:absolute after:-bottom-3 after:left-1/2 after:-translate-x-1/2 after:w-12 after:h-0.5 after:bg-bg-elevated after:rounded-full">
                            {t('projects.index')}
                        </h3>
                    </div>
                    <div className="grid gap-4">
                        {others.map((project, i) => (
                            <Card
                                key={project.id}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                viewport={{ once: true }}
                                onClick={() => setSelectedProject(project)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => handleKeyDown(e, project)}
                                className="bg-bg-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-bg-elevated hover:border-accent/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                            >
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h4 className="font-bold text-lg text-text-primary group-hover:text-accent transition-colors">{project.title}</h4>
                                        <span className="text-[10px] font-mono text-text-secondary border border-bg-elevated px-1 rounded uppercase tracking-wider">{project.category}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary">{project.description}</p>
                                </div>
                                <div className="flex items-center gap-4 shrink-0">
                                    <div className="text-sm text-accent hover:text-accent/80 px-4 py-2 bg-bg-surface rounded border border-bg-elevated hover:border-accent/30 transition-colors">
                                        {t('projects.details')}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-bg-base/90 backdrop-blur-sm"
                        />

                        <motion.div
                            layoutId={`card-${selectedProject.id}`}
                            className="relative w-full max-w-4xl bg-bg-base border border-bg-elevated rounded-2xl overflow-hidden shadow-2xl z-10 max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); setSelectedProject(null); }}
                                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors z-20"
                            >
                                <X size={20} />
                            </button>

                            {/* Modal Image Section */}
                            <div className="w-full md:w-2/5 h-64 md:h-auto bg-bg-base relative">
                                <img
                                    src={selectedProject.thumbnail}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent md:bg-gradient-to-r" />
                            </div>

                            {/* Modal Content Section */}
                            <div className="w-full md:w-3/5 p-8 flex flex-col text-text-primary">
                                <div className="mb-6">
                                    <h3 className="text-3xl font-bold mb-3">{selectedProject.title}</h3>
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {selectedProject.tags.map(tag => (
                                            <span key={tag} className="text-xs font-mono text-accent bg-accent/10 px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-sm max-w-none flex-grow">
                                    <p className="text-text-primary/90 leading-relaxed mb-6 text-base">
                                        {selectedProject.long_description || selectedProject.description}
                                    </p>

                                    <div className="mt-6 pt-6 border-t border-bg-elevated">
                                        <h4 className="font-bold text-text-primary mb-3 text-sm uppercase tracking-wide opacity-70">{t('projects.modal.techStack')}</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            {selectedProject.tags.map(t => (
                                                <div key={t} className="flex items-center gap-2 text-sm text-text-secondary">
                                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                                    {t}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3 pt-6 border-t border-bg-elevated">
                                    {selectedProject.links?.repo && (
                                        <a href={selectedProject.links.repo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 border border-bg-elevated bg-bg-surface rounded-lg hover:bg-bg-elevated hover:text-text-primary transition-colors text-text-secondary text-sm font-medium">
                                            <Github size={18} />
                                            {t('projects.viewCode')}
                                        </a>
                                    )}
                                    {selectedProject.links?.demo && (
                                        <a href={selectedProject.links.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-accent text-bg-base rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium shadow-lg shadow-accent/20">
                                            <ExternalLink size={18} />
                                            Live Demo
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
}
