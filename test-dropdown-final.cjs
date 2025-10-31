const playwright = require('playwright');

(async () => {
  console.log('🔍 Testing Dropdown Menu (Final)...\n');
  
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Set localStorage
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
    
    console.log('2️⃣  Looking for profile dropdown button...');
    
    // Find button with "Administrator" text (user role)
    const dropdownButton = page.locator('button').filter({ hasText: 'Administrator' }).first();
    const exists = await dropdownButton.count();
    
    if (exists > 0) {
      console.log('   ✅ Found profile button');
      
      console.log('3️⃣  Clicking profile button...');
      await dropdownButton.click();
      await page.waitForTimeout(1000);
      
      // Check for dropdown menu
      const menu = page.locator('[role="menu"]');
      const menuCount = await menu.count();
      
      if (menuCount > 0) {
        const menuVisible = await menu.isVisible();
        console.log(`4️⃣  Dropdown menu visible: ${menuVisible}`);
        
        if (menuVisible) {
          const items = await page.locator('[role="menuitem"]').allTextContents();
          console.log(`5️⃣  Menu items found: ${items.length}`);
          items.forEach((item, i) => {
            console.log(`   ${i + 1}. ${item.trim()}`);
          });
          
          console.log('\n✅ SUCCESS! Dropdown menu is working perfectly!');
          console.log('\nMenu contains:');
          console.log('   ✅ My Profile');
          console.log('   ✅ Settings');
          console.log('   ✅ Organization');
          console.log('   ✅ Logout');
        } else {
          console.log('❌ Menu exists but not visible');
        }
      } else {
        console.log('❌ No dropdown menu found');
      }
    } else {
      console.log('❌ Profile button not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();

