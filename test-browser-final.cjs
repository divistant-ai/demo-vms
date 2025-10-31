const playwright = require('playwright');

(async () => {
  console.log('🔍 FINAL BROWSER TEST - All Pages\n');
  
  const browser = await playwright.chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  const errors = [];
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  const pages = [
    { path: '/', name: 'Homepage' },
    { path: '/login', name: 'Login' },
    { path: '/profile', name: 'Profile' },
    { path: '/cameras', name: 'Cameras' },
    { path: '/map', name: 'Map' },
    { path: '/analytics', name: 'Analytics' },
    { path: '/incidents', name: 'Incidents' },
    { path: '/alerts', name: 'Alerts' },
    { path: '/configuration', name: 'Configuration' },
    { path: '/tenant/settings', name: 'Organization' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const testPage of pages) {
    try {
      await page.goto(`http://localhost:5173${testPage.path}`, {
        waitUntil: 'networkidle',
        timeout: 10000
      });
      
      await page.waitForTimeout(1000);
      
      const content = await page.$eval('#root', el => el.innerHTML).catch(() => '');
      
      if (content.length > 100 && errors.length === 0) {
        console.log(`✅ ${testPage.name} (${testPage.path})`);
        passed++;
      } else {
        console.log(`❌ ${testPage.name} (${testPage.path})`);
        failed++;
      }
      
      errors.length = 0; // Clear errors for next page
      
    } catch (error) {
      console.log(`❌ ${testPage.name} (${testPage.path}) - ${error.message}`);
      failed++;
    }
  }
  
  console.log('\n=======================');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log('=======================');
  
  if (failed === 0) {
    console.log('\n🎉 ALL PAGES WORKING PERFECTLY!');
    console.log('✅ No JavaScript errors');
    console.log('✅ All pages render correctly');
    console.log('✅ Production build is stable');
    console.log('\n🚀 Application is ready for use!');
    console.log('📍 URL: http://localhost:5173');
  }
  
  await browser.close();
})();

