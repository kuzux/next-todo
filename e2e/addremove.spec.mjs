import { test, expect } from '@playwright/test'

const root = "http://localhost:4444";

test.describe('adding and removing items', async () => {
    /*test('should start with 0 items', async ({ page }) => {
        await page.goto(`${root}/login`);
        await page.fill('[name=username]', 'test');
        await page.fill('[name=password]', '1234');

        await page.click('[value=login]');

        await expect(page.locator('.todo-item')).toHaveCount(0);
    });

    test('should add an item', async ({ page }) => {
        await page.goto(`${root}/login`);
        await page.fill('[name=username]', 'test');
        await page.fill('[name=password]', '1234');

        await page.click('[value=login]');

        await page.fill('[name=name]', 'test item');
        await page.click('[value=add]');
        await page.waitForTimeout(200);

        await expect(page.locator('.todo-item')).toHaveCount(1);
    });

    test('should ignore the added item', async ({ page }) => {
        await page.goto(`${root}/login`);
        await page.fill('[name=username]', 'test');
        await page.fill('[name=password]', '1234');

        await page.click('[value=login]');

        await page.fill('[name=name]', 'test item');
        await page.hover('.todo-item');
        await page.click('.todo-item [value=ignore]');
        await page.waitForTimeout(200);

        await expect(page.locator('.todo-item')).toHaveCount(1);
    });

    test('should delete the ignored item', async ({ page }) => {
        await page.goto(`${root}/login`);
        await page.fill('[name=username]', 'test');
        await page.fill('[name=password]', '1234');

        await page.click('[value=login]');

        await page.fill('[name=name]', 'test item');
        await page.hover('.todo-item');
        await page.click('.todo-item [value=delete]');
        await page.waitForTimeout(200);

        await expect(page.locator('.todo-item')).toHaveCount(0);
    });*/
});
