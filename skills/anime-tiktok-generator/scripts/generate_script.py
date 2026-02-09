#!/usr/bin/env python3
"""
Generate anime TikTok scripts using AI
Usage: python3 generate_script.py --topic "Top 5 anime fights" --style listicle --output script.json
"""

import argparse
import json
import os

# Template scripts for different formats
TEMPLATES = {
    'listicle': {
        'structure': ['hook', 'countdown', 'items', 'outro'],
        'duration': 45,
        'items': 5
    },
    'ranking': {
        'structure': ['hook', 'countup', 'items', 'controversy', 'outro'],
        'duration': 60,
        'items': 5
    },
    'commentary': {
        'structure': ['hook', 'context', 'opinion', 'evidence', 'outro'],
        'duration': 45,
        'items': 1
    },
    'recommendation': {
        'structure': ['hook', 'criteria', 'recommendations', 'outro'],
        'duration': 45,
        'items': 3
    }
}

HOOK_TEMPLATES = [
    "Stop scrolling if you love {topic}...",
    "These {count} {topic} broke the internet",
    "POV: You just discovered {topic}",
    "Nobody talks about {topic} but...",
    "If you haven't seen {topic}, we can't be friends",
    "Ranking {topic} from worst to best",
    "The {topic} that changed everything",
    "Underrated {topic} that deserve more love"
]

OUTRO_TEMPLATES = [
    "Which one is your favorite? Comment below!",
    "Did I miss any? Let me know!",
    "Follow for more anime content!",
    "Part 2? 👀",
    "Agree or disagree? Drop a comment!",
    "Tag someone who needs to see this!"
]

def generate_hook(topic, style):
    """Generate attention-grabbing hook"""
    import random
    template = random.choice(HOOK_TEMPLATES)
    return template.format(topic=topic, count=5)

def generate_outro():
    """Generate call-to-action outro"""
    import random
    return random.choice(OUTRO_TEMPLATES)

def generate_listicle_script(topic):
    """Generate a listicle-style script"""
    items = [
        {
            'rank': 5,
            'title': f'The one that started it all',
            'description': f'You know this one had to be on the list. The original that set the standard for everything that came after.',
            'duration': 8
        },
        {
            'rank': 4,
            'title': f'The emotional one',
            'description': f'This hit different. The animation, the music, the stakes. Everything peaked right here.',
            'duration': 8
        },
        {
            'rank': 3,
            'title': f'The fan favorite',
            'description': f'Ask any fan and they will bring this up immediately. Iconic is an understatement.',
            'duration': 8
        },
        {
            'rank': 2,
            'title': f'The controversial pick',
            'description': f'I know some of you will disagree, but you cannot deny the impact this had on the community.',
            'duration': 8
        },
        {
            'rank': 1,
            'title': f'The GOAT',
            'description': f'Number one and it is not even close. This is what perfection looks like.',
            'duration': 10
        }
    ]
    
    return {
        'type': 'listicle',
        'title': f'Top 5 {topic}',
        'hook': generate_hook(topic, 'listicle'),
        'items': items,
        'outro': generate_outro(),
        'total_duration': 45,
        'captions_style': {
            'font': 'bold',
            'color': 'white',
            'stroke': 'black',
            'animation': 'pop-in'
        }
    }

def generate_commentary_script(topic):
    """Generate a commentary/opinion script"""
    return {
        'type': 'commentary',
        'topic': topic,
        'hook': f'Unpopular opinion about {topic}...',
        'points': [
            'Let me explain why I think this way',
            'The evidence is right there if you look',
            'Most fans miss this crucial detail',
            'It all makes sense when you connect the dots'
        ],
        'opinion': f'At the end of the day, {topic} is more complex than people give it credit for.',
        'outro': generate_outro(),
        'total_duration': 45,
        'captions_style': {
            'font': 'bold',
            'color': 'yellow',
            'stroke': 'black',
            'animation': 'typewriter'
        }
    }

def generate_recommendation_script(topic):
    """Generate recommendation script"""
    return {
        'type': 'recommendation',
        'title': f'If you love {topic}, watch these',
        'hook': f'Loved {topic}? Here are 3 anime that hit the same',
        'criteria': 'Similar vibes, animation quality, and emotional impact',
        'recommendations': [
            {'title': 'Recommendation 1', 'why': 'Same energy, different story', 'duration': 12},
            {'title': 'Recommendation 2', 'why': 'Fans of the original love this one', 'duration': 12},
            {'title': 'Recommendation 3', 'why': 'The hidden gem you missed', 'duration': 12}
        ],
        'outro': generate_outro(),
        'total_duration': 45,
        'captions_style': {
            'font': 'bold',
            'color': 'cyan',
            'stroke': 'black',
            'animation': 'slide-up'
        }
    }

def generate_script(topic, style='listicle', template_file=None):
    """Generate complete script"""
    
    if template_file and os.path.exists(template_file):
        with open(template_file, 'r') as f:
            template = json.load(f)
        print(f"📋 Using template: {template_file}")
    
    print(f"📝 Generating {style} script about: {topic}")
    
    if style == 'listicle':
        script = generate_listicle_script(topic)
    elif style == 'ranking':
        script = generate_listicle_script(topic)  # Similar structure
    elif style == 'commentary':
        script = generate_commentary_script(topic)
    elif style == 'recommendation':
        script = generate_recommendation_script(topic)
    else:
        script = generate_listicle_script(topic)
    
    return script

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Generate anime TikTok scripts')
    parser.add_argument('--topic', required=True, help='Topic for the video')
    parser.add_argument('--style', default='listicle', choices=['listicle', 'ranking', 'commentary', 'recommendation'])
    parser.add_argument('--template', help='Path to style template JSON')
    parser.add_argument('--output', default='script.json', help='Output file path')
    
    args = parser.parse_args()
    
    script = generate_script(args.topic, args.style, args.template)
    
    with open(args.output, 'w') as f:
        json.dump(script, f, indent=2)
    
    print(f"✅ Script saved to {args.output}")
    print(f"📊 Duration: {script['total_duration']}s")
    print(f"🎬 Style: {script['type']}")