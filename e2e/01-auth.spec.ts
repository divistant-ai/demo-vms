import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/.*login/)
    await expect(page.locator('text=Welcome Back')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Visiant' })).toBeVisible()
  })

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Should redirect to onboarding or dashboard
    await page.waitForURL(/\/(onboarding|$)/, { timeout: 5000 })
    await expect(page).not.toHaveURL(/.*login/)
  })

  test('should accept any credentials (demo mode)', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'test123')
    await page.click('button[type="submit"]')
    
    // Should redirect (demo always succeeds)
    await page.waitForURL(/\/(onboarding|$)/, { timeout: 5000 })
    await expect(page).not.toHaveURL(/.*login/)
  })

  test('should logout successfully', async ({ page }) => {
    // Setup user
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Admin User', role: 'Administrator' }))
      localStorage.setItem('onboarding', 'completed')
    })
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Click user profile button (visible on desktop)
    const userButton = page.locator('.sm\\:flex').filter({ hasText: 'Admin User' })
    await userButton.click({ timeout: 10000 })
    
    // Click logout in dialog
    await page.click('button:has-text("Logout")')
    
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
  })
})

