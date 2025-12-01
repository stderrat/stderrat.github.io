#!/bin/bash
# Build script to concatenate all modular CSS into one file

OUTPUT="theme-yaub-modular-compiled.css"

echo "/* YAUB Theme - Compiled Modular CSS */" > "$OUTPUT"
echo "/* Auto-generated - Do not edit directly! */" >> "$OUTPUT"
echo "/* Edit files in modular/ directory instead */" >> "$OUTPUT"
echo "" >> "$OUTPUT"

# Concatenate in the correct order
cat modular/base/variables.css >> "$OUTPUT"
cat modular/base/reset.css >> "$OUTPUT"
cat modular/base/typography.css >> "$OUTPUT"
cat modular/layout.css >> "$OUTPUT"
cat modular/components/sidebar.css >> "$OUTPUT"
cat modular/components/buttons.css >> "$OUTPUT"
cat modular/components/toc.css >> "$OUTPUT"
cat modular/components/tags.css >> "$OUTPUT"
cat modular/components/code.css >> "$OUTPUT"
cat modular/components/notices.css >> "$OUTPUT"
cat modular/components/animations.css >> "$OUTPUT"
cat modular/utilities.css >> "$OUTPUT"
cat modular/responsive.css >> "$OUTPUT"

echo ""
echo "✅ Built: $OUTPUT"
ls -lh "$OUTPUT"
