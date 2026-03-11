#!/bin/bash

# Run this from your project root:
# cd "/Volumes/Mac extern/Desktop Mac/revo-website"
# bash update-images.sh

PROJECT="/Volumes/Mac extern/Desktop Mac/revo-website"
cd "$PROJECT"

echo "🔍 Finding all HTML files..."
HTML_FILES=$(find . -name "*.html" ! -name "._*" ! -path "./.git/*")
COUNT=$(echo "$HTML_FILES" | wc -l | tr -d ' ')
echo "Found $COUNT HTML files"
echo ""

echo "🔄 Updating PNG → WebP references..."

for file in $HTML_FILES; do
  # Skip if not a regular file
  [ -f "$file" ] || continue

  # Count PNG references before
  BEFORE=$(grep -c '\.png' "$file" 2>/dev/null || echo 0)

  # Replace all image PNG references (not icon SVGs, just actual .png files)
  sed -i '' \
    -e 's|images/logo\.png|images/logo.webp|g' \
    -e 's|images/avatars/Avatars\.png|images/avatars/Avatars.webp|g' \
    -e 's|images/avatars/Sarah Lopez\.png|images/avatars/Sarah Lopez.webp|g' \
    -e 's|images/avatars/Melissa Turner\.png|images/avatars/Melissa Turner.webp|g' \
    -e 's|images/avatars/Daniel Reyes\.png|images/avatars/Daniel Reyes.webp|g' \
    -e 's|images/avatars/Carlos Mendoza\.png|images/avatars/Carlos Mendoza.webp|g' \
    -e 's|images/avatars/David Brooks\.png|images/avatars/David Brooks.webp|g' \
    -e 's|images/avatars/Emily Carter\.png|images/avatars/Emily Carter.webp|g' \
    -e 's|images/avatars/Jessica Lee\.png|images/avatars/Jessica Lee.webp|g' \
    -e 's|images/avatars/Laura Bennett\.png|images/avatars/Laura Bennett.webp|g' \
    -e 's|images/avatars/Mark Thompson\.png|images/avatars/Mark Thompson.webp|g' \
    -e 's|images/avatars/Michael Thompson\.png|images/avatars/Michael Thompson.webp|g' \
    -e 's|images/avatars/Daniel_Reyes\.png|images/avatars/Daniel_Reyes.webp|g' \
    -e 's|images/Gradients\.png|images/Gradients.webp|g' \
    -e 's|images/backgrounds/form_image\.png|images/backgrounds/form_image.webp|g' \
    -e 's|images/25\.png|images/25.webp|g' \
    -e 's|images/banner-hero-closing\.png|images/banner-hero-closing.webp|g' \
    -e 's|images/15\.png|images/15.webp|g' \
    -e 's|images/11-1@2x\.png|images/11-1@2x.webp|g' \
    -e 's|images/teal-wave-gradient\.png|images/teal-wave-gradient.webp|g' \
    -e 's|images/dashboard-mockup-enterprise\.png|images/dashboard-mockup-enterprise.webp|g' \
    -e 's|images/phone-mockup-features\.png|images/phone-mockup-features.webp|g' \
    -e 's|images/maskgroup\.png|images/maskgroup.webp|g' \
    -e 's|images/element_decoration\.png|images/element_decoration.webp|g' \
    -e 's|images/revo_dashboard_3D_isometric\.png|images/revo_dashboard_3D_isometric.webp|g' \
    -e 's|images/Placeholder Image\.png|images/Placeholder Image.webp|g' \
    -e 's|images/dots_1\.png|images/dots_1.webp|g' \
    -e 's|images/webflow-logo\.png|images/webflow-logo.webp|g' \
    -e 's|images/05\.png|images/05.webp|g' \
    -e 's|images/line\.png|images/line.webp|g' \
    -e 's|Hear a Sample Call/|hear-a-sample-call/|g' \
    -e 's|hear-a-sample-call/sample-home-services_pros_2\.png|hear-a-sample-call/sample-home-services_pros_2.webp|g' \
    -e 's|hear-a-sample-call/Cybersecurity Pros\.png|hear-a-sample-call/Cybersecurity Pros.webp|g' \
    -e 's|hear-a-sample-call/Legal Services Pros\.png|hear-a-sample-call/Legal Services Pros.webp|g' \
    -e 's|hear-a-sample-call/Locksmith Pros\.png|hear-a-sample-call/Locksmith Pros.webp|g' \
    -e 's|hear-a-sample-call/Plumbing Pros\.png|hear-a-sample-call/Plumbing Pros.webp|g' \
    -e 's|hear-a-sample-call/revo_profile\.png|hear-a-sample-call/revo_profile.webp|g' \
    "$file"

  AFTER=$(grep -c '\.png' "$file" 2>/dev/null || echo 0)

  if [ "$BEFORE" != "$AFTER" ]; then
    echo "  ✅ Updated: $file"
  fi
done

echo ""
echo "🚀 Adding defer to scripts in _index.html..."
if [ -f "_index.html" ]; then
  sed -i '' \
    -e 's|<script src="js/navigation.js"></script>|<script src="js/navigation.js" defer></script>|g' \
    -e 's|<script src="js/accordion.js"></script>|<script src="js/accordion.js" defer></script>|g' \
    -e 's|<script src="js/animations.js"></script>|<script src="js/animations.js" defer></script>|g' \
    "_index.html"
  echo "  ✅ defer added to scripts"
fi

echo ""
echo "📁 Renaming 'Hear a Sample Call' folder..."
if [ -d "images/Hear a Sample Call" ]; then
  # Convert PNGs in that folder first
  cd "images/Hear a Sample Call"
  for f in *.png; do
    [ -f "$f" ] || continue
    cwebp -q 85 "$f" -o "${f%.png}.webp" 2>/dev/null
    echo "  ✅ Converted: $f"
  done
  cd "$PROJECT"
  mv "images/Hear a Sample Call" "images/hear-a-sample-call"
  echo "  ✅ Renamed folder"
else
  echo "  ℹ️  Folder already renamed or not found"
fi

echo ""
echo "✅ All done! Refresh localhost:3000 to verify."
