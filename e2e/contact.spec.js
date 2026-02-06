import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
    test('should submit the contact form successfully', async ({ page }) => {
        await page.goto('/');

        // Fill the form
        await page.fill('input[name="name"]', 'Test User');
        await page.fill('input[name="email"]', 'test@example.com');
        await page.fill('textarea[name="message"]', 'This is a test message from Playwright.');

        // Submit
        await page.click('button[type="submit"]');

        // Check for success message (Toast)
        await expect(page.getByText('Message sent successfully!')).toBeVisible();
    });
});
