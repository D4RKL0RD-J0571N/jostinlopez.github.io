import { test, expect } from '@playwright/test';

/**
 * End-to-End Test for the GitHub Sync Feature
 * (specs/GITHUB_SYNC.md § GS-004)
 */
test.describe('GitHub Sync Interface', () => {
    test.beforeEach(async ({ page }) => {
        // Mock the backend API (/api/github-repos) since we are testing the UI in isolation
        await page.route('**/api/github-repos', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    {
                        id: 'mock-repo-1',
                        title: 'mock repo 1',
                        description: 'This is a test repository for the sync interface.',
                        repoUrl: 'https://github.com/user/mock-repo-1',
                        stars: 10,
                        language: 'JavaScript',
                        topics: ['test', 'automation', 'unit-testing'],
                        updatedAt: new Date().toISOString()
                    }
                ])
            });
        });

        // Start at the home page
        await page.goto('http://localhost:5173/'); // Using standard Vite dev port
    });

    test('should open CMS and show the GitHub Sync tab', async ({ page }) => {
        // 1. Open CMS using shortcut (Ctrl+Shift+E)
        await page.keyboard.press('Control+Shift+E');

        // 2. Verify CMS is open (check for title or a known element)
        await expect(page.getByText('CMS Command Center')).toBeVisible();

        // 3. Navigate to GitHub Sync tab
        const syncTab = page.getByRole('button', { name: /GitHub Sync/i });
        await expect(syncTab).toBeVisible();
        await syncTab.click();

        // 4. Check for UI elements in the sync panel
        await expect(page.getByText('Discover your public repositories')).toBeVisible();

        // 5. Verify the mocked repository is listed
        await expect(page.getByText('mock-repo-1')).toBeVisible();
        await expect(page.getByText('This is a test repository')).toBeVisible();
        await expect(page.getByText('JavaScript')).toBeVisible();
    });

    test('should import a repository as a project draft', async ({ page }) => {
        // 1. Open CMS and go to Sync tab
        await page.keyboard.press('Control+Shift+E');
        await page.getByRole('button', { name: /GitHub Sync/i }).click();

        // 2. Click "Import" on our mock repo
        const importBtn = page.getByRole('button', { name: /Import as Project/i });
        await importBtn.click();

        // 3. Verify it transitioned back to the Projects tab
        // Sidebar list label should now be 'projects'
        await expect(page.locator('aside span.text-xs').getByText('projects')).toBeVisible();

        // 4. Verify the form is in "Create New" state (selectedId null)
        await expect(page.getByText('Create New Entry')).toBeVisible();

        // 5. Verify the form fields were populated with the repo data
        // For react-jsonschema-form, inputs are likely in standard name/id format
        // The title field should match our mock title transformation 'mock repo 1'
        const titleInput = page.locator('input[id="root_title"]');
        await expect(titleInput).toHaveValue('mock repo 1');

        const descInput = page.locator('textarea[id="root_description"]');
        await expect(descInput).toHaveValue('This is a test repository for the sync interface.');

        const idInput = page.locator('input[id="root_id"]');
        await expect(idInput).toHaveValue('mock-repo-1');
    });
});
