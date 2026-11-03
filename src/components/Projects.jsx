import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from './ui/Card';
import { useContent } from '../context/ContentContext';

export default function Projects() {
    const { projects } = useContent();
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeCategory, setActiveCategory] = useState('All');
    const { t } = useTranslation();

    const categoryKeys = [
        { id: 'All', labelKey: 'projects.categories.all' },
        { id: 'Operations & Backend', labelKey: 'projects.categories.operations' },
        { id: 'Game Systems & Architecture', labelKey: 'projects.categories.games' },
        { id: 'Web Architecture & Tools', labelKey: 'projects.categories.web' }
    ];

    const filteredProjects = activeCategory === 'All'
        ? projects
        : projects.filter(p => p.category === activeCategory);

    const featured = filteredProjects.filter(p => p.featured);
    const others = filteredProjects.filter(p => !p.featured);

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
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold inline-block relative after:content-[''] after:absolute after:-bottom-4 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-accent after:rounded-full">
                        {t('projects.featured')}
                    </h2>
                </div>

                {/* Category Filters */}
                <div className="flex justify-center gap-3 mb-14 overflow-x-auto pb-2 flex-wrap" role="tablist">
                    {categoryKeys.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            role="tab"
                            aria-selected={activeCategory === cat.id}
                            className={`px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all ${
                                activeCategory === cat.id
                                    ? 'bg-accent text-bg-base shadow-lg shadow-accent/20 font-semibold'
                                    : 'bg-bg-surface text-text-secondary hover:text-text-primary hover:bg-bg-elevated border border-bg-elevated'
                            }`}
                        >
                            {t(cat.labelKey)}
                        </button>
                    ))}
                </div>

                {/* Featured Projects Grid */}
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
                            aria-label={`View details for ${project.title}`}
                            onKeyDown={(e) => handleKeyDown(e, project)}
                            className="group hover:-translate-y-2 h-full flex flex-col shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent border border-bg-elevated/70 hover:border-accent/50 transition-all duration-300 rounded-2xl overflow-hidden"
                        >
                            <div className="h-56 overflow-hidden bg-bg-surface relative border-b border-bg-elevated/50">
                                <img
                                    src={project.thumbnail}
                                    alt={project.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-95 group-hover:opacity-100"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/project-placeholder.svg';
                                    }}
                                />
                                <div className="absolute top-3 right-3">
                                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-bg-base/90 text-accent border border-accent/30 backdrop-blur-md">
                                        {project.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    {project.tags.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                    {project.title}
                                </h3>
                                <p className="text-text-secondary text-sm mb-4 line-clamp-3 leading-relaxed">
                                    {project.description}
                                </p>

                                {project.metrics && project.metrics.length > 0 && (
                                    <div className="mb-4 pt-3 border-t border-bg-elevated/40">
                                        <div className="flex items-center gap-1.5 text-xs text-text-primary/90 font-medium">
                                            <CheckCircle2 size={14} className="text-accent shrink-0" />
                                            <span className="truncate">{project.metrics[0]}</span>
                                        </div>
                                    </div>
                                )}

                                <div className="text-accent text-sm font-semibold flex items-center mt-auto opacity-80 group-hover:opacity-100 transition-opacity gap-1">
                                    <span>{t('projects.details')}</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Index / Secondary Projects List */}
                {others.length > 0 && (
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
                                    aria-label={`View details for ${project.title}`}
                                    onKeyDown={(e) => handleKeyDown(e, project)}
                                    className="bg-bg-surface p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-bg-elevated hover:border-accent/40 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent transition-all rounded-xl"
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                                            <h4 className="font-bold text-lg text-text-primary group-hover:text-accent transition-colors">
                                                {project.title}
                                            </h4>
                                            <span className="text-[10px] font-mono text-accent border border-accent/20 bg-accent/5 px-2 py-0.5 rounded uppercase tracking-wider">
                                                {project.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-text-secondary leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <div className="text-sm font-medium text-accent hover:text-accent-hover px-4 py-2 bg-bg-base rounded-lg border border-bg-elevated hover:border-accent/30 transition-colors">
                                            {t('projects.details')} &rarr;
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
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
                                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/90 rounded-full text-white transition-colors z-20 focus:outline-none focus:ring-2 focus:ring-accent"
                                aria-label={t('projects.modal.close')}
                            >
                                <X size={20} />
                            </button>

                            {/* Modal Image Section */}
                            <div className="w-full md:w-5/12 h-64 md:h-auto bg-bg-surface relative border-b md:border-b-0 md:border-r border-bg-elevated/50">
                                <img
                                    src={selectedProject.thumbnail}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/project-placeholder.svg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-base via-transparent to-transparent md:bg-gradient-to-r" />
                            </div>

                            {/* Modal Content Section */}
                            <div className="w-full md:w-7/12 p-8 flex flex-col text-text-primary">
                                <div className="mb-6">
                                    <span className="text-xs font-mono uppercase tracking-widest text-accent mb-2 block font-semibold">
                                        {selectedProject.category}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                                        {selectedProject.title}
                                    </h3>
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {selectedProject.tags.map(tag => (
                                            <span key={tag} className="text-xs font-mono text-accent bg-accent/10 px-2.5 py-0.5 rounded border border-accent/20">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="prose prose-invert prose-sm max-w-none flex-grow">
                                    <p className="text-text-primary/90 leading-relaxed mb-6 text-base">
                                        {selectedProject.long_description || selectedProject.description}
                                    </p>

                                    {/* Engineering Highlights / Metrics */}
                                    {selectedProject.metrics && selectedProject.metrics.length > 0 && (
                                        <div className="mt-6 pt-5 border-t border-bg-elevated">
                                            <h4 className="font-bold text-text-primary mb-3 text-xs uppercase tracking-wider opacity-70">
                                                {t('projects.metrics')}
                                            </h4>
                                            <div className="grid sm:grid-cols-2 gap-2.5">
                                                {selectedProject.metrics.map(metric => (
                                                    <div key={metric} className="flex items-start gap-2 text-xs text-text-secondary bg-bg-surface/50 p-2 rounded-lg border border-bg-elevated">
                                                        <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                                                        <span>{metric}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-6 pt-5 border-t border-bg-elevated">
                                        <h4 className="font-bold text-text-primary mb-3 text-xs uppercase tracking-wider opacity-70">
                                            {t('projects.modal.techStack')}
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {selectedProject.tags.map(tech => (
                                                <div key={tech} className="flex items-center gap-2 text-xs text-text-secondary">
                                                    <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                                                    {tech}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3 pt-6 border-t border-bg-elevated flex-wrap">
                                    {selectedProject.links?.repo && (
                                        <a
                                            href={selectedProject.links.repo}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 border border-bg-elevated bg-bg-surface rounded-lg hover:bg-bg-elevated hover:text-text-primary transition-colors text-text-secondary text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            <Github size={18} />
                                            {t('projects.viewCode')}
                                        </a>
                                    )}
                                    {selectedProject.links?.demo && (
                                        <a
                                            href={selectedProject.links.demo}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-accent text-bg-base rounded-lg hover:bg-accent-hover transition-colors text-sm font-semibold shadow-lg shadow-accent/20 focus:outline-none focus:ring-2 focus:ring-accent"
                                        >
                                            <ExternalLink size={18} />
                                            {t('projects.modal.liveDemo')}
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
