import { test, expect } from '@playwright/test'

test('should do some dummy action', async ({ page }) => {
    await page.goto('http://localhost:4444/');
    await expect(page).toHaveURL('http://localhost:4444/login');  
})