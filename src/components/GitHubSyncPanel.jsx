import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Github, AlertCircle, CheckCircle2, Plus, ExternalLink, Star, Code2 } from 'lucide-react';
import { useGitHubSync } from '../hooks/useGitHubSync';

/**
 * GitHubSyncPanel Component
 * (specs/GITHUB_SYNC.md § GS-004)
 * 
 * Provides an interface to discover and import GitHub repositories as portfolio projects.
 * 
 * @param {Object} props
 * @param {Array} props.existingProjects - Current project list for comparison
 * @param {Function} props.onImport - Callback when a repo is selected for import
 */
export default function GitHubSyncPanel({ existingProjects, onImport }) {
    const {
        githubRepos,
        unsynced,
        loading,
        error,
        fetchRepos
    } = useGitHubSync(existingProjects);

    // Fetch on mount if no repos loaded yet
    useEffect(() => {
        if (githubRepos.length === 0 && !loading && !error) {
            fetchRepos();
        }
    }, [fetchRepos, githubRepos.length, loading, error]);

    /**
     * Maps a GitHub repository object to the Portfolio Project schema
     * (specs/GITHUB_SYNC.md § GS-004 Import mapping)
     */
    const handleImportClick = (repo) => {
        const projectDraft = {
            id: repo.id,
            title: repo.title,
            description: repo.description,
            category: "Software Development", // Default category
            tags: repo.topics.slice(0, 5), // Max 5 topics as tags
            featured: repo.stars > 5,
            links: {
                repo: repo.repoUrl,
                demo: "" // Leave blank per spec
            },
            // Technical metadata derived from language + topics
            tech: [repo.language, ...(repo.topics || [])]
                .filter(Boolean)
                .slice(0, 8)
        };

        onImport(projectDraft);
    };

    return (
        <div className="flex-grow flex flex-col h-full bg-bg-base overflow-hidden">
            {/* Search/Filter Header */}
            <div className="p-6 border-b border-bg-elevated bg-bg-surface/10 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Github size={24} className="text-accent" />
                        GitHub Repository Sync
                    </h2>
                    <p className="text-sm text-text-secondary mt-1">
                        Discover your public repositories and import them as projects.
                    </p>
                </div>
                <button
                    onClick={fetchRepos}
                    disabled={loading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-elevated border border-white/5 text-sm font-medium transition-all hover:bg-bg-surface ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98]'}`}
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    {loading ? 'Fetching...' : 'Refresh Repos'}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow overflow-y-auto p-6 scrollbar-thin">
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
                        >
                            <AlertCircle size={20} className="shrink-0" />
                            <div>
                                <p className="font-bold text-sm">Synchronization Error</p>
                                <p className="text-xs opacity-80 mt-1">{error}</p>
                            </div>
                        </motion.div>
                    )}

                    {!loading && !error && unsynced.length === 0 && githubRepos.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                            <h3 className="text-lg font-bold">All Repositories Synced</h3>
                            <p className="text-text-secondary text-sm max-w-sm mt-2">
                                All of your public GitHub repositories are already present in your portfolio. Good job!
                            </p>
                        </motion.div>
                    )}

                    {!loading && !error && githubRepos.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                            <Github size={48} className="mb-4" />
                            <p>Fetching repositories...</p>
                        </div>
                    )}

                    {/* Unsynced Repos List */}
                    {unsynced.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {unsynced.map((repo, idx) => (
                                <motion.div
                                    key={repo.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="bg-bg-surface/50 border border-bg-elevated rounded-2xl p-5 hover:border-accent/30 transition-all group flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-accent/10 rounded-lg">
                                                    <Code2 size={18} className="text-accent" />
                                                </div>
                                                <h4 className="font-bold text-text-primary group-hover:text-accent transition-colors truncate max-w-[180px]">
                                                    {repo.id}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-xs text-yellow-500/80 font-bold bg-yellow-500/5 px-2 py-1 rounded-md border border-yellow-500/10">
                                                    <Star size={12} fill="currentColor" />
                                                    {repo.stars}
                                                </div>
                                                <a
                                                    href={repo.repoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-text-secondary hover:text-text-primary transition-colors"
                                                    title="View on GitHub"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>
                                        </div>

                                        <p className="text-xs text-text-secondary line-clamp-2 mb-4 min-h-[2rem]">
                                            {repo.description || "No description provided."}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {repo.language && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white uppercase tracking-wider">
                                                    {repo.language}
                                                </span>
                                            )}
                                            {repo.topics.slice(0, 3).map(topic => (
                                                <span key={topic} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bg-elevated text-text-secondary border border-white/5">
                                                    #{topic}
                                                </span>
                                            ))}
                                            {repo.topics.length > 3 && (
                                                <span className="text-[10px] font-bold px-2 py-0.5 text-text-secondary/50 italic">
                                                    +{repo.topics.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleImportClick(repo)}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-bg-elevated hover:bg-accent hover:text-white transition-all font-bold text-sm shadow-sm"
                                    >
                                        <Plus size={16} />
                                        Import as Project
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
