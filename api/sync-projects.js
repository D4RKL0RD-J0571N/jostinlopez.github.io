import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/**
 * @api {post} /api/sync-projects Validate and merge project lists
 * @apiGroup Projects
 * @apiBody {Array} existing List of current projects
 * @apiBody {Object} newProject New project data to merge
 * @apiSuccess {Array} Merged projects array
 */
export default async function handler(req, res) {
    // 1. Standard: Validate HTTP Method (rules.md §3)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: `Method ${req.method} Not Allowed. Expected POST.` });
    }

    // 2. Standard: Cache-Control on every route (rules.md §3)
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    const { existing, newProject } = req.body || {};

    if (!Array.isArray(existing) || !newProject) {
        return res.status(400).json({ error: 'Missing required fields: { existing: [], newProject: {} }' });
    }

    try {
        // 3. Load Schema (using fs for runtime serverless robustness)
        const schemaPath = path.join(process.cwd(), 'src/config/projects.schema.json');
        const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

        // 4. Validate newProject against schema
        const validate = ajv.compile(schema);
        const valid = validate(newProject);

        if (!valid) {
            return res.status(400).json({
                error: 'Schema validation failed',
                details: validate.errors // returns field-level errors (specs/GITHUB_SYNC.md § GS-002)
            });
        }

        // 5. Check for duplicates in existing list
        const isDuplicate = existing.some(p => p.id === newProject.id);
        if (isDuplicate) {
            return res.status(409).json({ error: `Project with ID ${newProject.id} already exists.` });
        }

        // 6. Return Merged JSON (Stateless - GS-002)
        const merged = [...existing, newProject];
        return res.status(200).json(merged);

    } catch (err) {
        console.error('[API:SYNC-PROJECTS] Internal error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
