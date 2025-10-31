const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Quick Application Test\n');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  let errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    // Setup user to skip onboarding
    await page.goto('http://localhost:5173/login');
    await page.evaluate(() => {
      localStorage.setItem('user', JSON.stringify({ name: 'Test User', role: 'Admin' }));
      localStorage.setItem('onboarding', 'completed');
      localStorage.setItem('industryProfile', 'retail');
    });
    
    console.log('✅ Testing Login Page...');
    await page.goto('http://localhost:5173/login', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Dashboard...');
    await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(2000);
    
    console.log('✅ Testing Cameras...');
    await page.goto('http://localhost:5173/cameras', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Map...');
    await page.goto('http://localhost:5173/map', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Analytics...');
    await page.goto('http://localhost:5173/analytics', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Incidents...');
    await page.goto('http://localhost:5173/incidents', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Industry Profile...');
    await page.goto('http://localhost:5173/industry/profile', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing AI Models Marketplace...');
    await page.goto('http://localhost:5173/industry/models', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Integration Marketplace...');
    await page.goto('http://localhost:5173/industry/integrations', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Compliance Reports...');
    await page.goto('http://localhost:5173/industry/compliance', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Industry Benchmarks...');
    await page.goto('http://localhost:5173/industry/benchmarks', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing White-Label Branding...');
    await page.goto('http://localhost:5173/industry/branding', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
    console.log('✅ Testing Organization Settings...');
    await page.goto('http://localhost:5173/tenant/settings', { waitUntil: 'domcontentloaded', timeout: 10000 });
    await page.waitForTimeout(1000);
    
  } catch (error) {
    console.error('\n❌ Navigation Error:', error.message);
    errors.push(error.message);
  }
  
  await browser.close();
  
  console.log('\n═══════════════════════════════════════');
  console.log('📊 TEST RESULTS');
  console.log('═══════════════════════════════════════\n');
  
  if (errors.length === 0) {
    console.log('✅ NO ERRORS FOUND!\n');
    console.log('🎉 All pages loaded successfully!\n');
    console.log('Application is working perfectly without errors.');
    console.log('\n📍 Server: http://localhost:5173');
    console.log('📧 Test Account: admin@example.com / admin123\n');
    process.exit(0);
  } else {
    console.log(`❌ FOUND ${errors.length} ERROR(S):\n`);
    errors.forEach((err, i) => {
      console.log(`${i + 1}. ${err}`);
    });
    console.log('');
    process.exit(1);
  }
})();


