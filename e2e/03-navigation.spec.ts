import { test, expect } from '@playwright/test'

test.describe('Main Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Admin User', role: 'Administrator' }))
      localStorage.setItem('onboarding', 'completed')
      localStorage.setItem('industryProfile', 'retail')
    })
    await page.goto('/')
  })

  test('should navigate to Dashboard', async ({ page }) => {
    await page.waitForLoadState('networkidle')
    await page.locator('a[href="/"]').first().click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1, h2, text=Dashboard').first()).toBeVisible()
  })

  test('should navigate to Live Cameras', async ({ page }) => {
    await page.locator('a[href="/cameras"]').first().click()
    await expect(page).toHaveURL(/.*cameras/)
  })

  test('should navigate to Map View', async ({ page }) => {
    await page.locator('a[href="/map"]').first().click()
    await expect(page).toHaveURL(/.*map/)
  })

  test('should navigate to Analytics', async ({ page }) => {
    await page.locator('a[href="/analytics"]').first().click()
    await expect(page).toHaveURL(/.*analytics/)
  })

  test('should navigate to AI Insights', async ({ page }) => {
    await page.locator('a[href="/ai-insights"]').first().click()
    await expect(page).toHaveURL(/.*ai-insights/)
  })

  test('should navigate to AI Models', async ({ page }) => {
    await page.locator('a[href="/models"]').first().click()
    await expect(page).toHaveURL(/.*models/)
  })

  test('should navigate to Incidents', async ({ page }) => {
    await page.locator('a[href="/incidents"]').first().click()
    await expect(page).toHaveURL(/.*incidents/)
  })

  test('should navigate to Alerts', async ({ page }) => {
    await page.locator('a[href="/alerts"]').first().click()
    await expect(page).toHaveURL(/.*alerts/)
  })

  test('should navigate to Configuration', async ({ page }) => {
    await page.locator('a[href="/configuration"]').first().click()
    await expect(page).toHaveURL(/.*configuration/)
  })

  test('should navigate to Reports', async ({ page }) => {
    await page.locator('a[href="/reports"]').first().click()
    await expect(page).toHaveURL(/.*reports/)
  })

  test('should navigate to Organization', async ({ page }) => {
    await page.locator('a[href="/tenant/settings"]').first().click()
    await expect(page).toHaveURL(/.*tenant/)
  })

  test('should navigate to Profile', async ({ page }) => {
    await page.locator('a[href="/profile"]').first().click()
    await expect(page).toHaveURL(/.*profile/)
  })
})

