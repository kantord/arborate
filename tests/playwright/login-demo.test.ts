import { test, expect } from '@playwright/test';

test('User Login Demo', async ({ page }) => {
  // Demo test for user login functionality
  
  await page.goto('/login');
  await page.fill('#username', 'testuser');
  await page.fill('#password', 'testpass123');
  await page.click('#login-button');
  await expect(page.locator('.welcome-message')).toBeVisible();
  await expect(page.locator('.welcome-message')).toContainText('Welcome, testuser!');
  
  // This test was generated from tree: login-demo
});
