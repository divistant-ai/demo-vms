import { test, expect } from '@playwright/test'

test.describe('Industry Profile Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Admin User', role: 'Administrator' }))
      localStorage.setItem('onboarding', 'completed')
      localStorage.setItem('industryProfile', 'retail')
    })
    await page.goto('/')
  })

  test('should navigate to Industry Profile', async ({ page }) => {
    await page.click('text=Industry Profile')
    await expect(page).toHaveURL(/.*industry\/profile/)
    await expect(page.locator('text=/Industry Profile|Your Industry/i')).toBeVisible()
  })

  test('should display industry submenu when on industry pages', async ({ page }) => {
    await page.goto('/industry/profile')
    
    // Check if submenu items are visible
    await expect(page.locator('text=Templates')).toBeVisible()
    await expect(page.locator('text=AI Models')).toBeVisible()
    await expect(page.locator('text=Integrations')).toBeVisible()
    await expect(page.locator('text=Compliance')).toBeVisible()
    await expect(page.locator('text=Benchmarks')).toBeVisible()
    await expect(page.locator('text=White-Label')).toBeVisible()
  })

  test('should navigate to Industry Templates', async ({ page }) => {
    await page.goto('/industry/profile')
    await page.click('text=Templates').first()
    await expect(page).toHaveURL(/.*industry\/templates/)
    await expect(page.locator('text=/Industry Templates|Templates/i')).toBeVisible()
  })

  test('should navigate to AI Models Marketplace', async ({ page }) => {
    await page.goto('/industry/profile')
    await page.click('a[href="/industry/models"]')
    await expect(page).toHaveURL(/.*industry\/models/)
    await expect(page.locator('text=/AI Models Marketplace/i')).toBeVisible()
  })

  test('should navigate to Integration Marketplace', async ({ page }) => {
    await page.goto('/industry/profile')
    await page.click('a[href="/industry/integrations"]')
    await expect(page).toHaveURL(/.*industry\/integrations/)
    await expect(page.locator('text=/Integration Marketplace/i')).toBeVisible()
  })

  test('should navigate to Compliance Reports', async ({ page }) => {
    await page.goto('/industry/profile')
    await page.click('a[href="/industry/compliance"]')
    await expect(page).toHaveURL(/.*industry\/compliance/)
    await expect(page.locator('text=/Compliance Reports/i')).toBeVisible()
  })

  test('should navigate to Industry Benchmarks', async ({ page }) => {
    await page.goto('/industry/profile')
    await page.click('a[href="/industry/benchmarks"]')
    await expect(page).toHaveURL(/.*industry\/benchmarks/)
    await expect(page.locator('text=/Industry Benchmarks/i')).toBeVisible()
  })

  test('should navigate to White-Label Branding', async ({ page }) => {
    await page.goto('/industry/profile')
    await page.click('a[href="/industry/branding"]')
    await expect(page).toHaveURL(/.*industry\/branding/)
    await expect(page.locator('text=/White-Label Branding/i')).toBeVisible()
  })
})


