#!/usr/bin/env python3
"""
Generate Explainer/Educational scripts (Lore, concepts, "What is...")
Usage: python3 generate_explainer.py --topic "What are Goddesses" --series "Sentenced To Be A Hero" --output explainer.json
"""

import argparse
import json

EXPLAINER_TEMPLATES = {
    'concept': {
        'structure': ['hook', 'context', 'explanation', 'examples', 'implications', 'outro'],
        'title': 'What is {topic} in {series}?',
        'hook': 'What is {topic} in {series}? Let me explain...',
        'sections': [
            {
                'name': 'Context',
                'content': 'Where this concept appears in the story',
                'duration': 5
            },
            {
                'name': 'Definition', 
                'content': 'What it actually means/how it works',
                'duration': 8
            },
            {
                'name': 'Examples',
                'content': 'Specific instances from the series',
                'duration': 10
            },
            {
                'name': 'Why It Matters',
                'content': 'Impact on story/characters',
                'duration': 6
            }
        ],
        'outro': 'Now you know! Follow for more anime explained.'
    },
    'character_type': {
        'structure': ['hook', 'overview', 'abilities', 'notable_examples', 'outro'],
        'title': '{topic} in {series} Explained',
        'hook': '{topic} explained - what you need to know...',
        'sections': [
            {
                'name': 'Overview',
                'content': 'What makes them unique',
                'duration': 6
            },
            {
                'name': 'Abilities',
                'content': 'Powers and characteristics',
                'duration': 8
            },
            {
                'name': 'Notable Characters',
                'content': 'Famous examples from the series',
                'duration': 10
            },
            {
                'name': 'Role in Story',
                'content': 'Why they matter to the plot',
                'duration': 5
            }
        ],
        'outro': 'Which {topic} is your favorite?'
    },
    'mechanic': {
        'structure': ['hook', 'how_it_works', 'rules', 'examples', 'outro'],
        'title': 'How {topic} Works in {series}',
        'hook': 'How {topic} actually works...',
        'sections': [
            {
                'name': 'The Basics',
                'content': 'Fundamental mechanics explained simply',
                'duration': 7
            },
            {
                'name': 'Rules & Limitations',
                'content': 'What can and cannot be done',
                'duration': 8
            },
            {
                'name': 'In Action',
                'content': 'Seeing it used in the series',
                'duration': 10
            },
            {
                'name': 'Why It\'s Cool',
                'content': 'What makes this mechanic special',
                'duration': 5
            }
        ],
        'outro': 'What other mechanics should I explain?'
    }
}

def generate_explainer(topic, series, template='concept'):
    """Generate explainer script"""
    
    tmpl = EXPLAINER_TEMPLATES.get(template, EXPLAINER_TEMPLATES['concept'])
    
    script = {
        'type': 'explainer',
        'template': template,
        'title': tmpl['title'].format(topic=topic, series=series),
        'hook': tmpl['hook'].format(topic=topic, series=series),
        'topic': topic,
        'series': series,
        'sections': tmpl['sections'],
        'outro': tmpl['outro'].format(topic=topic),
        'total_duration': sum(s['duration'] for s in tmpl['sections']) + 8,
        'timing': {
            'hook_duration': 3,
            'section_duration_avg': 7,
            'outro_duration': 5
        },
        'visual_style': {
            'title_size': 60,
            'section_header_size': 50,
            'body_text_size': 40,
            'accent_color': '#A855F7',  # Purple (knowledge/mystery)
            'text_color': '#FFFFFF',
            'highlight_color': '#F59E0B'  # Amber for key terms
        },
        'effects': {
            'intro': 'fade_in_scale',
            'section_transition': 'smooth_slide',
            'key_term_highlight': 'glow_pulse',
            'image_reveal': 'wipe_in'
        }
    }
    
    return script

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate anime explainer scripts')
    parser.add_argument('--topic', required=True, help='Concept/thing to explain')
    parser.add_argument('--series', required=True, help='Anime/manga series name')
    parser.add_argument('--template', default='concept', choices=['concept', 'character_type', 'mechanic'])
    parser.add_argument('--output', default='explainer.json', help='Output file')
    
    args = parser.parse_args()
    
    script = generate_explainer(args.topic, args.series, args.template)
    
    with open(args.output, 'w') as f:
        json.dump(script, f, indent=2)
    
    print(f"✅ Explainer script created: {args.output}")
    print(f"📚 {args.topic} in {args.series}")
    print(f"⏱️  ~{script['total_duration']:.0f}s duration")
    print(f"\nSections:")
    for section in script['sections']:
        print(f"  • {section['name']} ({section['duration']}s)")