const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const pages = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

console.log('🔍 AUDITING ALL PAGES FOR DEMO DATA\n');
console.log('=' .repeat(60));

const results = {
  complete: [],
  needsData: [],
  errors: []
};

pages.forEach(page => {
  const filePath = path.join(pagesDir, page);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check for common indicators of demo data
  const hasMockData = content.includes('mock') || content.includes('Mock') || content.includes('MOCK');
  const hasData = content.includes('const data') || content.includes('const items') || content.includes('useState(');
  const hasEmptyState = content.includes('EmptyState') || content.includes('No data') || content.includes('Coming soon');
  const hasTable = content.includes('Table') || content.includes('<table');
  const hasCards = content.includes('Card') || content.includes('grid');
  const hasQuery = content.includes('useQuery');
  
  // Calculate a "completeness score"
  let score = 0;
  if (hasMockData) score += 3;
  if (hasData) score += 2;
  if (hasTable || hasCards) score += 2;
  if (hasQuery) score += 1;
  
  const status = {
    file: page,
    score,
    hasMockData,
    hasData,
    hasEmptyState,
    hasTable,
    hasCards,
    hasQuery,
    lines: content.split('\n').length
  };
  
  if (score >= 5) {
    results.complete.push(status);
  } else if (score >= 2) {
    results.needsData.push(status);
  } else {
    results.errors.push(status);
  }
});

console.log('\n✅ COMPLETE PAGES (Score >= 5):');
console.log('-'.repeat(60));
results.complete.forEach(p => {
  console.log(`  ${p.file.padEnd(35)} Score: ${p.score} | Lines: ${p.lines}`);
});

console.log('\n⚠️  NEEDS MORE DATA (Score 2-4):');
console.log('-'.repeat(60));
results.needsData.forEach(p => {
  console.log(`  ${p.file.padEnd(35)} Score: ${p.score} | Lines: ${p.lines}`);
  console.log(`     Mock: ${p.hasMockData ? '✓' : '✗'} | Data: ${p.hasData ? '✓' : '✗'} | Table: ${p.hasTable ? '✓' : '✗'} | Cards: ${p.hasCards ? '✓' : '✗'}`);
});

console.log('\n❌ MINIMAL/EMPTY PAGES (Score < 2):');
console.log('-'.repeat(60));
results.errors.forEach(p => {
  console.log(`  ${p.file.padEnd(35)} Score: ${p.score} | Lines: ${p.lines}`);
  console.log(`     Mock: ${p.hasMockData ? '✓' : '✗'} | Data: ${p.hasData ? '✓' : '✗'} | Empty: ${p.hasEmptyState ? '✓' : '✗'}`);
});

console.log('\n' + '='.repeat(60));
console.log(`📊 SUMMARY:`);
console.log(`   Complete: ${results.complete.length}`);
console.log(`   Needs Data: ${results.needsData.length}`);
console.log(`   Minimal/Empty: ${results.errors.length}`);
console.log(`   Total: ${pages.length}`);
console.log('='.repeat(60));

