import { test, expect } from '@playwright/test'

test.describe('Smoke Tests - Critical Paths', () => {
  test('Complete user journey - login to dashboard', async ({ page }) => {
    // 1. Visit login page
    await page.goto('/')
    await expect(page).toHaveURL(/.*login/)
    
    // 2. Login
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // 3. Handle onboarding or go to dashboard
    await page.waitForTimeout(2000)
    
    // If onboarding appears, complete it quickly
    const getStartedBtn = page.locator('button:has-text("Get Started")')
    if (await getStartedBtn.isVisible().catch(() => false)) {
      await getStartedBtn.click()
      await page.locator('button').filter({ hasText: /Retail/ }).first().click()
      await page.click('button:has-text("Continue")')
      await page.click('button:has-text("Continue")')
      await page.click('button:has-text("Complete Setup")')
    }
    
    // 4. Should be on dashboard
    await page.waitForURL(/\/$/, { timeout: 10000 })
    await expect(page).toHaveURL('/')
    
    console.log('✅ Login to Dashboard - PASSED')
  })

  test('All main pages load without errors', async ({ page }) => {
    // Setup
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Test User', role: 'Admin' }))
      localStorage.setItem('onboarding', 'completed')
      localStorage.setItem('industryProfile', 'retail')
    })
    
    const pages = [
      { url: '/', name: 'Dashboard' },
      { url: '/cameras', name: 'Cameras' },
      { url: '/map', name: 'Map' },
      { url: '/analytics', name: 'Analytics' },
      { url: '/incidents', name: 'Incidents' },
      { url: '/alerts', name: 'Alerts' },
      { url: '/models', name: 'AI Models' },
      { url: '/configuration', name: 'Configuration' },
      { url: '/tenant/settings', name: 'Organization' },
      { url: '/industry/profile', name: 'Industry Profile' },
      { url: '/industry/templates', name: 'Templates' },
      { url: '/industry/models', name: 'AI Models Marketplace' },
      { url: '/industry/integrations', name: 'Integrations' },
      { url: '/industry/compliance', name: 'Compliance' },
      { url: '/industry/benchmarks', name: 'Benchmarks' },
      { url: '/industry/branding', name: 'White-Label' },
    ]
    
    for (const p of pages) {
      await page.goto(p.url)
      await page.waitForLoadState('domcontentloaded')
      
      // Check no major errors
      const hasError = await page.locator('text=/error|failed|crash/i').isVisible().catch(() => false)
      expect(hasError).toBe(false)
      
      console.log(`✅ ${p.name} - LOADED`)
    }
    
    console.log('✅ All Pages Load - PASSED')
  })

  test('Dark mode works', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Test User', role: 'Admin' }))
      localStorage.setItem('onboarding', 'completed')
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    
    // Get initial theme
    const initialClass = await page.locator('html').getAttribute('class')
    
    // Toggle theme (find any SVG icon in navbar)
    await page.locator('nav svg').first().click()
    await page.waitForTimeout(500)
    
    // Check if class changed
    const newClass = await page.locator('html').getAttribute('class')
    
    // Should be different (either added or removed 'dark')
    expect(initialClass !== newClass).toBe(true)
    
    console.log('✅ Dark Mode Toggle - PASSED')
  })

  test('Navigation between pages works', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Test User', role: 'Admin' }))
      localStorage.setItem('onboarding', 'completed')
    })
    
    // Navigate through key pages
    await page.goto('/')
    await expect(page).toHaveURL('/')
    
    await page.goto('/cameras')
    await expect(page).toHaveURL('/cameras')
    
    await page.goto('/industry/profile')
    await expect(page).toHaveURL('/industry/profile')
    
    await page.goto('/industry/models')
    await expect(page).toHaveURL('/industry/models')
    
    console.log('✅ Navigation - PASSED')
  })

  test('Responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Test User', role: 'Admin' }))
      localStorage.setItem('onboarding', 'completed')
    })
    
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    
    // Page should load without horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth
    })
    
    expect(hasHorizontalScroll).toBe(false)
    
    console.log('✅ Mobile Responsive - PASSED')
  })
})

