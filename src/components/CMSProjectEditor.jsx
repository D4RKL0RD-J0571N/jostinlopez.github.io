import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Save, Plus, Trash2, Settings, FileJson, Layers, Image as ImageIcon, Calendar, Smartphone, Monitor } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import SchemaForm from './SchemaForm';
import SchemaPreview from './SchemaPreview';
import portfolioSchema from '../data/portfolio.schema.json';

// Helper to generate IDs
const generateId = (prefix) => `${prefix}-${Date.now().toString(36)}`;

export default function CMSProjectEditor({ onClose }) {
    const {
        projects, addProject, updateProject, deleteProject,
        timeline, addTimelineItem, updateTimelineItem, deleteTimelineItem,
        gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem,
        globalSettings, updateSettings, resetData,
        sectionOrder, moveProject, moveSection
    } = useContent();

    const [activeTab, setActiveTab] = useState('projects'); // projects, timeline, gallery, settings, json
    const [selectedId, setSelectedId] = useState(null);
    const [viewport, setViewport] = useState('desktop');
    const [jsonPreview, setJsonPreview] = useState('');

    // Prepare Schema & Data based on selection
    const [currentSchema, setCurrentSchema] = useState(null);
    const [currentFormData, setCurrentFormData] = useState(null);

    // Sync form data when selection changes
    useEffect(() => {
        let schema, data;

        if (activeTab === 'settings') {
            schema = portfolioSchema.properties.globalSettings;
            data = globalSettings;
            setSelectedId('global');
        } else if (activeTab === 'projects') {
            schema = portfolioSchema.properties.projects.items;
            data = selectedId ? projects.find(p => p.id === selectedId) : null;
        } else if (activeTab === 'timeline') {
            schema = portfolioSchema.properties.timeline.items;
            data = selectedId ? timeline.find(t => t.id === selectedId) : null;
        } else if (activeTab === 'gallery') {
            schema = portfolioSchema.properties.gallery.items;
            data = selectedId ? gallery.find(g => g.id === selectedId) : null;
        }

        setCurrentSchema(schema);
        setCurrentFormData(data || {});
        // Update JSON preview
        setJsonPreview(JSON.stringify(data || {}, null, 2));
    }, [activeTab, selectedId, projects, timeline, gallery, globalSettings]);

    const handleFormChange = ({ formData }) => {
        setCurrentFormData(formData);
        setJsonPreview(JSON.stringify(formData, null, 2));
    };

    const handleSave = ({ formData }) => {
        if (activeTab === 'settings') {
            updateSettings(formData);
        } else if (activeTab === 'projects') {
            if (selectedId) {
                updateProject(selectedId, formData);
            } else {
                const newId = formData.id || generateId('proj');
                addProject({ ...formData, id: newId });
                setSelectedId(newId);
            }
        } else if (activeTab === 'timeline') {
            if (selectedId) {
                updateTimelineItem(selectedId, formData);
            } else {
                const newId = formData.id || generateId('time');
                addTimelineItem({ ...formData, id: newId });
                setSelectedId(newId);
            }
        } else if (activeTab === 'gallery') {
            if (selectedId) {
                updateGalleryItem(selectedId, formData);
            } else {
                const newId = formData.id || formData.id || generateId('gal');
                addGalleryItem({ ...formData, id: newId });
                setSelectedId(newId);
            }
        }
    };

    const handleDelete = () => {
        if (!selectedId || activeTab === 'settings') return;
        if (window.confirm('Are you sure you want to delete this item?')) {
            if (activeTab === 'projects') deleteProject(selectedId);
            if (activeTab === 'timeline') deleteTimelineItem(selectedId);
            if (activeTab === 'gallery') deleteGalleryItem(selectedId);
            setSelectedId(null);
        }
    };

    const handleCreateNew = () => {
        setSelectedId(null);
        setCurrentFormData({});
    };

    const tabs = [
        { id: 'projects', icon: Layers, label: 'Projects' },
        { id: 'timeline', icon: Calendar, label: 'Timeline' },
        { id: 'gallery', icon: ImageIcon, label: 'Gallery' },
        { id: 'settings', icon: Settings, label: 'Global' },
        // { id: 'json', icon: FileJson, label: 'JSON' } // Could implement full JSON view later
    ];

    const uiSchema = {
        "ui:submitButtonOptions": {
            "norender": true
        },
        "tags": {
            "ui:widget": "tags"
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-bg-base flex flex-col overflow-hidden text-text-primary select-text selection:bg-accent/30">
            {/* Header */}
            <header className="h-16 border-b border-bg-elevated flex items-center justify-between px-6 bg-bg-base/80 backdrop-blur-md z-30">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="p-2 hover:bg-bg-elevated rounded-lg transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold hidden md:block">CMS Command Center</h1>
                </div>
                <div className="flex gap-2 bg-bg-surface p-1 rounded-lg border border-bg-elevated">
                    {tabs.map(t => (
                        <button
                            key={t.id}
                            onClick={() => { setActiveTab(t.id); setSelectedId(null); }}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === t.id ? 'bg-bg-elevated text-accent shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                        >
                            <t.icon size={16} /> <span className="hidden sm:inline">{t.label}</span>
                        </button>
                    ))}
                </div>
            </header>

            <div className="flex-grow flex overflow-hidden">
                {/* Sidebar List */}
                {activeTab !== 'settings' && (
                    <aside className="w-64 border-r border-bg-elevated flex flex-col bg-bg-surface/30 z-20">
                        <div className="p-4 border-b border-bg-elevated flex justify-between items-center">
                            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">{activeTab}</span>
                            <button onClick={handleCreateNew} className="p-1.5 hover:bg-bg-elevated rounded text-accent">
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="overflow-y-auto flex-grow p-2 space-y-1 scrollbar-thin">
                            {/* List Items */}
                            {activeTab === 'projects' && projects.map(p => (
                                <button key={p.id} onClick={() => setSelectedId(p.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors ${selectedId === p.id ? 'bg-accent/10 text-accent font-medium' : 'hover:bg-bg-elevated text-text-secondary hover:text-text-primary'}`}>
                                    {p.title || 'Untitled'}
                                </button>
                            ))}
                            {activeTab === 'timeline' && timeline.map(t => (
                                <button key={t.id} onClick={() => setSelectedId(t.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors ${selectedId === t.id ? 'bg-accent/10 text-accent font-medium' : 'hover:bg-bg-elevated text-text-secondary hover:text-text-primary'}`}>
                                    {t.period} - {t.title}
                                </button>
                            ))}
                            {activeTab === 'gallery' && gallery.map(g => (
                                <button key={g.id} onClick={() => setSelectedId(g.id)} className={`w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors ${selectedId === g.id ? 'bg-accent/10 text-accent font-medium' : 'hover:bg-bg-elevated text-text-secondary hover:text-text-primary'}`}>
                                    {g.title || 'Untitled'}
                                </button>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Main Form Area */}
                <main className="flex-grow flex flex-col md:flex-row overflow-hidden bg-bg-base relative">
                    {(activeTab === 'settings' || selectedId || (!selectedId && activeTab !== 'settings')) ? (
                        <>
                            {/* Form Column */}
                            <div className="flex-1 w-full border-r border-bg-elevated overflow-y-auto p-8 lg:p-12 relative scrollbar-thin pb-32">
                                <div className="mb-10 flex justify-between items-start max-w-5xl mx-auto">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-bold tracking-tight">{activeTab === 'settings' ? 'Global Configuration' : (selectedId ? 'Modify Record' : 'Create New Entry')}</h2>
                                        <p className="text-text-secondary/60 text-sm">Update your portfolio data with real-time validation.</p>
                                    </div>
                                    {selectedId && activeTab !== 'settings' && (
                                        <button onClick={handleDelete} className="text-red-400 hover:text-red-300 p-2.5 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20">
                                            <Trash2 size={20} />
                                        </button>
                                    )}
                                </div>

                                <div className="rjsf-container max-w-5xl mx-auto">
                                    {currentSchema && (
                                        <SchemaForm
                                            schema={currentSchema}
                                            formData={currentFormData}
                                            onChange={handleFormChange}
                                            onSubmit={handleSave}
                                            uiSchema={uiSchema}
                                        >
                                            <div className="fixed bottom-0 left-0 right-0 md:left-auto md:right-[450px] 2xl:right-[600px] bg-bg-base/95 backdrop-blur-xl border-t border-bg-elevated p-6 z-40 flex justify-end">
                                                <div className="max-w-5xl w-full flex justify-end gap-4">
                                                    <button type="submit" className="btn-primary py-3 px-8 rounded-xl flex items-center gap-3 shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold">
                                                        <Save size={20} /> Persist Changes
                                                    </button>
                                                </div>
                                            </div>
                                        </SchemaForm>
                                    )}

                                    {activeTab === 'settings' && (
                                        <div className="mt-20 pt-10 border-t border-red-500/20 max-w-5xl mx-auto">
                                            <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4">Danger Zone</h3>
                                            <p className="text-sm text-text-secondary/70 mb-6">Resetting will clear your local overrides and restore the original data from the JSON files.</p>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Delete all local changes and reset to default? This cannot be undone.')) {
                                                        resetData();
                                                        window.location.reload();
                                                    }
                                                }}
                                                className="flex items-center gap-2 px-6 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
                                            >
                                                <Trash2 size={18} />
                                                Reset to Default Data
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* JSON Preview Column */}
                            <div className="hidden xl:flex flex-col w-[450px] 2xl:w-[600px] h-full shadow-2xl z-30">
                                <SchemaPreview data={currentFormData} />
                            </div>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-text-secondary">
                            <div className="text-center">
                                <Layers size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Select an item to edit</p>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Styles for RJSF to match dark theme roughly */}
            <style>{`
                .rjsf-container form { display: grid; grid-template-columns: 1fr; gap: 2rem; }
                .rjsf-container .form-group { margin-bottom: 0; position: relative; }
                
                /* Required Marker */
                .rjsf-container label .required {
                    color: #f87171;
                    margin-left: 4px;
                    font-size: 1.2em;
                }

                .rjsf-container label { 
                    display: flex;
                    align-items: center;
                    font-size: 0.7rem; 
                    font-weight: 800; 
                    letter-spacing: 0.15em;
                    color: var(--text-secondary); 
                    text-transform: uppercase;
                    margin-bottom: 0.75rem; 
                    opacity: 0.9;
                }

                .rjsf-container input[type="text"], 
                .rjsf-container input[type="email"], 
                .rjsf-container input[type="url"], 
                .rjsf-container input[type="number"], 
                .rjsf-container textarea, 
                .rjsf-container select { 
                    width: 100%; 
                    background-color: var(--bg-surface); 
                    border: 1px solid var(--bg-elevated); 
                    border-radius: 1rem; 
                    padding: 1rem 1.25rem; 
                    color: var(--text-primary); 
                    font-size: 1rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                /* Error State for Inputs */
                .rjsf-container .has-error input, 
                .rjsf-container .has-error textarea, 
                .rjsf-container .has-error select {
                    border-color: #f87171 !important;
                    background-color: rgba(248, 113, 113, 0.05);
                    box-shadow: 0 0 0 4px rgba(248, 113, 113, 0.1);
                }

                .rjsf-container input:hover, .rjsf-container textarea:hover, .rjsf-container select:hover {
                    border-color: var(--text-secondary);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }

                .rjsf-container input:focus, .rjsf-container textarea:focus, .rjsf-container select:focus {
                    outline: none;
                    border-color: var(--accent);
                    box-shadow: 0 0 0 4px var(--accent-alpha-20, rgba(59, 130, 246, 0.15));
                    background-color: var(--bg-base);
                    transform: translateY(-1px);
                }

                /* Error Detail - The most important part for the user */
                .rjsf-container .error-detail {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }
                .rjsf-container .error-detail .text-danger {
                    display: inline-flex;
                    align-items: center;
                    margin-top: 0.75rem;
                    padding: 0.5rem 0.75rem;
                    background-color: rgba(248, 113, 113, 0.15);
                    color: #fca5a5;
                    font-size: 0.75rem;
                    font-weight: 700;
                    border-radius: 0.5rem;
                    border-left: 3px solid #f87171;
                    width: auto;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-5px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Description Text */
                .rjsf-container .field-description {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                    opacity: 0.6;
                    font-style: italic;
                }

                .rjsf-container .checkbox { 
                    display: flex; 
                    align-items: center; 
                    gap: 1rem; 
                    padding: 1rem;
                    background: var(--bg-surface);
                    border: 1px solid var(--bg-elevated);
                    border-radius: 1rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .rjsf-container .checkbox:hover {
                    border-color: var(--accent);
                }

                .rjsf-container .checkbox input { 
                    width: 1.5rem; 
                    height: 1.5rem; 
                    accent-color: var(--accent);
                }

                .rjsf-container fieldset { 
                    border: 1px solid var(--bg-elevated); 
                    padding: 2rem; 
                    border-radius: 1.5rem; 
                    margin-top: 1rem;
                    background: linear-gradient(to bottom right, rgba(255,255,255,0.02), transparent);
                    box-shadow: inset 0 1px 1px rgba(255,255,255,0.05);
                 }

                 .rjsf-container legend { 
                    padding: 0 1rem; 
                    color: var(--accent); 
                    font-weight: 900; 
                    font-size: 0.75rem; 
                    letter-spacing: 0.2em;
                    text-transform: uppercase; 
                 }

                 .rjsf-container .array-item { 
                    position: relative; 
                    padding: 1.5rem;
                    background: rgba(0,0,0,0.1);
                    border-radius: 1rem;
                    border: 1px solid var(--bg-elevated);
                    margin-bottom: 1.5rem; 
                 }
            `}</style>
        </div>
    );
}
