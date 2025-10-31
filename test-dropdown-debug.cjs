const playwright = require('playwright');

(async () => {
  console.log('🔍 Debugging Dropdown Menu...\n');
  
  const browser = await playwright.chromium.launch({ headless: false });
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
    await page.waitForTimeout(3000);
    
    console.log('2️⃣  Current URL:', page.url());
    
    // Get all buttons in navbar
    console.log('\n3️⃣  All buttons in page:');
    const buttons = await page.locator('button').all();
    for (let i = 0; i < Math.min(buttons.length, 10); i++) {
      const text = await buttons[i].textContent();
      const classes = await buttons[i].getAttribute('class');
      console.log(`   Button ${i}: "${text?.trim()}" | classes: ${classes?.substring(0, 50)}`);
    }
    
    // Try to find dropdown button
    console.log('\n4️⃣  Looking for dropdown button...');
    const dropdownButton = page.locator('button').filter({ hasText: 'Admin User' }).first();
    const exists = await dropdownButton.count();
    console.log(`   Found ${exists} button(s) with "Admin User"`);
    
    if (exists > 0) {
      const isVisible = await dropdownButton.isVisible();
      console.log(`   Visible: ${isVisible}`);
      
      if (isVisible) {
        console.log('\n5️⃣  Clicking dropdown button...');
        await dropdownButton.click();
        await page.waitForTimeout(1000);
        
        // Check for menu
        const menu = page.locator('[role="menu"]');
        const menuExists = await menu.count();
        console.log(`   Found ${menuExists} menu(s)`);
        
        if (menuExists > 0) {
          const menuVisible = await menu.isVisible();
          console.log(`   Menu visible: ${menuVisible}`);
          
          if (menuVisible) {
            const items = await page.locator('[role="menuitem"]').allTextContents();
            console.log(`   ✅ Menu items: ${items.join(', ')}`);
          }
        }
      }
    }
    
    console.log('\n✅ Browser will stay open for 30 seconds for manual inspection...');
    await page.waitForTimeout(30000);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();

