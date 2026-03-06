<!--
  WINDSURF RULE CONFIGURATION
  File: .windsurf/rules/01-code-standards.md
  Activation: Always On
  Description: Non-negotiable code standards for this project
-->

# Code Standards — Always Enforced

<javascript_rules>
- ES Modules only — no require(), no CommonJS in src/
- Functional components only — no class components
- Named exports preferred — default export only for page-level components
- No inline styles in JSX — use TailwindCSS classes or design-tokens.json
- Destructure props at function signature level
- async/await over .then() chains
- No magic numbers — define named constants in src/config/constants.js
- All user-visible strings through useTranslation() — no hardcoded English in JSX
</javascript_rules>

<file_naming>
- Components: PascalCase → ProjectCard.jsx
- Hooks: camelCase with use prefix → useGitHubSync.js
- Utils: camelCase → themeApplier.js
- API routes: kebab-case → github-repos.js
- Specs/Docs: SCREAMING_SNAKE_CASE → MIGRATION.md
</file_naming>

<react_patterns>
- Co-locate state — lift only when shared across 2+ components
- Custom hooks for any useEffect > 5 lines
- No prop drilling past 2 levels — use context or a hook
- Framer Motion must respect prefers-reduced-motion
- No premature memoization — only useMemo/useCallback for measured perf issues
</react_patterns>

<api_routes>
- All serverless functions in /api/ at project root
- GITHUB_TOKEN accessed only from process.env inside /api/ — never import.meta.env in src/
- Every route must: validate HTTP method (return 405 if wrong), set Cache-Control headers,
  return { error: string } JSON on failure, handle GitHub API errors gracefully
- Webhook routes must verify x-hub-signature-256 before any processing
</api_routes>

<data_rules>
- src/data/projects.json is static source of truth — never mutate at runtime
- src/config/design-tokens.json is the only source for visual tokens
- Validate projects.json against src/config/projects.schema.json on every build
- Project IDs must be derived from repo name, kebab-cased
</data_rules>

<env_vars>
- VITE_ prefix = exposed to browser bundle. Use only for non-sensitive config.
- No VITE_ prefix = server-side only. Never reference in src/
- GITHUB_TOKEN, WEBHOOK_SECRET, VERCEL_DEPLOY_HOOK_URL → server-side only
- .env.local must be in .gitignore — verify before any commit touching env
- .env.example must stay in sync with all new variables
</env_vars>

<git_commits>
Conventional Commits format required:
  type(scope): short description
  Types: feat | fix | refactor | test | docs | chore | ci
  Scopes: migration | github-sync | cms | ui | api | deps

Examples:
  feat(api): add /api/github-repos serverless function
  fix(migration): remove hardcoded base path from vite.config.js

One logical change per commit. No force-push to main.
</git_commits>

<security>
- Run npm audit before declaring any task done — block on HIGH+
- No dangerouslySetInnerHTML without sanitization + security comment
- GitHub PAT must have only public_repo read scope
- Secrets rotation procedure must be documented in audit/DECISIONS.md
</security>

<definition_of_done>
A task is Done only when ALL are true:
- Matches spec acceptance criteria
- Zero new ESLint errors introduced
- npm run build passes with zero warnings
- Test written or updated (Playwright for features, Vitest for hooks/utils)
- audit/CHANGELOG.md updated
- If architectural: ADR in audit/DECISIONS.md
- If new env var: added to .env.example
</definition_of_done>