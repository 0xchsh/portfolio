#!/bin/bash
set -e
BASE="/Users/carloshin/Projects/chsh/portfolio/public/work"

# Create all img/ and webp/ subdirectories
for dir in archive "art/opepen" "art/rgb-friends" "art/rgb" "art/zorps" by-computer clawpanel freighter lab misc otto snack; do
  mkdir -p "$BASE/$dir/img" "$BASE/$dir/webp"
done

# ── archive ──────────────────────────────────────────────
mv "$BASE/archive/"*.webp "$BASE/archive/webp/" 2>/dev/null || true
mv "$BASE/archive/"*.webm "$BASE/archive/webp/" 2>/dev/null || true
mv "$BASE/archive/"*.png  "$BASE/archive/img/"  2>/dev/null || true
mv "$BASE/archive/"*.mp4  "$BASE/archive/img/"  2>/dev/null || true
mv "$BASE/archive/"*.mov  "$BASE/archive/img/"  2>/dev/null || true

# ── art/rgb ───────────────────────────────────────────────
mv "$BASE/art/rgb/"*.webp "$BASE/art/rgb/webp/" 2>/dev/null || true
mv "$BASE/art/rgb/"*.png  "$BASE/art/rgb/img/"  2>/dev/null || true
mv "$BASE/art/rgb/"*.gif  "$BASE/art/rgb/img/"  2>/dev/null || true

# ── art/rgb-friends ───────────────────────────────────────
mv "$BASE/art/rgb-friends/"*.webp "$BASE/art/rgb-friends/webp/" 2>/dev/null || true
mv "$BASE/art/rgb-friends/"*.png  "$BASE/art/rgb-friends/img/"  2>/dev/null || true
mv "$BASE/art/rgb-friends/"*.gif  "$BASE/art/rgb-friends/img/"  2>/dev/null || true

# ── art/opepen ────────────────────────────────────────────
mv "$BASE/art/opepen/"*.webp  "$BASE/art/opepen/webp/" 2>/dev/null || true
mv "$BASE/art/opepen/"*.jpeg  "$BASE/art/opepen/img/"  2>/dev/null || true
mv "$BASE/art/opepen/"*.gif   "$BASE/art/opepen/img/"  2>/dev/null || true

# ── art/zorps ─────────────────────────────────────────────
mv "$BASE/art/zorps/"*.webp "$BASE/art/zorps/webp/" 2>/dev/null || true
mv "$BASE/art/zorps/"*.png  "$BASE/art/zorps/img/"  2>/dev/null || true
mv "$BASE/art/zorps/"*.jpg  "$BASE/art/zorps/img/"  2>/dev/null || true

# ── by-computer ───────────────────────────────────────────
mv "$BASE/by-computer/"*.webp "$BASE/by-computer/webp/" 2>/dev/null || true
mv "$BASE/by-computer/"*.webm "$BASE/by-computer/webp/" 2>/dev/null || true

# ── clawpanel ─────────────────────────────────────────────
mv "$BASE/clawpanel/"*.webp "$BASE/clawpanel/webp/" 2>/dev/null || true
mv "$BASE/clawpanel/"*.png  "$BASE/clawpanel/img/"  2>/dev/null || true

# ── freighter ─────────────────────────────────────────────
mv "$BASE/freighter/"*.webp "$BASE/freighter/webp/" 2>/dev/null || true
mv "$BASE/freighter/"*.mp4  "$BASE/freighter/img/"  2>/dev/null || true
mv "$BASE/freighter/"*.png  "$BASE/freighter/img/"  2>/dev/null || true

# ── lab ───────────────────────────────────────────────────
mv "$BASE/lab/"*.webp "$BASE/lab/webp/" 2>/dev/null || true
mv "$BASE/lab/"*.mp4  "$BASE/lab/img/"  2>/dev/null || true

# ── misc ──────────────────────────────────────────────────
mv "$BASE/misc/"*.webp "$BASE/misc/webp/" 2>/dev/null || true
mv "$BASE/misc/"*.png  "$BASE/misc/img/"  2>/dev/null || true
mv "$BASE/misc/"*.mp4  "$BASE/misc/img/"  2>/dev/null || true

# ── otto ──────────────────────────────────────────────────
mv "$BASE/otto/"*.png "$BASE/otto/img/" 2>/dev/null || true

# ── snack ─────────────────────────────────────────────────
mv "$BASE/snack/"*.webp "$BASE/snack/webp/" 2>/dev/null || true
mv "$BASE/snack/"*.png  "$BASE/snack/img/"  2>/dev/null || true
mv "$BASE/snack/"*.mp4  "$BASE/snack/img/"  2>/dev/null || true

echo "✓ All files moved"
