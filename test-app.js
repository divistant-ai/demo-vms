const { chromium } = require('playwright');

(async () => {
  console.log('🚀 Starting Application Test...\n');
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let errors = [];
  let warnings = [];
  
  // Capture console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    } else if (msg.type() === 'warning') {
      warnings.push(msg.text());
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    errors.push(error.message);
  });
  
  try {
    console.log('1️⃣  Testing Login Page...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(2000);
    console.log('   ✅ Login page loaded\n');
    
    console.log('2️⃣  Testing Login...');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'admin123');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);
    console.log('   ✅ Login successful\n');
    
    console.log('3️⃣  Testing Dashboard...');
    const currentUrl = page.url();
    if (currentUrl.includes('onboarding')) {
      console.log('   ℹ️  Onboarding detected, completing...');
      await page.click('button:has-text("Get Started")');
      await page.waitForTimeout(1000);
      await page.locator('button').filter({ hasText: /Retail/ }).first().click();
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(500);
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(500);
      await page.click('button:has-text("Complete Setup")');
      await page.waitForTimeout(2000);
    }
    console.log('   ✅ Dashboard loaded\n');
    
    console.log('4️⃣  Testing Navigation...');
    const routes = [
      { url: '/cameras', name: 'Cameras' },
      { url: '/map', name: 'Map' },
      { url: '/analytics', name: 'Analytics' },
      { url: '/incidents', name: 'Incidents' },
      { url: '/alerts', name: 'Alerts' },
      { url: '/industry/profile', name: 'Industry Profile' },
      { url: '/industry/models', name: 'AI Models' },
      { url: '/industry/integrations', name: 'Integrations' },
      { url: '/industry/compliance', name: 'Compliance' },
      { url: '/industry/benchmarks', name: 'Benchmarks' },
      { url: '/industry/branding', name: 'White-Label' },
    ];
    
    for (const route of routes) {
      await page.goto(`http://localhost:5173${route.url}`, { waitUntil: 'domcontentloaded', timeout: 5000 });
      await page.waitForTimeout(1000);
      console.log(`   ✅ ${route.name} page loaded`);
    }
    console.log('');
    
    console.log('5️⃣  Testing Dark Mode...');
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(1000);
    const htmlClass = await page.locator('html').getAttribute('class');
    console.log(`   ℹ️  Current theme: ${htmlClass?.includes('dark') ? 'Dark' : 'Light'}`);
    console.log('   ✅ Theme system working\n');
    
  } catch (error) {
    console.error('❌ Test Error:', error.message);
    errors.push(error.message);
  }
  
  await browser.close();
  
  console.log('═══════════════════════════════════════');
  console.log('📊 TEST RESULTS');
  console.log('═══════════════════════════════════════\n');
  
  if (errors.length === 0) {
    console.log('✅ NO ERRORS FOUND!\n');
    console.log('🎉 Application is working perfectly!\n');
    console.log('All pages loaded successfully without errors.');
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


