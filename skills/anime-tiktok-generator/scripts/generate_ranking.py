#!/usr/bin/env python3
"""
Generate anime ranking scripts (Top 10 style)
Usage: python3 generate_ranking.py --topic "strongest characters" --count 10 --output ranking.json
"""

import argparse
import json
import random

RANKING_TEMPLATES = {
    'strongest': {
        'title': 'Top {count} Strongest Anime Characters',
        'hook': 'Top {count} strongest anime characters of all time...',
        'items': [
            {'rank': 10, 'name': '[Character]', 'anime': '[Series]', 'why': 'The baseline of power'},
            {'rank': 9, 'name': '[Character]', 'anime': '[Series]', 'why': 'Way stronger than expected'},
            {'rank': 8, 'name': '[Character]', 'anime': '[Series]', 'why': 'Destructive capability'},
            {'rank': 7, 'name': '[Character]', 'anime': '[Series]', 'why': 'Speed and power combined'},
            {'rank': 6, 'name': '[Character]', 'anime': '[Series]', 'why': 'Reality warper'},
            {'rank': 5, 'name': '[Character]', 'anime': '[Series]', 'why': 'Casual planet buster'},
            {'rank': 4, 'name': '[Character]', 'anime': '[Series]', 'why': 'Multiverse threat'},
            {'rank': 3, 'name': '[Character]', 'anime': '[Series]', 'why': 'Conceptual manipulation'},
            {'rank': 2, 'name': '[Character]', 'anime': '[Series]', 'why': 'Near omnipotent'},
            {'rank': 1, 'name': '[Character]', 'anime': '[Series]', 'why': 'The GOAT'},
        ],
        'outro': 'Agree with this list? Comment your top 3!'
    },
    'transformations': {
        'title': 'Top {count} Anime Transformations',
        'hook': 'These transformations hit different...',
        'items': [
            {'rank': 10, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'The buildup was insane'},
            {'rank': 9, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'First time we saw true power'},
            {'rank': 8, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'Design is peak'},
            {'rank': 7, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'Emotional weight'},
            {'rank': 6, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'That entrance though'},
            {'rank': 5, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'Changed the series'},
            {'rank': 4, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'Goosebumps every time'},
            {'rank': 3, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'The animation quality'},
            {'rank': 2, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'Iconic moment'},
            {'rank': 1, 'name': '[Form Name]', 'anime': '[Series]', 'why': 'Best in anime history'},
        ],
        'outro': 'Which transformation is YOUR favorite?'
    },
    'underrated': {
        'title': 'Top {count} Underrated Anime You Missed',
        'hook': 'You haven\'t seen these gems...',
        'items': [
            {'rank': 10, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Hidden masterpiece'},
            {'rank': 9, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Criminally overlooked'},
            {'rank': 8, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Better than mainstream'},
            {'rank': 7, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Story is incredible'},
            {'rank': 6, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Animation is gorgeous'},
            {'rank': 5, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Character development'},
            {'rank': 4, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Plot twists hit hard'},
            {'rank': 3, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Soundtrack alone'},
            {'rank': 2, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Deserves more fans'},
            {'rank': 1, 'name': '[Anime Title]', 'genre': '[Genre]', 'why': 'Perfect from start to finish'},
        ],
        'outro': 'How many have you watched?'
    }
}

def generate_ranking(topic, count=10, style='strongest'):
    """Generate a ranking script"""
    
    template = RANKING_TEMPLATES.get(style, RANKING_TEMPLATES['strongest'])
    
    # Adjust item count
    items = template['items'][:count]
    items.reverse()  # Go from count down to 1
    
    for i, item in enumerate(items, 1):
        item['rank'] = count - i + 1
    
    script = {
        'type': 'ranking',
        'style': style,
        'title': template['title'].format(count=count),
        'topic': topic,
        'hook': template['hook'].format(count=count),
        'items': items,
        'outro': template['outro'],
        'total_duration': count * 1.5 + 5,  # 1.5s per item + buffer
        'timing': {
            'hook_duration': 2,
            'time_per_item': 1.5,
            'dramatic_pause': 3,
            'outro_duration': 3
        },
        'visual_style': {
            'number_size': 200,
            'name_size': 60,
            'anime_size': 40,
            'number_color': '#FFD700',  # Gold
            'name_color': '#FFFFFF',
            'bg_style': 'dark_gradient'
        },
        'effects': {
            'transition': 'quick_cut',
            'number_animation': 'pop_in',
            'final_reveal': 'zoom_shake'
        }
    }
    
    return script

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate anime ranking scripts')
    parser.add_argument('--topic', required=True, help='Ranking topic')
    parser.add_argument('--count', type=int, default=10, help='Number of items (5-20)')
    parser.add_argument('--style', default='strongest', choices=['strongest', 'transformations', 'underrated'])
    parser.add_argument('--output', default='ranking.json', help='Output file')
    
    args = parser.parse_args()
    
    script = generate_ranking(args.topic, args.count, args.style)
    
    with open(args.output, 'w') as f:
        json.dump(script, f, indent=2)
    
    print(f"✅ Ranking script created: {args.output}")
    print(f"📊 {args.count} items, ~{script['total_duration']:.0f}s duration")
    print(f"🎬 Style: {args.style}")