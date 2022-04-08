import { test, expect } from '@playwright/test'

const root = "http://localhost:4444";

test.describe('login and signup', async () => {
    test('should not log in after first try', async ({ page }) => {
        await page.goto(`${root}/login`);
        await page.fill('[name=username]', 'test');
        await page.fill('[name=password]', '1234');

        await page.click('[value=login]');

        await expect(page.locator('#error-message')).not.toHaveCount(0);
    });

    test('should be able to sign up', async ({ page }) => {
        await page.goto(`${root}/login`);
        await page.fill('[name=username]', 'test');
        await page.fill('[name=password]', '1234');

        await page.click('[value=signup]');

        await expect(page.locator('#success-message')).not.toHaveCount(0);
    });

    test('should be able to log in after signing up', async ({ page }) => {
        await page.goto(`${root}/login`);
        await page.fill('[name=username]', 'test');
        await page.fill('[name=password]', '1234');

        await page.click('[value=login]');
        await expect(page).toHaveURL(`${root}/`);  
    });
});