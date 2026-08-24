# Academics Doctor

> A modern digital academic workspace built with React, TypeScript, and Vite.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn/pnpm

### Installation & Development

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

## 📚 Documentation

- **[FOUNDATION_GUIDE.md](./FOUNDATION_GUIDE.md)** - Complete guide to the design system, components, and architecture
- **[README.md](./README.md)** - Project overview and structure

## ✨ Features

### 🎨 Design System
- **Complete CSS Variable System** - Colors, spacing, typography, shadows, transitions
- **Light & Dark Mode** - With system preference detection and manual toggle
- **Responsive Design** - Mobile-first approach optimized for all devices
- **Accessibility First** - WCAG AA compliant with semantic HTML and keyboard navigation

### 🧩 Component Library
- **Button** - 4 variants (primary, secondary, outline, ghost) × 3 sizes
- **Card** - Reusable surfaces with optional elevation
- **Input** - Form input with labels, error states, validation
- **Select** - Dropdown with label and error support
- **Badge** - Inline badges with color variants
- **Tabs** - Accessible tab navigation
- **Modal** - Dialog with configurable sizes
- **Alert** - Notifications (info, success, warning, error)
- **Spinner** - Loading indicator
- **ThemeToggle** - Theme switcher component
- **MainLayout** - Flexible layout with header, sidebar, content, footer

### 🌐 Theme Management
- `useTheme()` - React hook for theme access
- `ThemeProvider` - Context-based theme management
- Automatic system preference detection
- Persistent theme preference (localStorage)
- Smooth transitions between themes

### 📱 Responsive Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px - 1280px
- **Large**: 1280px+

## 🎯 Project Structure

```
src/
├── main.tsx                 # React entry point
├── App.tsx                  # Root component
├── index.ts                 # Component exports
├── styles/
│   └── globals.css         # Design tokens & CSS variables
├── components/             # Reusable UI components
├── layouts/               # Layout components
├── contexts/              # React contexts (Theme)
├── lib/                   # Utility functions
└── pages/                 # Page components
```

## 🎨 Color Palette

| Color | Value | Usage |
|-------|-------|-------|
| Primary | #5e4fc0 | Main actions, focus states |
| Secondary | #00a8e8 | Alternative actions |
| Success | #06d6a0 | Positive feedback |
| Warning | #f4d35e | Caution and alerts |
| Error | #ef476f | Errors and destructive actions |

## 📝 Typography

- **Font**: System sans-serif (Apple System Font, Segoe UI, Roboto)
- **Hierarchy**: 7 levels from display heading to caption
- **Responsive Scaling**: Optimized for all screen sizes
- **Line Height**: 1.2-1.75 for readability

## ♿ Accessibility

✅ Semantic HTML throughout
✅ Full keyboard navigation
✅ Visible focus indicators
✅ WCAG AA contrast ratios
✅ Touch-friendly controls (min 44×44px)
✅ Respects prefers-reduced-motion
✅ ARIA labels where needed

## 🚀 Built With

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS Modules** - Component-scoped styles
- **CSS Variables** - Design tokens

## 📦 Minimal Dependencies

Only React and React DOM. No unnecessary third-party libraries.

## 🔄 Future Development

This foundation supports future features:

- Student dashboard and workspace
- Digital notes with rich text editing
- Drawing/handwriting canvas
- Calculator and academic tools
- AI-powered features
- Handwriting recognition
- Equation solving

## 📄 License

MIT
