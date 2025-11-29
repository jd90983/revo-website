# Templates Directory

This directory contains reusable HTML templates that can be loaded dynamically across multiple pages.

## How It Works

Templates are loaded using JavaScript's `fetch()` API and inserted into designated containers on the page. This allows you to maintain a single source of truth for shared components.

## Usage

### 1. Create a Template File

Create an HTML file in the `templates/` directory with your component markup.

Example: `templates/get-started-section.html`

### 2. Add Container to HTML

In your HTML file, add a container where the template will be loaded:

```html
<div id="get-started-template-container"></div>
```

### 3. Load the Template

Add the template loader script before closing `</body>`:

```html
<script src="js/template-loader.js"></script>
<script>
  document.addEventListener('DOMContentLoaded', function() {
    loadTemplate('templates/get-started-section.html', '#get-started-template-container');
  });
</script>
```

### 4. Include Shared CSS

Make sure to include the shared components CSS in your HTML:

```html
<link rel="stylesheet" href="css/shared-components.css">
```

## Available Templates

### get-started-section.html
The "How to Get Started" section with 4 steps timeline. Used in:
- `ser.html`
- `industry_locksmith.html`

## Modifying Templates

When you modify a template file, the changes will automatically appear on all pages that use it, as long as:
1. The pages are served through a web server (not opened directly as files)
2. The browser cache is cleared or hard refresh is used (Ctrl+F5 / Cmd+Shift+R)

## Important Notes

- **Server Required**: Templates use `fetch()` which requires a web server. Opening HTML files directly won't work due to CORS restrictions.
- **Local Development**: Use a local server like:
  - `python -m http.server 8000`
  - `npx serve`
  - VS Code Live Server extension
- **Animations**: Templates automatically initialize scroll animations when loaded.

## Adding New Templates

1. Create the HTML file in `templates/`
2. Add corresponding CSS to `css/shared-components.css`
3. Use `loadTemplate()` function to load it in your pages

