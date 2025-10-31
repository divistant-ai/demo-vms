const playwright = require('playwright');

(async () => {
  console.log('🔍 Testing Dropdown Menu...\n');
  
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Collect console logs
  const logs = [];
  page.on('console', msg => {
    logs.push({ type: msg.type(), text: msg.text() });
  });
  
  // Collect errors
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    // Login
    console.log('1️⃣  Navigating to login page...');
    await page.goto('http://localhost:5173/login');
    await page.waitForLoadState('networkidle');
    
    console.log('2️⃣  Logging in...');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Check if we're on onboarding or dashboard
    const currentUrl = page.url();
    console.log('3️⃣  Current URL:', currentUrl);
    
    if (currentUrl.includes('/onboarding')) {
      console.log('4️⃣  Completing onboarding...');
      // Click first industry option
      await page.click('button:has-text("Smart City")');
      await page.waitForTimeout(500);
      
      // Click next
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(500);
      
      // Select use cases
      await page.click('input[type="checkbox"]').catch(() => {});
      await page.waitForTimeout(500);
      
      // Click next
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(500);
      
      // Fill organization details
      await page.fill('input[placeholder*="organization" i]', 'Test Org').catch(() => {});
      await page.waitForTimeout(500);
      
      // Complete setup
      await page.click('button:has-text("Complete")');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }
    
    console.log('5️⃣  Looking for profile button...');
    
    // Take screenshot before
    await page.screenshot({ path: 'before-click.png' });
    
    // Try to find the profile button
    const profileButton = await page.locator('.sm\\:flex').filter({ hasText: 'Admin User' }).first();
    const isVisible = await profileButton.isVisible().catch(() => false);
    
    console.log('   Profile button visible:', isVisible);
    
    if (isVisible) {
      console.log('6️⃣  Clicking profile button...');
      await profileButton.click();
      await page.waitForTimeout(1000);
      
      // Take screenshot after
      await page.screenshot({ path: 'after-click.png' });
      
      // Check if dropdown menu appeared
      const dropdownMenu = await page.locator('[role="menu"]').isVisible().catch(() => false);
      console.log('   Dropdown menu visible:', dropdownMenu);
      
      if (dropdownMenu) {
        console.log('✅ Dropdown menu is working!');
        
        // Check menu items
        const menuItems = await page.locator('[role="menuitem"]').allTextContents();
        console.log('   Menu items:', menuItems);
      } else {
        console.log('❌ Dropdown menu NOT visible');
        
        // Check what elements are present
        const allButtons = await page.locator('button').allTextContents();
        console.log('   All buttons:', allButtons.slice(0, 10));
      }
    } else {
      console.log('❌ Profile button NOT found');
    }
    
    // Print console logs
    if (logs.length > 0) {
      console.log('\n📋 Console Logs:');
      logs.forEach(log => {
        if (log.type === 'error') {
          console.log(`   ❌ ${log.text}`);
        }
      });
    }
    
    // Print errors
    if (errors.length > 0) {
      console.log('\n❌ Errors Found:');
      errors.forEach(error => {
        console.log(`   ${error}`);
      });
    } else {
      console.log('\n✅ No JavaScript errors found');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();

