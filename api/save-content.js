import fetch from 'node-fetch';

/**
 * @api {post} /api/save-content Update JSON files in the GitHub repo
 * @apiGroup CMS
 * @apiHeader {String} Authorization Password verified in api/auth
 * @apiBody {String} path Relative path to file (e.g., src/data/projects.json)
 * @apiBody {Object} content New content to save
 * @apiSuccess {Boolean} success True if file was committed
 */
export default async function handler(req, res) {
    // 1. Standard: Validate HTTP Method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: `Method ${req.method} Not Allowed. Expected POST.` });
    }

    // 2. Standard: Cache-Control
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    const { path: filePath, content, password } = req.body || {};
    const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const GITHUB_USER = process.env.VITE_GITHUB_USERNAME; // Fixed: Needs owner/repo
    const REPO_NAME = 'jostinlopez.github.io'; // Based on your username and the deploy log

    // 3. Simple Auth Check
    if (!password || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized. Invalid CMS password.' });
    }

    if (!filePath || !content) {
        return res.status(400).json({ error: 'Missing path or content.' });
    }

    try {
        // 4. Get current SHA of the file (required by GitHub API for updates)
        const contentUrl = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${filePath}`;

        const getRes = await fetch(contentUrl, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        let sha = null;
        if (getRes.ok) {
            const existingData = await getRes.json();
            sha = existingData.sha;
        }

        // 5. Commit updated file to GitHub repo
        const putRes = await fetch(contentUrl, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: `cms(sync): updated ${filePath} from browser editor`,
                content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64'),
                sha: sha // If file doesn't exist, this is null and GitHub treats as 'create'
            })
        });

        if (!putRes.ok) {
            const errorData = await putRes.json();
            throw new Error(`GitHub Commit Error: ${errorData.message}`);
        }

        return res.status(200).json({
            success: true,
            message: `Successfully persisted changes to ${filePath} on GitHub.`
        });

    } catch (err) {
        console.error('[API:SAVE-CONTENT] Failure:', err);
        return res.status(500).json({ error: err.message });
    }
}
