#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

console.log('🔍 COMPREHENSIVE DUMMY DATA AUDIT\n');
console.log('============================================================\n');

const issues = [];
const warnings = [];
const good = [];

// Read all page files
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(pagesDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const checks = {
    hasChart: /LineChart|BarChart|PieChart|AreaChart/.test(content),
    hasTable: /Table|TableRow|TableCell|<table/.test(content),
    hasList: /\.map\(.*=>/.test(content),
    hasEmptyState: /empty.*state|no.*data|length === 0/i.test(content),
    hasMockData: /mock[A-Z]|const.*=.*\[/i.test(content),
    hasPlaceholder: /placeholder.*text|TODO|FIXME|h-64 flex items-center justify-center/i.test(content),
    hasLoadingOnly: /Loading chart\.\.\.|Loading data\.\.\./i.test(content),
  };
  
  const pageInfo = {
    file,
    lines: lines.length,
    ...checks
  };
  
  // Determine status
  if (checks.hasPlaceholder && !checks.hasEmptyState) {
    issues.push({
      ...pageInfo,
      issue: 'Has placeholder without proper empty state'
    });
  } else if (checks.hasChart && !checks.hasMockData && !checks.hasLoadingOnly) {
    warnings.push({
      ...pageInfo,
      warning: 'Has chart but no visible mock data (might use API)'
    });
  } else if ((checks.hasTable || checks.hasList) && !checks.hasEmptyState) {
    warnings.push({
      ...pageInfo,
      warning: 'Has table/list but no empty state handling'
    });
  } else {
    good.push(pageInfo);
  }
});

// Print issues
if (issues.length > 0) {
  console.log('❌ CRITICAL ISSUES:\n');
  issues.forEach(item => {
    console.log(`  ${item.file}`);
    console.log(`    Issue: ${item.issue}`);
    console.log(`    Lines: ${item.lines}`);
    console.log('');
  });
}

// Print warnings
if (warnings.length > 0) {
  console.log('⚠️  WARNINGS (Might be OK):\n');
  warnings.forEach(item => {
    console.log(`  ${item.file}`);
    console.log(`    Warning: ${item.warning}`);
    console.log(`    Chart: ${item.hasChart}, Table: ${item.hasTable}, List: ${item.hasList}`);
    console.log('');
  });
}

// Print good pages
console.log('✅ PAGES WITH PROPER DATA HANDLING:\n');
good.forEach(item => {
  const features = [];
  if (item.hasChart) features.push('Chart');
  if (item.hasTable) features.push('Table');
  if (item.hasList) features.push('List');
  if (item.hasEmptyState) features.push('EmptyState');
  if (item.hasMockData) features.push('MockData');
  
  console.log(`  ${item.file.padEnd(40)} [${features.join(', ')}]`);
});

console.log('\n============================================================');
console.log('📊 SUMMARY:');
console.log(`   Critical Issues: ${issues.length}`);
console.log(`   Warnings: ${warnings.length}`);
console.log(`   Good: ${good.length}`);
console.log(`   Total: ${files.length}`);
console.log('============================================================\n');

// Exit with error if there are critical issues
process.exit(issues.length > 0 ? 1 : 0);

