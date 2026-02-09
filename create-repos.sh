#!/bin/bash
# Create all GitHub repos for ethancreasey01-ui

echo "🚀 Creating GitHub repos for ethancreasey01-ui..."

# Main ari repo
echo "📁 Creating ari (main workspace)..."
cd /Users/adbiptuy/clawd
gh repo create ethancreasey01-ui/ari --public --description "Ari - AI Assistant Workspace & Projects" --source=. --remote=origin --push

# dsea-site repo
echo "📁 Creating dsea-site..."
cd /Users/adbiptuy/clawd/dsea-site
gh repo create ethancreasey01-ui/dsea-site --public --description "DSEA Electrician & Aircon Website" --source=. --remote=origin --push

# plumber-site repo
echo "📁 Creating plumber-site..."
cd /Users/adbiptuy/clawd/plumber-site
gh repo create ethancreasey01-ui/plumber-site --public --description "Melbourne Plumber Blocked Drains Website" --source=. --remote=origin --push

# meal-planner repo
echo "📁 Creating meal-planner..."
cd /Users/adbiptuy/clawd/meal-planner
git init
git add .
git commit -m "Initial commit" 2>/dev/null || echo "Nothing to commit"
gh repo create ethancreasey01-ui/meal-planner --public --description "Drag & Drop Meal Planner with Apple Reminders" --source=. --remote=origin --push

# ticket-scraper repo
echo "📁 Creating ticket-scraper..."
cd /Users/adbiptuy/clawd/skills/ticket-scraper
git init
git add .
git commit -m "Initial commit" 2>/dev/null || echo "Nothing to commit"
gh repo create ethancreasey01-ui/ticket-scraper --public --description "LiveNation AU Ticket Scraper" --source=. --remote=origin --push

# call-ready-sites repo
echo "📁 Creating call-ready-sites..."
cd /Users/adbiptuy/clawd/call-ready-sites
git init
git add .
git commit -m "Initial commit" 2>/dev/null || echo "Nothing to commit"
gh repo create ethancreasey01-ui/call-ready-sites --public --description "Call Ready Sites - Trade Website Templates" --source=. --remote=origin --push

echo "✅ All repos created!"
echo ""
echo "Your repos:"
echo "  https://github.com/ethancreasey01-ui/ari"
echo "  https://github.com/ethancreasey01-ui/dsea-site"
echo "  https://github.com/ethancreasey01-ui/plumber-site"
echo "  https://github.com/ethancreasey01-ui/meal-planner"
echo "  https://github.com/ethancreasey01-ui/ticket-scraper"
echo "  https://github.com/ethancreasey01-ui/call-ready-sites"
