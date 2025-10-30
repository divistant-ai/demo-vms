#!/bin/bash

echo "🔍 VisionCore VMS - Application Verification Script"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0

# Function to check
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAILED++))
    fi
}

echo "1️⃣  Checking Node.js and npm..."
node --version > /dev/null 2>&1
check "Node.js installed"

npm --version > /dev/null 2>&1
check "npm installed"

echo ""
echo "2️⃣  Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} node_modules missing - run 'npm install'"
    ((FAILED++))
fi

echo ""
echo "3️⃣  Checking TypeScript compilation..."
npx tsc --noEmit > /dev/null 2>&1
check "TypeScript compiles without errors"

echo ""
echo "4️⃣  Checking for linting errors..."
LINT_OUTPUT=$(npm run lint 2>&1)
if echo "$LINT_OUTPUT" | grep -E "error.*@typescript-eslint" > /dev/null; then
    echo -e "${RED}✗${NC} Linting errors found"
    ((FAILED++))
else
    echo -e "${GREEN}✓${NC} No critical linting errors (warnings OK)"
    ((PASSED++))
fi

echo ""
echo "5️⃣  Checking build..."
npm run build > /dev/null 2>&1
check "Production build successful"

echo ""
echo "6️⃣  Checking critical files..."
files=(
    "src/App.tsx"
    "src/main.tsx"
    "src/pages/DashboardPage.tsx"
    "src/pages/LoginPage.tsx"
    "src/pages/OnboardingPage.tsx"
    "src/pages/IndustryProfilePage.tsx"
    "src/pages/AIModelsMarketplacePage.tsx"
    "src/pages/IntegrationMarketplacePage.tsx"
    "src/pages/ComplianceReportsPage.tsx"
    "src/pages/IndustryBenchmarksPage.tsx"
    "src/pages/WhiteLabelPage.tsx"
    "src/contexts/ThemeContext.tsx"
    "src/contexts/TenantContext.tsx"
    "src/contexts/LanguageContext.tsx"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $file missing"
        ((FAILED++))
    fi
done

echo ""
echo "7️⃣  Checking routes configuration..."
if grep -q "industry/models" src/App.tsx; then
    echo -e "${GREEN}✓${NC} Industry routes configured"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Industry routes missing"
    ((FAILED++))
fi

echo ""
echo "8️⃣  Checking for console.log (should be minimal)..."
LOG_COUNT=$(grep -r "console.log" src/ --include="*.tsx" --include="*.ts" | wc -l | tr -d ' ')
if [ "$LOG_COUNT" -lt 10 ]; then
    echo -e "${GREEN}✓${NC} Console.log usage acceptable ($LOG_COUNT found)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Many console.log found ($LOG_COUNT) - consider removing"
fi

echo ""
echo "9️⃣  Checking for TODO comments..."
TODO_COUNT=$(grep -r "TODO\|FIXME" src/ --include="*.tsx" --include="*.ts" | wc -l | tr -d ' ')
if [ "$TODO_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✓${NC} No TODO/FIXME comments"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Found $TODO_COUNT TODO/FIXME comments"
fi

echo ""
echo "🔟  Checking bundle size..."
if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist | cut -f1)
    echo -e "${GREEN}✓${NC} Build size: $BUNDLE_SIZE"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} No dist folder - run 'npm run build'"
fi

echo ""
echo "=================================================="
echo "📊 VERIFICATION SUMMARY"
echo "=================================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "🚀 Application is ready for testing!"
    echo ""
    echo "To start the dev server:"
    echo "  npm run dev"
    echo ""
    echo "To build for production:"
    echo "  npm run build"
    echo ""
    echo "To preview production build:"
    echo "  npm run preview"
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    echo ""
    echo "Please fix the issues above before proceeding."
    exit 1
fi

