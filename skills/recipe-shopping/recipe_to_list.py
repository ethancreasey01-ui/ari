#!/usr/bin/env python3
"""
Recipe to Shopping List Converter
Parses a recipe and adds ingredients to Apple Reminders Shopping List
"""

import subprocess
import sys

def add_to_shopping_list(item):
    """Add an item to the Shopping List in Apple Reminders"""
    try:
        # Add emoji based on item type
        emoji = "🛒"
        item_lower = item.lower()
        
        if any(word in item_lower for word in ['milk', 'cheese', 'butter', 'cream', 'yogurt']):
            emoji = "🥛"
        elif any(word in item_lower for word in ['bread', 'roll', 'bun', 'bagel']):
            emoji = "🍞"
        elif any(word in item_lower for word in ['egg']):
            emoji = "🥚"
        elif any(word in item_lower for word in ['chicken', 'beef', 'pork', 'mince', 'steak']):
            emoji = "🥩"
        elif any(word in item_lower for word in ['pasta', 'spaghetti', 'noodle']):
            emoji = "🍝"
        elif any(word in item_lower for word in ['tomato', 'lettuce', 'carrot', 'onion', 'garlic', 'potato', 'vegetable']):
            emoji = "🥬"
        elif any(word in item_lower for word in ['apple', 'banana', 'orange', 'fruit']):
            emoji = "🍎"
        elif any(word in item_lower for word in ['oil', 'olive']):
            emoji = "🫒"
        elif any(word in item_lower for word in ['salt', 'pepper', 'spice', 'herb']):
            emoji = "🧂"
        elif any(word in item_lower for word in ['sauce', 'ketchup', 'mustard', 'mayo']):
            emoji = "🥫"
        elif any(word in item_lower for word in ['rice']):
            emoji = "🍚"
        elif any(word in item_lower for word in ['sugar', 'flour', 'baking']):
            emoji = "🥡"
        
        full_item = f"{emoji} {item}"
        
        result = subprocess.run(
            ['remindctl', 'add', '--title', full_item, '--list', 'Shopping List'],
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print(f"✓ Added: {full_item}")
            return True
        else:
            print(f"✗ Failed to add: {item} - {result.stderr}")
            return False
            
    except Exception as e:
        print(f"✗ Error adding {item}: {e}")
        return False

def recipe_to_shopping_list(recipe_text):
    """Extract ingredients from recipe text and add to shopping list"""
    print("🍳 Parsing recipe...\n")
    
    # Simple parsing - look for common ingredient patterns
    lines = recipe_text.strip().split('\n')
    ingredients = []
    
    for line in lines:
        line = line.strip()
        # Skip empty lines and section headers
        if not line or line.endswith(':'):
            continue
        # Skip instructions (lines starting with numbers or containing verbs)
        if line[0].isdigit() and ('.' in line[:3] or ')' in line[:3]):
            continue
        # Skip common non-ingredient words
        skip_words = ['instructions', 'directions', 'method', 'steps', 'prep', 'cook', 'servings', 'serves']
        if any(word in line.lower() for word in skip_words):
            continue
        
        # Clean up the line
        ingredient = line.lstrip('-•* ').strip()
        if ingredient and len(ingredient) > 2:
            ingredients.append(ingredient)
    
    if not ingredients:
        print("⚠️ No ingredients found in recipe text")
        return
    
    print(f"Found {len(ingredients)} ingredients:\n")
    
    # Add each ingredient
    added = 0
    for ingredient in ingredients:
        if add_to_shopping_list(ingredient):
            added += 1
    
    print(f"\n✅ Done! Added {added} items to your Shopping List")
    print("📱 Check your Reminders app!")

# Sample recipe for testing
SAMPLE_RECIPE = """Spaghetti Bolognese

Ingredients:
- 500g beef mince
- 1 onion, diced
- 2 cloves garlic, minced
- 800g canned tomatoes
- 2 tbsp tomato paste
- 1 tsp dried oregano
- 1 tsp dried basil
- Salt and pepper
- 400g spaghetti pasta
- Parmesan cheese
- Olive oil

Instructions:
1. Heat olive oil in a pan
2. Cook onion and garlic until soft
3. Add mince and brown
4. Add tomatoes, paste, and herbs
5. Simmer for 30 minutes
6. Cook pasta according to package
7. Serve with parmesan
"""

if __name__ == '__main__':
    if len(sys.argv) > 1:
        # Read recipe from file
        with open(sys.argv[1], 'r') as f:
            recipe = f.read()
    else:
        # Use sample recipe
        recipe = SAMPLE_RECIPE
    
    recipe_to_shopping_list(recipe)
