#!/bin/bash
echo "🔍 TESTING ALL PAGES..."
echo "======================="

pages=(
    "/"
    "/login"
    "/profile"
    "/cameras"
    "/map"
    "/analytics"
    "/ai-insights"
    "/incidents"
    "/alerts"
    "/configuration"
    "/reports"
    "/tenant/settings"
    "/industry/profile"
)

passed=0
failed=0

for page in "${pages[@]}"; do
    if curl -s "http://localhost:5173${page}" > /dev/null; then
        echo "✅ ${page}"
        ((passed++))
    else
        echo "❌ ${page}"
        ((failed++))
    fi
done

echo ""
echo "======================="
echo "✅ Passed: $passed"
echo "❌ Failed: $failed"
echo "======================="

if [ $failed -eq 0 ]; then
    echo "🎉 ALL PAGES WORKING!"
    exit 0
else
    echo "⚠️  Some pages have issues"
    exit 1
fi
