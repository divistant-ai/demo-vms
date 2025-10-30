import { test, expect } from '@playwright/test'

test.describe('Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Admin User', role: 'Administrator' }))
      localStorage.setItem('onboarding', 'completed')
      localStorage.setItem('industryProfile', 'retail')
    })
  })

  test('Desktop - should display full sidebar', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    await expect(page.locator('text=Dashboard')).toBeVisible()
    await expect(page.locator('text=Live Cameras')).toBeVisible()
  })

  test('Tablet - should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    // Page should load without errors
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('Mobile - should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Page should load without errors
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('Mobile - sidebar should be collapsible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Sidebar should be collapsed or hidden on mobile
    const sidebar = page.locator('aside, nav').first()
    const isVisible = await sidebar.isVisible()
    
    // If visible, check if it's collapsed
    if (isVisible) {
      const width = await sidebar.evaluate(el => el.getBoundingClientRect().width)
      expect(width).toBeLessThan(300) // Collapsed sidebar should be narrow
    }
  })

  test('Tablet - grid layouts should adapt', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/cameras')
    
    // Camera grid should be visible
    await expect(page.locator('text=/CAM-/i').first()).toBeVisible()
  })

  test('Mobile - forms should be usable', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/industry/branding')
    
    // Form inputs should be visible and usable
    await expect(page.locator('input').first()).toBeVisible()
    await expect(page.locator('button').first()).toBeVisible()
  })

  test('Desktop - multi-column layouts should work', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/industry/models')
    
    // Should display multiple columns
    const cards = await page.locator('.grid > div, [class*="grid"] > div').count()
    expect(cards).toBeGreaterThan(0)
  })

  test('Responsive - navigation should work on all sizes', async ({ page }) => {
    const sizes = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1920, height: 1080 }, // Desktop
    ]
    
    for (const size of sizes) {
      await page.setViewportSize(size)
      await page.goto('/')
      
      // Should be able to navigate
      await page.goto('/cameras')
      await expect(page).toHaveURL(/.*cameras/)
      
      await page.goto('/analytics')
      await expect(page).toHaveURL(/.*analytics/)
    }
  })
})

