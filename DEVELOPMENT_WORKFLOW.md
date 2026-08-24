# 🛠️ Development Workflow Guide

This guide covers how to work with the Academics Doctor codebase during development.

## Getting Started

### Initial Setup
```bash
# Clone the repository
git clone https://github.com/siyaswork/Academics-Doctor.git
cd Academics-Doctor

# Checkout the step-1-foundation branch
git checkout step-1-foundation

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

---

## Development Commands

### Development Server
```bash
npm run dev
```
- Hot module replacement (HMR)
- TypeScript checking
- Fast rebuild
- Auto-open in browser

### Production Build
```bash
npm run build
```
- TypeScript compilation
- Vite optimization
- Output to `dist/` directory
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally
- Useful for testing before deployment
- Port: 4173

### Type Checking
```bash
npm run lint
```
- TypeScript strict mode checking
- No code emission
- Validates types across entire project

---

## Project File Structure

### Adding a New Component

1. **Create component file**
```bash
src/components/MyComponent.tsx
```

2. **Create styles file**
```bash
src/components/MyComponent.module.css
```

3. **Create interface file**
```bash
src/components/MyComponent.interface.ts
```

4. **Update exports in index.ts**
```typescript
export { MyComponent } from './MyComponent'
export type { MyComponentProps } from './MyComponent.interface'
```

5. **Component template**
```typescript
import React from 'react'
import styles from './MyComponent.module.css'

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Define your props
  variant?: 'default' | 'alternate'
  size?: 'sm' | 'md' | 'lg'
}

export const MyComponent: React.FC<MyComponentProps> = ({
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${styles.component} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    />
  )
}
```

### Component Style Template

```css
.component {
  /* Base styles */
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--transition-base);
}

.component:hover {
  box-shadow: var(--shadow-md);
}

.component:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Variants */
.default {
  border: 1px solid var(--color-border-subtle);
}

.alternate {
  background-color: var(--color-bg-secondary);
  border: none;
}

/* Sizes */
.sm {
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm) var(--spacing-md);
}

.md {
  font-size: var(--font-size-base);
  padding: var(--spacing-md) var(--spacing-lg);
}

.lg {
  font-size: var(--font-size-lg);
  padding: var(--spacing-lg) var(--spacing-xl);
}

