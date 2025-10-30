import { test, expect } from '@playwright/test'

test.describe('Complete User Journey', () => {
  test('Full user journey - from login to using features', async ({ page }) => {
    // 1. Login
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // 2. Complete Onboarding
    await page.waitForURL(/\/(onboarding|$)/, { timeout: 5000 })
    
    if (page.url().includes('onboarding')) {
      await page.click('text=/Get Started|Next/i')
      await page.click('text=/Retail/i').first()
      await page.click('text=/Next|Continue/i')
      await page.click('text=/Next|Continue/i')
      await page.fill('input[placeholder*="company" i]', 'Test Retail Store')
      await page.click('text=/Complete|Finish/i')
    }
    
    await page.waitForURL(/\/$/, { timeout: 5000 })
    
    // 3. View Dashboard
    await expect(page.locator('text=/Dashboard|Active Cameras/i')).toBeVisible()
    
    // 4. Check Live Cameras
    await page.click('text=Live Cameras')
    await expect(page).toHaveURL(/.*cameras/)
    await expect(page.locator('text=/CAM-/i')).toBeVisible()
    
    // 5. View Map
    await page.click('text=Map View')
    await expect(page).toHaveURL(/.*map/)
    await expect(page.locator('iframe[src*="google.com/maps"]')).toBeVisible()
    
    // 6. Check Analytics
    await page.click('text=Analytics').first()
    await expect(page).toHaveURL(/.*analytics/)
    await expect(page.locator('text=/Analytics/i')).toBeVisible()
    
    // 7. View Incidents
    await page.click('text=Incidents')
    await expect(page).toHaveURL(/.*incidents/)
    await expect(page.locator('text=/INC-/i')).toBeVisible()
    
    // 8. Explore Industry Profile
    await page.click('text=Industry Profile')
    await expect(page).toHaveURL(/.*industry\/profile/)
    
    // 9. Check AI Models Marketplace
    await page.click('a[href="/industry/models"]')
    await expect(page).toHaveURL(/.*industry\/models/)
    await expect(page.locator('text=/Person Detection|Vehicle Detection/i')).toBeVisible()
    
    // 10. Check Integration Marketplace
    await page.click('a[href="/industry/integrations"]')
    await expect(page).toHaveURL(/.*industry\/integrations/)
    await expect(page.locator('text=/POS Systems|Warehouse/i')).toBeVisible()
    
    // 11. View Compliance Reports
    await page.click('a[href="/industry/compliance"]')
    await expect(page).toHaveURL(/.*industry\/compliance/)
    await expect(page.locator('text=/GDPR|ISO/i')).toBeVisible()
    
    // 12. Check Benchmarks
    await page.click('a[href="/industry/benchmarks"]')
    await expect(page).toHaveURL(/.*industry\/benchmarks/)
    await expect(page.locator('text=/Conversion Rate|Industry Average/i')).toBeVisible()
    
    // 13. View White-Label Settings
    await page.click('a[href="/industry/branding"]')
    await expect(page).toHaveURL(/.*industry\/branding/)
    await expect(page.locator('text=/White-Label/i')).toBeVisible()
    
    // 14. Check Organization Settings
    await page.click('text=Organization')
    await expect(page).toHaveURL(/.*tenant/)
    await expect(page.locator('text=/General|Subscription/i')).toBeVisible()
    
    // 15. Toggle Dark Mode
    await page.click('[title*="Mode"]').catch(() => page.locator('svg').filter({ has: page.locator('path') }).first().click())
    await page.waitForTimeout(500)
    
    // 16. Back to Dashboard
    await page.click('text=Dashboard')
    await expect(page).toHaveURL('/')
    
    console.log('✅ Complete user journey test passed!')
  })

  test('Retail industry journey', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Retail Manager', role: 'Manager' }))
      localStorage.setItem('onboarding', 'completed')
      localStorage.setItem('industryProfile', 'retail')
    })
    await page.goto('/')
    
    // Check retail-specific features
    await page.goto('/industry/benchmarks')
    await expect(page.locator('text=/Conversion Rate/i')).toBeVisible()
    
    await page.goto('/industry/models')
    await expect(page.locator('text=/Person Detection|Behavior Analysis/i')).toBeVisible()
  })

  test('Logistics industry journey', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Logistics Manager', role: 'Manager' }))
      localStorage.setItem('onboarding', 'completed')
      localStorage.setItem('industryProfile', 'logistics')
    })
    await page.goto('/')
    
    // Check logistics-specific features
    await page.goto('/industry/benchmarks')
    await expect(page.locator('text=/Vehicle Throughput|Safety Score/i')).toBeVisible()
    
    await page.goto('/industry/integrations')
    await expect(page.locator('text=/Warehouse Management/i')).toBeVisible()
  })

  test('Smart City industry journey', async ({ page }) => {
    await page.goto('/login')
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'City Manager', role: 'Administrator' }))
      localStorage.setItem('onboarding', 'completed')
      localStorage.setItem('industryProfile', 'smart_city')
    })
    await page.goto('/')
    
    // Check smart city-specific features
    await page.goto('/industry/integrations')
    await expect(page.locator('text=/Traffic Control/i')).toBeVisible()
    
    await page.goto('/map')
    await expect(page.locator('iframe[src*="google.com/maps"]')).toBeVisible()
  })
})

