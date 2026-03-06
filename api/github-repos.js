/**
 * @api {get} /api/github-repos Get public repositories for a specific user
 * @apiGroup GitHub
 * @apiPermission Server-side token required (GITHUB_TOKEN)
 * @apiSuccess {Array} Array of mapped repository objects
 */
export default async function handler(req, res) {
    // 1. Standard: Validate HTTP Method (rules.md §3)
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: `Method ${req.method} Not Allowed. Expected GET.`
        });
    }

    // 2. Standard: Sensitive tokens must NOT use VITE_ prefix (rules.md §4)
    const username = process.env.VITE_GITHUB_USERNAME;
    const token = process.env.GITHUB_TOKEN;

    if (!username || !token) {
        console.error('[API:GITHUB-REPOS] Missing credentials in environment');
        return res.status(500).json({
            error: 'Environment configuration error. Please check .env settings.'
        });
    }

    try {
        // 3. GitHub API Request
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=50`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'Accept': 'application/vnd.github+json'
                }
            }
        );

        // 4. Standard: Error handling returns { error: string } (rules.md §3)
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[API:GITHUB-REPOS] GitHub API failed:', response.status, errorData);
            return res.status(response.status).json({
                error: `GitHub API error: ${response.statusText}`
            });
        }

        const repos = await response.json();

        // 5. Transform Data (specs/GITHUB_SYNC.md § GS-001)
        // Filter out forks and private repos (redundant due to public username crawl but good practice)
        const mapped = repos
            .filter(repo => !repo.fork && !repo.private)
            .map(repo => ({
                id: repo.name,
                title: repo.name.replace(/-/g, ' '),
                description: repo.description || '',
                repoUrl: repo.html_url,
                stars: repo.stargazers_count,
                language: repo.language,
                topics: repo.topics || [],
                updatedAt: repo.updated_at,
            }));

        // 6. Standard: Cache-Control must be set (rules.md §3)
        // s-maxage=300 (5 mins) for shared caches, stale-while-revalidate for background updates
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

        // 7. Success
        return res.status(200).json(mapped);

    } catch (err) {
        console.error('[API:GITHUB-REPOS] Unexpected exception:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