/* Responsive */
@media (max-width: 768px) {
  .component {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
```

---

## Using CSS Variables

### Color Variables
```css
/* Use primary color */
background-color: var(--color-primary);

/* Use semantic colors */
color: var(--color-accent-success);
background: var(--color-bg-secondary);

/* Use text colors */
color: var(--color-text-primary);
color: var(--color-text-secondary);
color: var(--color-text-muted);
```

### Spacing
```css
padding: var(--spacing-md);
margin: var(--spacing-lg);
gap: var(--spacing-sm);

/* Available: xs, sm, md, lg, xl, 2xl, 3xl */
```

### Typography
```css
font-size: var(--font-size-base);
font-weight: var(--font-weight-semibold);
line-height: var(--line-height-normal);

/* Font sizes: xs, sm, base, lg, xl, 2xl, 3xl, 4xl */
/* Weights: light, normal, medium, semibold, bold */
```

### Shadows
```css
box-shadow: var(--shadow-sm);
box-shadow: var(--shadow-md);
box-shadow: var(--shadow-2xl);

/* Available: sm, md, lg, xl, 2xl */
```

### Transitions
```css
transition: all var(--transition-fast);
transition: color var(--transition-base);
transition: transform var(--transition-slow);

/* Speeds: fast (150ms), base (200ms), slow (300ms) */
```

---

## React Best Practices

### Component Props Pattern
```typescript
interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Custom props
  variant?: 'primary' | 'secondary'
  disabled?: boolean
  // Rest props are inherited from HTMLAttributes
}

export const MyComponent: React.FC<MyComponentProps> = ({
  variant = 'primary',
  disabled = false,
  className = '',
  ...props
}) => {
  return <div className={className} {...props} />
}
```

### Using the Theme Hook
```typescript
import { useTheme } from '../contexts/ThemeContext'

export const MyComponent = () => {
  const { theme, effectiveTheme, setTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Effective theme: {effectiveTheme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  )
}
```

### Conditional Styling with CSS Variables
```typescript
const styles = {
  container: `
    background-color: var(--color-surface);
    color: var(--color-text-primary);
  `
}

// CSS will automatically update based on theme
```

---

## Accessibility Guidelines

### Always Include ARIA Labels
```typescript
<button aria-label="Close modal" onClick={onClose}>
  ×
</button>
```

### Use Semantic HTML
```typescript
// Good
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>

// Avoid
<div class="header">
  <div class="nav">
    <span>Home</span>
  </div>
</div>
```

### Focus Management
```typescript
// Component should support tab navigation
<input />
<button>Click me</button>

// Visible focus indicator in CSS
.button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Error Association
```typescript
<input
  id="email"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && <span id="email-error">{error}</span>}
```

---

## Testing Workflow

### Manual Testing Checklist

#### Visual Testing
- [ ] Component renders correctly
- [ ] Correct colors and spacing
- [ ] Responsive on mobile, tablet, desktop
- [ ] Theme toggle works (light/dark)
- [ ] Hover states visible
- [ ] Active states correct

#### Keyboard Testing
- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Enter/Space triggers buttons
- [ ] Escape closes modals
- [ ] Arrow keys work in tabs

#### Accessibility Testing
- [ ] ARIA labels present where needed
- [ ] Semantic HTML used
- [ ] Color contrast sufficient
- [ ] Touch targets ≥44×44px
- [ ] Tested with screen reader

#### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

---

## Git Workflow

### Branch Naming
```bash
# Features
git checkout -b feature/dashboard-layout

# Bug fixes
git checkout -b fix/button-focus-state

# Documentation
git checkout -b docs/component-guide

# Refactoring
git checkout -b refactor/simplify-theme-logic
```

### Commit Messages
```bash
# Feature
git commit -m "feat: add new Alert component"

# Fix
git commit -m "fix: improve button focus visibility"

# Documentation
git commit -m "docs: update component guide"

# Style
git commit -m "style: format code consistency"

# Refactor
git commit -m "refactor: simplify theme context"
```

### Pull Request Process
1. Create feature branch from `step-1-foundation`
2. Make your changes
3. Run `npm run build` to verify production build
4. Run `npm run lint` to check types
5. Commit with meaningful messages
6. Push to GitHub
7. Create pull request with description
8. Request review
9. Merge once approved

---

## Common Development Tasks

### Adding a New Color Variable

1. Edit `src/styles/globals.css`
2. Add to light theme:
   ```css
   --color-my-color: #hexvalue;
   ```
3. Add to dark theme:
   ```css
   [data-theme='dark'] {
     --color-my-color: #hexvalue;
   }
   ```
4. Use in components:
   ```css
   color: var(--color-my-color);
   ```

### Modifying Spacing Scale

1. Edit `src/styles/globals.css`
2. Change spacing variables in `:root` selector
3. Components automatically update
4. Test responsive behavior

### Creating a New Page

1. Create `src/pages/MyPage.tsx`
2. Create `src/pages/MyPage.module.css`
3. Import and use in routing (when implemented)
4. Follow component naming conventions

### Extending the Theme System

1. Edit `src/contexts/ThemeContext.ts`
2. Add new theme option or color scheme
3. Update CSS variables in `globals.css`
4. Test theme toggle functionality

---

## Performance Tips

### Avoid Unnecessary Re-renders
```typescript
// Use React.memo for pure components
export const MyComponent = React.memo(({ prop }: MyComponentProps) => {
  return <div>{prop}</div>
})
```

### CSS Best Practices
```css
/* Good - uses variables */
background-color: var(--color-primary);

/* Avoid - hardcoded values */
background-color: #5e4fc0;

/* Good - scoped with CSS Modules */
.button { }

/* Avoid - global selectors */
button { }
```

### TypeScript for Performance
```typescript
// Good - specific types
interface ButtonProps {
  variant: 'primary' | 'secondary'
}

// Avoid - loose types
interface ButtonProps {
  variant: string
}
```

---

## Troubleshooting

### Hot Module Replacement (HMR) Not Working
```bash
# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

### TypeScript Errors Not Clearing
```bash
# Run lint command to check
npm run lint

# Check tsconfig.json is correct
```

### Styles Not Updating
```bash
# Ensure CSS Modules filename is correct
# ComponentName.tsx → ComponentName.module.css

# Clear browser cache (Ctrl+Shift+Delete)
```

### Theme Not Persisting
```typescript
// Check ThemeContext.ts has localStorage implementation
// Browser localStorage should be enabled
// Check Application > Storage tab in DevTools
```

---

## IDE Setup

### VS Code Extensions Recommended
- **ES7+ React/Redux/React-Native snippets**
- **CSS Modules**
- **TypeScript Vue Plugin (Volar)**
- **Prettier**
- **ESLint**
- **Thunder Client** or **REST Client**

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Hosting
```bash
# Files to deploy are in the 'dist/' directory
# Upload to:
# - Vercel
# - Netlify
# - GitHub Pages
# - AWS S3
# - Any static host
```

### Environment Variables
```bash
# Create .env.local for local development
VITE_API_URL=http://localhost:3000

# Create .env.production for production build
VITE_API_URL=https://api.example.com
```

---

## Documentation

### When to Update Docs
- [ ] Added new component
- [ ] Changed component API
- [ ] Added new CSS variables
- [ ] Modified responsive breakpoints
- [ ] Changed theme implementation
- [ ] Added new utility functions

### Files to Update
- `FOUNDATION_GUIDE.md` - Major changes
- Component README in component folder
- Code comments for complex logic
- This workflow guide if process changes

---

## Code Style

### Naming Conventions
```typescript
// Components - PascalCase
export const MyComponent

// Props interfaces - ComponentNameProps
interface MyComponentProps

// CSS classes - camelCase
.myComponent

// Variables - camelCase
const myVariable

// Constants - UPPER_SNAKE_CASE
const MAX_SIZE = 100

// Boolean - is/has/should prefix
const isActive = true
const hasError = false
const shouldFetch = true
```

### Import Organization
```typescript
// 1. React imports
import React, { useState } from 'react'

// 2. Context imports
import { useTheme } from '../contexts/ThemeContext'

// 3. Component imports
import { Card } from '../components/Card'

// 4. Style imports
import styles from './MyPage.module.css'

// 5. Type imports
import type { MyProps } from './types'
```

---

## Key Resources

- 📖 [React Documentation](https://react.dev)
- 🎨 [Vite Documentation](https://vitejs.dev)
- 📘 [TypeScript Documentation](https://www.typescriptlang.org)
- ♿ [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- 🎨 [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

---

## Questions?

Refer to these files:
- `FOUNDATION_GUIDE.md` - Design system details
- `START_HERE.md` - Quick start guide
- `README.md` - Project overview
- Component source files - See implementation examples
- FoundationDemo page - See components in action

---

**Last Updated**: 2026-08-24
**Version**: 1.0
