---
name: anime-tiktok-generator
description: Create viral anime TikToks and YouTube Shorts. Supports multiple formats - rankings (Top 10), VS battles (character comparisons), and explainers (lore/concepts). Use when user wants to make anime content like TheSideCharacterz channel, power scaling videos, character rankings, or educational anime content.
---

# Anime TikTok Generator

Create viral anime videos in 3 proven formats. Inspired by successful channels like TheSideCharacterz.

## 3 Video Formats

### 1. **Ranking** (Top 10)
Fast countdowns - "Top 10 Strongest", "Best Transformations"
- **Duration:** 20-45s
- **Pacing:** 1.5s per item
- **Visual:** Big numbers, quick cuts

```bash
python3 scripts/generate_ranking.py \
  --topic "strongest characters" \
  --count 10
```

### 2. **VS Battle** (Character Comparison)
Head-to-head analysis - "Yuta vs Gojo"
- **Duration:** 40-60s
- **Pacing:** 8-10s per section
- **Visual:** Split screen, blue vs red

```bash
python3 scripts/generate_vs.py \
  --char1 "Yuta" \
  --char2 "Gojo" \
  --series "JJK"
```

### 3. **Explainer** (Lore/Educational)
Teach concepts - "What Are Goddesses?"
- **Duration:** 35-45s
- **Pacing:** 5-10s per section
- **Visual:** Section headers, smooth transitions

```bash
python3 scripts/generate_explainer.py \
  --topic "Goddesses" \
  --series "Sentenced To Be A Hero" \
  --template character_type
```

## Format Comparison

| Format | Use Case | Duration | Items | Style |
|--------|----------|----------|-------|-------|
| **Ranking** | Lists, countdowns | 20-45s | 10-20 | Fast, energetic |
| **VS Battle** | Debates, analysis | 40-60s | 2 | Analytical |
| **Explainer** | Lore, concepts | 35-45s | 1 topic | Educational |

## Examples

### TheSideCharacterz Style (Explainer)
```bash
# "What Are Goddesses In Sentenced To Be A Hero?"
python3 scripts/generate_explainer.py \
  --topic "Goddesses" \
  --series "Sentenced To Be A Hero" \
  --template character_type

# Output sections:
# - Overview (6s)
# - Abilities (8s)
# - Notable Characters (10s)
# - Role in Story (5s)
```

### VS Battle Style
```bash
# "Yuta vs Gojo - Who Wins?"
python3 scripts/generate_vs.py \
  --char1 "Yuta" \
  --char2 "Gojo" \
  --series "Jujutsu Kaisen"

# Output sections:
# - Physical Stats (8s)
# - Abilities (10s)
# - Feats (8s)
# - The Verdict (6s)
```

### Ranking Style
```bash
# "Top 10 Strongest Anime Characters"
python3 scripts/generate_ranking.py \
  --topic "strongest characters" \
  --count 10

# Output: 10 items, 1.5s each, countdown format
```

## Next Steps

1. **Generate a script** using one of the formats above
2. **Collect media** (images/clips for your topic)
3. **Create video** (video generation scripts coming soon)

See [REFERENCES.md](references/REFERENCES.md) for detailed documentation.