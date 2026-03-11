# Sticky Features Section Template

A reusable template for creating sticky scroll feature sections with dark theme, smooth animations, and responsive behavior.

## Features

- ✅ **Sticky Scroll Animation**: Items change based on scroll position in desktop view
- ✅ **Dark Theme**: Pre-configured with dark background (#0A0B0C) and white text
- ✅ **Responsive Design**: Different behavior for mobile/tablet vs desktop
- ✅ **Smooth Image Transitions**: Images fade in/out when switching items
- ✅ **Click to Navigate**: Mobile/tablet users can click items to navigate
- ✅ **No Dependencies**: Uses the same standalone JavaScript as products section
- ✅ **Fully Configurable**: Easy to customize for different pages

## Files Included

1. **`templates/sticky-features-section.html`** - HTML template with dark theme
2. **`js/sticky-products-section-standalone.js`** - Standalone JavaScript (shared with products section)
3. **`templates/README-sticky-features-section.md`** - This documentation

## Required CSS

Make sure you have `css/ser-products.css` included in your page, or include the necessary styles.

## Quick Start

### Step 1: Copy the HTML Template

Copy the entire `<section>` from `templates/sticky-features-section.html` and paste it into your HTML file where you want the section to appear.

### Step 2: Customize the Content

Update the following in the HTML:

- **Section class**: Change `.ser-features-section` if needed (or keep it)
- **Image ID**: Change `id="features-image"` to a unique ID if you have multiple sections
- **Tagline**: Update the `<p class="ser-tagline">` text
- **Title**: Update the `<h2 class="ser-section-title">` text
- **Description**: Update the description paragraph
- **Items**: Update each `.products-item` with your content:
  - `data-product`: Unique identifier
  - `data-image`: Path to the image for this item
  - Title and description text
  - Button text/actions

### Step 3: Include the JavaScript

Add this before the closing `</body>` tag:

```html
<script src="js/sticky-products-section-standalone.js" defer></script>
```

### Step 4: Initialize the Section

Add this script block (also before `</body>`):

```html
<script>
  (function() {
    function initFeaturesSection() {
      if (typeof window.initStickyProductsSection === 'function') {
        try {
          window.initStickyProductsSection({
            sectionSelector: '.ser-features-section', // Change if using different class
            imageId: 'features-image', // Change to match your image ID
            imagePaths: [
              'images/services/your-image-1.png',
              'images/services/your-image-2.png',
              'images/services/your-image-3.png'
            ]
          });
          console.log('✅ Features section initialized');
        } catch (error) {
          console.error('❌ Error initializing features section:', error);
        }
      } else {
        console.warn('⚠️ initStickyProductsSection not available yet, retrying...');
        setTimeout(initFeaturesSection, 200);
      }
    }
    
    // Try to initialize when page loads
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(initFeaturesSection, 300);
    } else {
      window.addEventListener('load', function() {
        setTimeout(initFeaturesSection, 300);
      });
    }
  })();
</script>
```

### Step 5: Update Configuration

In the initialization script, update:

- **`sectionSelector`**: CSS selector for your section (e.g., `.ser-features-section`, `#my-section`)
- **`imageId`**: The ID of the `<img>` element that displays the images
- **`imagePaths`**: Array of image paths, one for each item (in order)

## Configuration Options

### `sectionSelector` (required)
CSS selector for the section element. Examples:
- `.ser-features-section`
- `#my-features-section`
- `.my-custom-section`

### `imageId` (required)
The ID attribute of the `<img>` element that will display the images. Must match the `id` in your HTML.

### `imagePaths` (optional)
Array of image paths. If not provided, the script will try to extract paths from `data-image` attributes on each `.products-item`.

Example:
```javascript
imagePaths: [
  'images/services/item-1.png',
  'images/services/item-2.png',
  'images/services/item-3.png'
]
```

## Multiple Sections on One Page

If you need multiple sticky sections on the same page (e.g., both products and features):

1. **Use unique classes/IDs**: Give each section a unique class or ID
2. **Use unique image IDs**: Each section needs its own image element with a unique ID
3. **Initialize each separately**: Call `initStickyProductsSection` once for each section

Example:

```html
<!-- Products Section (Light Theme) -->
<section class="ser-products-section" id="section-1">
  <!-- ... -->
  <img id="products-image-1" src="..." alt="...">
</section>

<!-- Features Section (Dark Theme) -->
<section class="ser-features-section" id="section-2">
  <!-- ... -->
  <img id="features-image-1" src="..." alt="...">
</section>

<script>
  // Initialize products section
  window.initStickyProductsSection({
    sectionSelector: '#section-1',
    imageId: 'products-image-1',
    imagePaths: [...]
  });
  
  // Initialize features section
  window.initStickyProductsSection({
    sectionSelector: '#section-2',
    imageId: 'features-image-1',
    imagePaths: [...]
  });
</script>
```

## Theme Differences

### Products Section (Light Theme)
- Background: `#FFFFFF` (white)
- Text: `#0A0B0C` (dark)
- Use class: `.ser-products-section`

### Features Section (Dark Theme)
- Background: `#0A0B0C` (dark)
- Text: `#FFFFFF` (white)
- Use class: `.ser-features-section`

Both use the same JavaScript and CSS, only the styling differs.

## Behavior

### Desktop (≥1024px width)
- Items are hidden/shown based on scroll position
- Only the active item shows its description and button
- Images transition smoothly when items change
- Sticky scroll: content sticks to top while scrolling through items

### Mobile/Tablet (<1024px width)
- All items are visible
- Users can click items to navigate
- Images update when items are clicked
- No sticky scroll behavior

## Troubleshooting

### Section not initializing
- Check browser console for error messages
- Verify `sectionSelector` matches your HTML
- Verify `imageId` matches the image element's ID
- Make sure the script is loaded before initialization

### Images not changing
- Verify `imagePaths` array has the correct number of items
- Check that image paths are correct and files exist
- Verify `imageId` matches the image element

### Sticky scroll not working
- Only works on desktop (≥1024px width)
- Make sure you have enough content to scroll
- Check browser console for any errors

## Example Usage

See `templates/sticky-features-section.html` for a complete example with comments.

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify all required elements exist in the HTML
3. Ensure CSS file (`ser-products.css`) is included
4. Verify image paths are correct

