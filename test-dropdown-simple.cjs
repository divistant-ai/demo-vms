const playwright = require('playwright');

(async () => {
  console.log('🔍 Testing Dropdown Menu (Simple)...\n');
  
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
    // Set localStorage to skip onboarding
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
      localStorage.setItem('onboarding', 'completed');
      localStorage.setItem('industryProfile', JSON.stringify({
        industry: 'smart_city',
        name: 'Smart City'
      }));
    });
    
    console.log('1️⃣  Logging in...');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('2️⃣  Current URL:', page.url());
    
    // Take screenshot
    await page.screenshot({ path: 'navbar.png', fullPage: false });
    console.log('   Screenshot saved: navbar.png');
    
    console.log('3️⃣  Looking for profile button...');
    
    // Try different selectors
    const selectors = [
      '.sm\\:flex:has-text("Admin User")',
      'button:has-text("Admin User")',
      '[class*="sm:flex"]:has-text("Admin")',
      'div:has-text("Admin User")',
    ];
    
    let found = false;
    for (const selector of selectors) {
      try {
        const element = page.locator(selector).first();
        const isVisible = await element.isVisible({ timeout: 1000 });
        if (isVisible) {
          console.log(`   ✅ Found with selector: ${selector}`);
          
          // Get the HTML
          const html = await element.evaluate(el => el.outerHTML);
          console.log('   HTML:', html.substring(0, 200));
          
          // Click it
          console.log('4️⃣  Clicking profile button...');
          await element.click();
          await page.waitForTimeout(1000);
          
          // Take screenshot after click
          await page.screenshot({ path: 'after-click.png' });
          console.log('   Screenshot saved: after-click.png');
          
          // Check for dropdown menu
          const menuVisible = await page.locator('[role="menu"]').isVisible({ timeout: 1000 }).catch(() => false);
          console.log('5️⃣  Dropdown menu visible:', menuVisible);
          
          if (menuVisible) {
            const menuItems = await page.locator('[role="menuitem"]').allTextContents();
            console.log('   ✅ Menu items:', menuItems);
          } else {
            console.log('   ❌ Dropdown menu NOT visible');
            
            // Check all visible elements
            const allText = await page.locator('body').textContent();
            console.log('   Page contains "My Profile":', allText.includes('My Profile'));
            console.log('   Page contains "Settings":', allText.includes('Settings'));
            console.log('   Page contains "Organization":', allText.includes('Organization'));
          }
          
          found = true;
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    if (!found) {
      console.log('   ❌ Profile button NOT found with any selector');
      
      // Debug: show all navbar content
      const navbarText = await page.locator('nav').first().textContent().catch(() => 'N/A');
      console.log('   Navbar content:', navbarText);
    }
    
    // Print errors
    if (errors.length > 0) {
      console.log('\n❌ JavaScript Errors:');
      errors.forEach(error => {
        console.log(`   ${error}`);
      });
    } else {
      console.log('\n✅ No JavaScript errors');
    }
    
    // Print error logs
    const errorLogs = logs.filter(log => log.type === 'error');
    if (errorLogs.length > 0) {
      console.log('\n❌ Console Errors:');
      errorLogs.forEach(log => {
        console.log(`   ${log.text}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
})();

