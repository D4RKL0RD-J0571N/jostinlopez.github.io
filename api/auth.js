/**
 * @api {post} /api/auth Verify CMS access
 * @apiGroup Auth
 * @apiBody {String} password Password to verify
 * @apiSuccess {Boolean} authorized True if password matches
 */
export default async function handler(req, res) {
    // 1. Standard: Validate HTTP Method
    if (req.method !== 'POST') {
        return res.status(405).json({ error: `Method ${req.method} Not Allowed. Expected POST.` });
    }

    // 2. Standard: Cache-Control
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    const { password } = req.body || {};

    if (!password) {
        return res.status(400).json({ error: 'Missing password field' });
    }

    const ADMIN_PASSWORD = process.env.CMS_ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
        console.warn('[AUTH] No CMS_ADMIN_PASSWORD set in environment variables.');
        return res.status(500).json({ error: 'Server authentication is incorrectly configured.' });
    }

    if (password === ADMIN_PASSWORD) {
        return res.status(200).json({ authorized: true });
    } else {
        return res.status(401).json({ authorized: false, error: 'Incorrect password.' });
    }
}
