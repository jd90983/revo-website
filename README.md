# Revo - AI Receptionist Landing Page

A high-performance landing page for Revo, an AI-powered virtual receptionist service. Built with pure HTML, CSS, and vanilla JavaScript - **NO frameworks or libraries**.

## Features

- **Fast Loading Times** - Optimized for performance (<2s load time)
- **Fully Responsive** - Mobile-first design that works on all devices
- **Accessibility Compliant** - WCAG 2.1 AA standards with keyboard navigation
- **SEO Optimized** - Proper meta tags and semantic HTML
- **Smooth Animations** - Intersection Observer API for scroll animations
- **Interactive Elements** - Mobile menu, FAQ accordion, form validation

## Tech Stack

- HTML5 - Semantic markup
- CSS3 - Modern CSS (Grid, Flexbox, Custom Properties)
- Vanilla JavaScript - No dependencies
- Google Fonts - Inter & Lexend Deca

## Project Structure

```
/revo-website
├── index.html              # Main HTML file
├── /css
│   ├── variables.css       # Design system tokens
│   ├── reset.css          # CSS reset
│   ├── base.css           # Base styles & typography
│   ├── components.css     # Reusable components
│   ├── layout.css         # Section layouts
│   └── responsive.css     # Media queries
├── /js
│   ├── navigation.js      # Mobile menu & smooth scroll
│   ├── accordion.js       # FAQ functionality
│   ├── animations.js      # Scroll animations
│   └── main.js           # Form validation & utilities
├── /images
│   ├── logo.png          # Revo logo
│   ├── hero-bg.jpg       # Hero background
│   └── /avatars          # User avatar images
└── README.md
```

## Getting Started

### Option 1: Direct Browser Opening
Simply open `index.html` in your web browser.

### Option 2: Local Server (Recommended)

Using Python:
```bash
python -m http.server 8000
```

Using Node.js:
```bash
npx serve
```

Then visit: `http://localhost:8000`

## Sections

1. **Navigation** - Sticky navbar with mobile menu
2. **Hero** - Full viewport hero with CTA buttons
3. **Features** - "Why Choose Us" section with feature cards
4. **How It Works** - 3-step process explanation
5. **Stats** - Key performance metrics
6. **Power CTA** - Call-to-action section
7. **Testimonials** - Customer success stories
8. **FAQ** - Expandable accordion questions
9. **Footer** - Newsletter signup & links

## Design System

### Colors
- Primary Blue: `#0f5ad7`
- Dark Background: `#222324`
- Black: `#000000`
- White: `#ffffff`
- Gray Light: `#b3b3b3`

### Typography
- Headings: Inter (Bold, 700)
- Body: Lexend Deca (Regular, 400; Medium, 500)

### Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1023px`
- Desktop: `≥ 1024px`
- Large Desktop: `≥ 1440px`

## JavaScript Features

- **Mobile Menu Toggle** - Smooth slide-in menu with overlay
- **Smooth Scroll** - Animated scroll to anchor links
- **FAQ Accordion** - Expandable questions with animations
- **Scroll Animations** - Fade-in effects using Intersection Observer
- **Form Validation** - Email validation for newsletter signup
- **Sticky Navbar** - Shadow effect on scroll

## Performance

- Minified CSS & JavaScript ready for production
- Lazy loading for images below the fold
- Optimized image formats (JPG for photos)
- No external dependencies (except Google Fonts)
- Lighthouse score target: 90+

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus states for all interactive elements
- Screen reader compatible
- Color contrast compliance

## Deployment

### Hosting Options
- **GitHub Pages** - Free static hosting
- **Netlify** - Automatic deployments
- **Vercel** - Zero-config deployment
- **AWS S3** - Static website hosting

### Pre-deployment Checklist
- [ ] Test on all major browsers
- [ ] Verify mobile responsiveness
- [ ] Check all links and forms
- [ ] Run Lighthouse audit
- [ ] Validate HTML (W3C Validator)
- [ ] Test keyboard navigation
- [ ] Check image optimization

## Development

### Code Style
- BEM-like naming convention for CSS classes
- Mobile-first responsive approach
- Semantic HTML structure
- Commented sections for clarity

### Adding New Sections
1. Add HTML structure in `index.html`
2. Create section styles in `css/layout.css`
3. Add responsive styles in `css/responsive.css`
4. Add animations if needed in `js/animations.js`

## License

© 2024 Revo. All rights reserved.

## Contact

For questions or support, contact: [your-email@revo.app]

---

Built with ❤️ using pure HTML, CSS, and JavaScript
