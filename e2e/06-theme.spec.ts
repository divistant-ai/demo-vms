import { test, expect } from '@playwright/test'

test.describe('Dark/Light Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Admin User', role: 'Administrator' }))
      localStorage.setItem('onboarding', 'completed')
      localStorage.setItem('industryProfile', 'retail')
    })
    await page.goto('/')
  })

  test('should toggle between light and dark mode', async ({ page }) => {
    // Check initial state (light mode)
    const htmlClass = await page.locator('html').getAttribute('class')
    const isDark = htmlClass?.includes('dark')
    
    // Click theme toggle
    await page.click('[title*="Mode"]').catch(() => page.locator('svg').filter({ has: page.locator('path[d*="17.293"]') }).click())
    
    // Wait for theme change
    await page.waitForTimeout(500)
    
    // Check if theme changed
    const newHtmlClass = await page.locator('html').getAttribute('class')
    const isNowDark = newHtmlClass?.includes('dark')
    
    expect(isNowDark).not.toBe(isDark)
  })

  test('should persist theme preference', async ({ page }) => {
    // Toggle to dark mode
    await page.click('[title*="Mode"]').catch(() => page.locator('svg').filter({ has: page.locator('path[d*="17.293"]') }).click())
    await page.waitForTimeout(500)
    
    // Reload page
    await page.reload()
    
    // Check if theme persisted
    const htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
  })

  test('should apply dark mode styles correctly', async ({ page }) => {
    // Toggle to dark mode
    await page.click('[title*="Mode"]').catch(() => page.locator('svg').filter({ has: page.locator('path[d*="17.293"]') }).click())
    await page.waitForTimeout(500)
    
    // Check if dark background is applied
    const bgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor
    })
    
    // Dark mode should have dark background (not white)
    expect(bgColor).not.toBe('rgb(255, 255, 255)')
  })

  test('should work across all pages', async ({ page }) => {
    // Toggle to dark mode
    await page.click('[title*="Mode"]').catch(() => page.locator('svg').filter({ has: page.locator('path[d*="17.293"]') }).click())
    await page.waitForTimeout(500)
    
    // Navigate to different pages
    await page.goto('/cameras')
    let htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    await page.goto('/analytics')
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
    
    await page.goto('/industry/profile')
    htmlClass = await page.locator('html').getAttribute('class')
    expect(htmlClass).toContain('dark')
  })
})


