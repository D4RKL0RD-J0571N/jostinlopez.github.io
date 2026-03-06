import { renderHook, waitFor, act } from '@testing-library/react';
import { useGitHubSync } from './useGitHubSync';
import { vi, describe, it, expect, beforeEach } from 'vitest';

/**
 * Unit tests for useGitHubSync hook
 * (specs/GITHUB_SYNC.md § GS-003)
 */
describe('useGitHubSync', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Re-mock global fetch
        global.fetch = vi.fn();
    });

    it('should initialize with default states', () => {
        const { result } = renderHook(() => useGitHubSync([]));

        expect(result.current.githubRepos).toEqual([]);
        expect(result.current.unsynced).toEqual([]);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should fetch and update state on success', async () => {
        const mockRepos = [
            { id: 'repo-1', title: 'Repo 1', repoUrl: 'https://...', stars: 10 },
            { id: 'repo-2', title: 'Repo 2', repoUrl: 'https://...', stars: 5 },
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockRepos,
        });

        const { result } = renderHook(() => useGitHubSync([]));

        // Trigger fetch (async act)
        await act(async () => {
            await result.current.fetchRepos();
        });

        expect(result.current.githubRepos).toEqual(mockRepos);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should properly identify unsynced repos based on existingProjects', async () => {
        const existing = [{ id: 'repo-1', title: 'Repo 1' }];
        const fetched = [
            { id: 'repo-1', title: 'Repo 1' },
            { id: 'repo-2', title: 'Repo 2' },
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => fetched,
        });

        const { result } = renderHook(() => useGitHubSync(existing));

        await act(async () => {
            await result.current.fetchRepos();
        });

        // Only repo-2 should be unsynced
        expect(result.current.unsynced).toHaveLength(1);
        expect(result.current.unsynced[0].id).toBe('repo-2');
    });

    it('should handle fetch errors correctly', async () => {
        const errorMsg = 'GitHub API failed';
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            json: async () => ({ error: errorMsg }),
        });

        const { result } = renderHook(() => useGitHubSync([]));

        await act(async () => {
            await result.current.fetchRepos();
        });

        expect(result.current.error).toBe(errorMsg);
        expect(result.current.loading).toBe(false);
        expect(result.current.githubRepos).toEqual([]);
    });

    it('should handle unexpected exceptions', async () => {
        global.fetch.mockRejectedValueOnce(new Error('Network failure'));

        const { result } = renderHook(() => useGitHubSync([]));

        await act(async () => {
            await result.current.fetchRepos();
        });

        expect(result.current.error).toBe('Network failure');
        expect(result.current.loading).toBe(false);
    });
});
