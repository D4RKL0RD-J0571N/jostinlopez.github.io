import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowLeft, Eye, Code, Save, Smartphone, Monitor, Plus, Trash2, GripVertical, Layers, Settings, FileJson, ArrowUp, ArrowDown } from 'lucide-react';
import { Card } from './ui/Card';
import { useContent } from '../context/ContentContext';
import { completeConfigSchema } from '../utils/validation';

export default function ProjectEditor({ onClose }) {
    const {
        projects, addProject, updateProject, deleteProject,
        sectionOrder, moveProject, moveSection,
        globalSettings, updateSettings
    } = useContent();

    const [activeTab, setActiveTab] = useState('projects'); // projects, layout, json, settings
    const [viewport, setViewport] = useState('desktop');
    const [selectedId, setSelectedId] = useState(null);
    const [rawJson, setRawJson] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Update raw JSON when projects/settings change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'json') {
            setRawJson(JSON.stringify({
                projects,
                sectionOrder,
                globalSettings,
                // These might not be in context but should be in the raw JSON
                timeline: JSON.parse(localStorage.getItem('portfolio_timeline') || '[]'),
                gallery: JSON.parse(localStorage.getItem('portfolio_gallery') || '[]')
            }, null, 2));
        }
    };

    const emptyProject = {
        id: '',
        title: '',
        category: 'AI',
        featured: false,
        tags: '',
        description: '',
        repo: '',
        demo: '',
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'
    };

    const [formData, setFormData] = useState(emptyProject);

    const handleSelectProject = (id) => {
        setSelectedId(id);
        if (id) {
            const proj = projects.find(p => p.id === id);
            if (proj) {
                setFormData({
                    ...proj,
                    tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : proj.tags
                });
            }
        } else {
            setFormData(emptyProject);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const projectToSave = {
                ...formData,
                id: formData.id || formData.title.toLowerCase().replace(/\s+/g, '-'),
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            };

            if (selectedId) {
                updateProject(selectedId, projectToSave);
            } else {
                addProject(projectToSave);
                handleSelectProject(projectToSave.id);
            }
            await new Promise(r => setTimeout(r, 500));
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = () => {
        if (selectedId && window.confirm('Are you sure you want to delete this project?')) {
            deleteProject(selectedId);
            handleSelectProject(null);
        }
    };

    const handleJsonUpdate = () => {
        try {
            const parsed = JSON.parse(rawJson);
            const result = completeConfigSchema.safeParse(parsed);

            if (!result.success) {
                const firstError = result.error.issues[0];
                alert(`Validation Error in ${firstError.path.join('.')}: ${firstError.message}`);
                return;
            }

            alert("Configuration Validated Successfully! Reloading to apply...");
            if (parsed.projects) localStorage.setItem('portfolio_projects', JSON.stringify(parsed.projects));
            if (parsed.sectionOrder) localStorage.setItem('portfolio_section_order', JSON.stringify(parsed.sectionOrder));
            if (parsed.globalSettings) localStorage.setItem('portfolio_settings', JSON.stringify(parsed.globalSettings));
            if (parsed.gallery) localStorage.setItem('portfolio_gallery', JSON.stringify(parsed.gallery));
            if (parsed.timeline) localStorage.setItem('portfolio_timeline', JSON.stringify(parsed.timeline));
            window.location.reload();
        } catch (e) {
            alert("JSON Syntax Error: " + e.message);
        }
    };

    const handleReorderKeyDown = (e, item, type, index, items) => {
        if (e.key === 'ArrowUp' && index > 0) {
            e.preventDefault();
            type === 'section' ? moveSection(item, 'up') : moveProject(item, 'up');
        } else if (e.key === 'ArrowDown' && index < items.length - 1) {
            e.preventDefault();
            type === 'section' ? moveSection(item, 'down') : moveProject(item, 'down');
        }
    };

    const inputClasses = "w-full bg-bg-surface border border-bg-elevated rounded-lg px-4 py-3 text-text-primary focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all placeholder:text-text-secondary/30";

    return (
        <div className="fixed inset-0 z-[100] bg-bg-base overflow-hidden flex flex-col">
            <header className="h-16 flex items-center justify-between px-6 border-b border-bg-elevated bg-bg-base/80 backdrop-blur-xl z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-bg-surface rounded-lg transition-colors text-text-secondary hover:text-text-primary focus:ring-2 focus:ring-accent/50 outline-none">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-text-primary hidden md:block">
                        CMS Command Center
                    </h1>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-bg-surface p-1 rounded-lg border border-bg-elevated">
                        {[
                            { id: 'projects', icon: Code, label: 'Projects' },
                            { id: 'layout', icon: Layers, label: 'Layout' },
                            { id: 'settings', icon: Settings, label: 'Design' },
                            { id: 'json', icon: FileJson, label: 'JSON' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-accent/50 ${activeTab === tab.id ? 'bg-bg-elevated text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                <tab.icon size={14} /> {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="flex-grow flex overflow-hidden">
                {/* Sidebar */}
                {['projects', 'layout'].includes(activeTab) && (
                    <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-bg-elevated bg-bg-base flex flex-col overflow-hidden shrink-0">
                        <div className="p-4 border-b border-bg-elevated flex justify-between items-center bg-bg-surface/50">
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                                {activeTab === 'projects' ? 'All Projects' : 'Section Order'}
                            </span>
                            {activeTab === 'projects' && (
                                <button onClick={() => handleSelectProject(null)} className="p-1.5 hover:bg-bg-elevated rounded-md text-accent transition-colors" aria-label="Add new project">
                                    <Plus size={18} />
                                </button>
                            )}
                        </div>

                        <div className="overflow-y-auto flex-grow p-3 space-y-1.5 scrollbar-thin" role="listbox">
                            {activeTab === 'projects' ? (
                                projects.map((p, index) => (
                                    <div
                                        key={p.id}
                                        className="flex items-center gap-2 group focus-within:ring-2 focus-within:ring-accent/50 rounded-lg p-0.5"
                                        onKeyDown={(e) => handleReorderKeyDown(e, p.id, 'project', index, projects)}
                                    >
                                        <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={(e) => { e.stopPropagation(); moveProject(p.id, 'up'); }} className="text-text-secondary hover:text-accent p-0.5" aria-label="Move up"><ArrowUp size={10} /></button>
                                            <button onClick={(e) => { e.stopPropagation(); moveProject(p.id, 'down'); }} className="text-text-secondary hover:text-accent p-0.5" aria-label="Move down"><ArrowDown size={10} /></button>
                                        </div>
                                        <button
                                            onClick={() => handleSelectProject(p.id)}
                                            className={`flex-grow text-left px-3 py-2 rounded-lg text-sm transition-all truncate border ${selectedId === p.id ? 'bg-accent/10 border-accent/20 text-accent font-medium shadow-sm' : 'border-transparent text-text-secondary hover:bg-bg-surface hover:text-text-primary'}`}
                                        >
                                            {p.title || 'Untitled Project'}
                                        </button>
                                    </div>
                                ))
                            ) : (
                                sectionOrder.map((section, idx) => (
                                    <div
                                        key={section}
                                        tabIndex={0}
                                        onKeyDown={(e) => handleReorderKeyDown(e, section, 'section', idx, sectionOrder)}
                                        className="flex items-center justify-between px-4 py-3 bg-bg-surface rounded-lg border border-bg-elevated mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/50 group"
                                        aria-label={`Section: ${section}. Use arrow keys to reorder.`}
                                    >
                                        <span className="text-sm font-medium capitalize text-text-primary">{section}</span>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => moveSection(section, 'up')}
                                                disabled={idx === 0}
                                                className="text-text-secondary hover:text-accent disabled:opacity-30 p-1"
                                                aria-label={`Move ${section} section up`}
                                                tabIndex={-1}
                                            >
                                                <ArrowUp size={14} />
                                            </button>
                                            <button
                                                onClick={() => moveSection(section, 'down')}
                                                disabled={idx === sectionOrder.length - 1}
                                                className="text-text-secondary hover:text-accent disabled:opacity-30 p-1"
                                                aria-label={`Move ${section} section down`}
                                                tabIndex={-1}
                                            >
                                                <ArrowDown size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </aside>
                )}

                {/* Main Content Areas */}
                <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
                    {activeTab === 'projects' && (
                        <>
                            <div className="flex-grow flex flex-col h-full max-w-3xl border-r border-bg-elevated bg-bg-base">
                                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                                    {/* Identity Section */}
                                    <section className="space-y-4 bg-bg-surface/50 p-6 rounded-xl border border-bg-elevated/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-2">
                                                <Smartphone size={16} /> Identity & Core Info
                                            </h3>
                                            <label className="flex items-center gap-2 cursor-pointer group px-3 py-1.5 rounded-full bg-bg-elevated/50 hover:bg-bg-elevated transition-colors border border-transparent hover:border-accent/30">
                                                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="hidden" />
                                                <div className={`w-8 h-4 rounded-full relative transition-all ${formData.featured ? 'bg-accent' : 'bg-text-secondary/30'}`}>
                                                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${formData.featured ? 'left-4.5' : 'left-0.5'}`} />
                                                </div>
                                                <span className="text-xs font-bold text-text-secondary group-hover:text-text-primary transition-colors">Featured</span>
                                            </label>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label htmlFor="title" className="text-sm font-medium text-text-secondary pl-1">Project Name</label>
                                                <input id="title" name="title" value={formData.title} onChange={handleChange} className={inputClasses} placeholder="e.g. Neural Network Vis..." />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="category" className="text-sm font-medium text-text-secondary pl-1">Category</label>
                                                <select id="category" name="category" value={formData.category} onChange={handleChange} className={`${inputClasses} appearance-none cursor-pointer`}>
                                                    <option>AI</option>
                                                    <option>Game Systems</option>
                                                    <option>Tools</option>
                                                    <option>Creative</option>
                                                    <option>Full Stack</option>
                                                </select>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Content */}
                                    <section className="space-y-4 bg-bg-surface/50 p-6 rounded-xl border border-bg-elevated/50">
                                        <h3 className="text-sm font-bold text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Eye size={16} /> Visuals & Content
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="space-y-1.5">
                                                <label htmlFor="thumbnail" className="text-sm font-medium text-text-secondary pl-1">Thumbnail URL</label>
                                                <div className="flex gap-2">
                                                    <input id="thumbnail" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className={inputClasses} />
                                                    <div className="w-12 h-10 rounded overflow-hidden bg-bg-base border border-bg-elevated flex-shrink-0">
                                                        <img src={formData.thumbnail} className="w-full h-full object-cover" onError={(e) => e.target.style.opacity = 0} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label htmlFor="description" className="text-sm font-medium text-text-secondary pl-1">Description</label>
                                                <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className={`${inputClasses} resize-none leading-relaxed`} placeholder="Brief overview..." />
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <div className="p-4 border-t border-bg-elevated bg-bg-base/95 backdrop-blur z-10 flex gap-3">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        aria-busy={isSaving}
                                        className="flex-grow btn-primary py-3 font-bold text-sm flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <div className="w-4 h-4 border-2 border-bg-base border-t-transparent rounded-full animate-spin" />
                                        ) : <Save size={16} />}
                                        {selectedId ? 'Save Changes' : 'Create Project'}
                                    </button>
                                    {selectedId && (
                                        <button onClick={handleDelete} className="px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20">
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="hidden lg:flex flex-grow bg-bg-surface relative flex-col items-center justify-center p-8 border-l border-bg-elevated overflow-hidden">
                                <div className="absolute top-4 right-4 flex gap-2 bg-bg-base p-1 rounded-lg border border-bg-elevated z-10">
                                    <button onClick={() => setViewport('desktop')} className={`p-2 rounded ${viewport === 'desktop' ? 'bg-bg-elevated text-accent' : 'text-text-secondary'}`} aria-label="Desktop view"><Monitor size={16} /></button>
                                    <button onClick={() => setViewport('mobile')} className={`p-2 rounded ${viewport === 'mobile' ? 'bg-bg-elevated text-accent' : 'text-text-secondary'}`} aria-label="Mobile view"><Smartphone size={16} /></button>
                                </div>
                                <AnimatePresence mode="wait">
                                    <motion.div key={viewport} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full ${viewport === 'mobile' ? 'max-w-[320px]' : 'max-w-md'}`}>
                                        <Card>
                                            <div className="h-40 overflow-hidden bg-bg-base border-b border-bg-elevated">
                                                <img src={formData.thumbnail} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="p-6">
                                                <h4 className="text-xl font-bold mb-2 text-text-primary line-clamp-1">{formData.title || 'Title'}</h4>
                                                <p className="text-text-secondary text-sm line-clamp-3">{formData.description || 'Preview...'}</p>
                                            </div>
                                        </Card>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </>
                    )}

                    {activeTab === 'layout' && (
                        <div className="flex-grow flex items-center justify-center p-12 text-center">
                            <div className="max-w-md">
                                <Layers size={48} className="mx-auto mb-4 text-text-secondary opacity-50" />
                                <h2 className="text-xl font-bold text-text-primary mb-2">Layout Order</h2>
                                <p className="text-text-secondary">Use the sidebar to reorder sections. Changes are live.</p>
                                <div className="mt-8 space-y-2 text-left">
                                    <p className="text-xs font-mono text-accent">TIP: You can use Arrow Up/Down to move sections after focusing them in the sidebar.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="flex-grow p-12 overflow-y-auto">
                            <h2 className="text-2xl font-bold mb-8 text-text-primary">Design Settings</h2>
                            <div className="max-w-xl space-y-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-text-secondary uppercase tracking-widest block">Accent Color</label>
                                    <div className="flex gap-4">
                                        <input type="color" value={globalSettings.accentColor} onChange={(e) => updateSettings({ accentColor: e.target.value })} className="h-10 w-20 rounded cursor-pointer bg-transparent" />
                                        <input type="text" value={globalSettings.accentColor} onChange={(e) => updateSettings({ accentColor: e.target.value })} className={inputClasses} />
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-bg-elevated space-y-4">
                                    <label className="text-sm font-bold text-text-secondary uppercase tracking-widest block">Form Endpoint</label>
                                    <input type="url" value={globalSettings.formEndpoint || ''} onChange={(e) => updateSettings({ formEndpoint: e.target.value })} className={inputClasses} placeholder="https://formspree.io/f/..." />
                                </div>
                                <div className="pt-6 border-t border-bg-elevated space-y-4">
                                    <label className="text-sm font-bold text-text-secondary uppercase tracking-widest block">Contact Information</label>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-text-secondary pl-1">Public Email</label>
                                            <input type="email" value={globalSettings.email || ''} onChange={(e) => updateSettings({ email: e.target.value })} className={inputClasses} placeholder="hello@example.com" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-text-secondary pl-1">GitHub URL</label>
                                            <input type="url" value={globalSettings.github || ''} onChange={(e) => updateSettings({ github: e.target.value })} className={inputClasses} placeholder="https://github.com/..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-text-secondary pl-1">LinkedIn URL</label>
                                            <input type="url" value={globalSettings.linkedin || ''} onChange={(e) => updateSettings({ linkedin: e.target.value })} className={inputClasses} placeholder="https://linkedin.com/in/..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-text-secondary pl-1">Resume Path/URL</label>
                                            <input type="text" value={globalSettings.resumeUrl || ''} onChange={(e) => updateSettings({ resumeUrl: e.target.value })} className={inputClasses} placeholder="/resume.pdf" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'json' && (
                        <div className="flex-grow flex flex-col h-full">
                            <div className="p-4 border-b border-bg-elevated bg-bg-surface flex justify-between items-center">
                                <div className="text-sm font-bold text-text-secondary">Raw JSON Editor</div>
                                <button onClick={handleJsonUpdate} className="btn-primary py-1.5 px-4 text-sm">Apply & Reload</button>
                            </div>
                            <textarea
                                className="flex-grow w-full bg-[#0d1117] text-gray-300 font-mono text-sm p-4 outline-none resize-none"
                                value={rawJson}
                                onChange={(e) => setRawJson(e.target.value)}
                                spellCheck="false"
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
