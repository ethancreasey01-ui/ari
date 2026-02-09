#!/usr/bin/env python3
"""
Generate VS Battle scripts (Character A vs Character B)
Usage: python3 generate_vs.py --char1 "Yuta" --char2 "Gojo" --series "JJK" --output vs.json
"""

import argparse
import json

VS_TEMPLATES = {
    'standard': {
        'title': '{char1} vs {char2} - Who Wins?',
        'hook': '{char1} vs {char2}... Here\'s who actually wins',
        'sections': [
            {
                'name': 'Physical Stats',
                'char1_point': 'Speed and strength comparison',
                'char2_point': 'Durability and stamina check',
                'duration': 8
            },
            {
                'name': 'Abilities',
                'char1_point': 'Signature technique breakdown',
                'char2_point': 'Counters and counters to counters',
                'duration': 10
            },
            {
                'name': 'Feats',
                'char1_point': 'Best showing in the series',
                'char2_point': 'Scaling from other characters',
                'duration': 8
            },
            {
                'name': 'The Verdict',
                'winner_logic': 'Who takes it and why',
                'duration': 6
            }
        ],
        'outro': 'Agree or disagree? Drop your take in the comments!'
    }
}

def generate_vs(char1, char2, series, template='standard'):
    """Generate VS battle script"""
    
    tmpl = VS_TEMPLATES[template]
    
    script = {
        'type': 'vs_battle',
        'template': template,
        'title': tmpl['title'].format(char1=char1, char2=char2),
        'hook': tmpl['hook'].format(char1=char1, char2=char2),
        'characters': {
            'char1': {'name': char1, 'series': series},
            'char2': {'name': char2, 'series': series}
        },
        'sections': tmpl['sections'],
        'outro': tmpl['outro'],
        'total_duration': sum(s['duration'] for s in tmpl['sections']) + 8,  # + hook/outro
        'timing': {
            'hook_duration': 3,
            'section_duration_avg': 8,
            'outro_duration': 5
        },
        'visual_style': {
            'name_size': 80,
            'section_title_size': 50,
            'point_size': 40,
            'char1_color': '#3B82F6',  # Blue
            'char2_color': '#EF4444',  # Red
            'neutral_color': '#FFFFFF',
            'vs_text': 'VS',
            'vs_size': 120,
            'vs_color': '#FFD700'  # Gold
        },
        'effects': {
            'intro': 'split_screen_reveal',
            'section_transition': 'slide_swap',
            'verdict': 'dramatic_zoom',
            'winner_highlight': 'glow_effect'
        }
    }
    
    return script

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate VS battle scripts')
    parser.add_argument('--char1', '--character1', required=True, help='First character')
    parser.add_argument('--char2', '--character2', required=True, help='Second character')
    parser.add_argument('--series', '--universe', required=True, help='Anime/manga series')
    parser.add_argument('--template', default='standard', choices=['standard'])
    parser.add_argument('--output', default='vs.json', help='Output file')
    
    args = parser.parse_args()
    
    script = generate_vs(args.char1, args.char2, args.series, args.template)
    
    with open(args.output, 'w') as f:
        json.dump(script, f, indent=2)
    
    print(f"✅ VS Battle script created: {args.output}")
    print(f"⚔️  {args.char1} vs {args.char2}")
    print(f"⏱️  ~{script['total_duration']:.0f}s duration")
    print(f"\nSections:")
    for section in script['sections']:
        print(f"  • {section['name']} ({section['duration']}s)")