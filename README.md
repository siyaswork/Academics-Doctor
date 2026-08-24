# Academics Doctor

A modern digital academic workspace built with React, TypeScript, and Vite.

## Project Structure

```
academics-doctor/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── src/
│   ├── main.tsx           # React entry point
│   ├── App.tsx            # Root component
│   ├── App.css            # Root styles
│   ├── styles/
│   │   └── globals.css    # Global design system & CSS variables
│   ├── components/        # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   ├── Card.tsx
│   │   ├── Card.module.css
│   │   ├── Input.tsx
│   │   ├── Input.module.css
│   │   ├── Badge.tsx
│   │   ├── Badge.module.css
│   │   ├── ThemeToggle.tsx
│   │   └── ThemeToggle.module.css
│   ├── contexts/          # React contexts
│   │   └── ThemeContext.tsx
│   ├── pages/             # Page components
│   │   ├── FoundationDemo.tsx
│   │   └── FoundationDemo.module.css
│   ├── layouts/           # Layout components (future)
│   ├── features/          # Feature modules (future)
│   └── lib/               # Utilities and helpers (future)
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run lint
```

## Features

### Design System
- **CSS Variables**: Comprehensive token system for colors, spacing, typography, shadows, and transitions
- **Light & Dark Mode**: Full theme support with system preference detection and manual toggle
- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Accessibility**: WCAG AA compliant with semantic HTML, keyboard navigation, and focus management

### Components
- **Button**: Multiple variants (primary, secondary, outline, ghost) and sizes (sm, md, lg)
- **Card**: Reusable card surfaces with optional elevation
- **Input**: Form input with label support, error states, and validation feedback
- **Badge**: Inline badges with multiple color variants
- **ThemeToggle**: Light/dark/system theme switcher with persistence

### Theme System
- Automatic system preference detection
- Manual light/dark mode toggle
- Theme preference persistence to localStorage
- Smooth theme transitions
- Complete CSS variable system for theming

## Design Principles

- **Modern & Clean**: Soft rounded surfaces, ample whitespace, subtle depth
- **Spacious**: Generous spacing and padding for comfortable interaction
- **Minimal**: No unnecessary decorative elements or clutter
- **Premium-looking**: Professional typography and shadow usage
- **Friendly**: Approachable and welcoming design aesthetic
- **Highly Responsive**: Perfect experience on all device sizes
- **Touch-friendly**: Minimum 44x44px touch targets

## Color Palette

| Color | Value | Usage |
|-------|-------|-------|
| Primary | #5e4fc0 | Main actions, focus states |
| Secondary | #00a8e8 | Alternative actions |
| Success | #06d6a0 | Positive feedback |
| Warning | #f4d35e | Caution and alerts |
| Error | #ef476f | Errors and destructive actions |

## Typography

- **Font Family**: System sans-serif (Apple System Font, Segoe UI, Roboto, etc.)
- **Responsive Scaling**: Font sizes adjust on mobile devices
- **Hierarchy**: 7-level hierarchy from display heading to caption
- **Line Height**: Optimized for readability (1.2-1.75)

## Future Development

This foundation supports future features:

- Personal student dashboard
- Digital notes and rich text editing
- Drawing/handwriting canvas with pen and highlighter tools
- Built-in calculator
- Mathematical notation support
- AI-powered features
- Handwriting recognition
- Equation solving

## Development Notes

- No hard-coded colors in components — all use CSS variables
- Mobile-first responsive design
- All interactive elements keyboard navigable
- Respects prefers-reduced-motion for accessibility
- Minimal dependencies (React + React DOM only)
- TypeScript strict mode enabled

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS 12+, Android 8+

## License

MIT
