import { test, expect } from '@playwright/test'

test.describe('Onboarding Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to ensure onboarding shows
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.removeItem('onboarding')
      localStorage.removeItem('industryProfile')
    })
    
    // Login
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL(/.*onboarding/, { timeout: 5000 })
  })

  test('should display welcome step', async ({ page }) => {
    await expect(page.locator('text=/Welcome to VisionCore/i')).toBeVisible()
    await expect(page.locator('text=/Get Started|Next/i')).toBeVisible()
  })

  test('should navigate through all onboarding steps', async ({ page }) => {
    // Step 1: Welcome
    await page.click('button:has-text("Get Started")')
    
    // Step 2: Industry Selection
    await expect(page.locator('text=What\'s your industry?')).toBeVisible()
    await page.locator('button').filter({ hasText: /Retail/ }).first().click()
    await page.click('button:has-text("Continue")')
    
    // Step 3: Use Cases
    await expect(page.locator('text=/What are your primary use cases/i')).toBeVisible()
    await page.click('button:has-text("Continue")')
    
    // Step 4: Organization Details
    await expect(page.locator('text=/Tell us about your organization/i')).toBeVisible()
    await page.click('button:has-text("Complete Setup")')
    
    // Should redirect to dashboard
    await page.waitForURL(/\/$/, { timeout: 5000 })
    await expect(page).toHaveURL('/')
  })

  test('should save selected industry profile', async ({ page }) => {
    // Complete onboarding with Smart City
    await page.click('button:has-text("Get Started")')
    await page.locator('button').filter({ hasText: /Smart City/ }).first().click()
    await page.click('button:has-text("Continue")')
    await page.click('button:has-text("Continue")')
    await page.click('button:has-text("Complete Setup")')
    
    await page.waitForURL(/\/$/, { timeout: 5000 })
    
    // Check if industry profile was saved
    const savedProfile = await page.evaluate(() => localStorage.getItem('industryProfile'))
    expect(savedProfile).toBe('smart_city')
  })
})

