import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook to manage GitHub repository synchronization.
 * (specs/GITHUB_SYNC.md § GS-003)
 * 
 * @param {Array} existingProjects - Current list of projects in the portfolio
 * @returns {Object} { githubRepos, unsynced, loading, error, fetchRepos }
 */
export function useGitHubSync(existingProjects = []) {
    const [githubRepos, setGithubRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Triggers fetching repositories from the internal backend API.
     * Internal URL: /api/github-repos
     */
    const fetchRepos = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/github-repos');

            if (!response.ok) {
                // Return format from /api/github-repos matches { error: string } per rules.md
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `GitHub fetch failed: ${response.statusText}`);
            }

            const data = await response.json();
            setGithubRepos(data);
        } catch (err) {
            console.error('[useGitHubSync] Fetch error:', err);
            setError(err.message || 'An unexpected error occurred while fetching repositories.');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Identifies repositories that are not yet in the existing projects list.
     * Matches IDs (repo name) between githubRepos and existingProjects.
     */
    const unsynced = useMemo(() => {
        if (!githubRepos.length) return [];

        // Create a set of existing IDs for O(1) lookup
        const existingIds = new Set(existingProjects.map(p => p.id));

        return githubRepos.filter(repo => !existingIds.has(repo.id));
    }, [githubRepos, existingProjects]);

    return {
        githubRepos,
        unsynced,
        loading,
        error,
        fetchRepos
    };
}
