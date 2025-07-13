# Theme Color Scheme Documentation

This project uses a **minimal black and white theme** with a structured color system that ensures consistency across all UI components.

## Color Palette

### Primary Colors
- **Black (`#000000`)**: Main brand color, used for primary buttons, text, and strong emphasis
- **White (`#ffffff`)**: Background color and inverse text color
- **Gray Scale**: Various shades from light gray (`#f5f5f5`) to dark gray (`#262626`)

### Light Mode Colors
```css
--background: 255 255 255;           /* Pure white background */
--foreground: 0 0 0;                 /* Pure black text */
--primary: 0 0 0;                    /* Black primary */
--primary-foreground: 255 255 255;   /* White text on black */
--secondary: 245 245 245;            /* Light gray */
--border: 229 229 229;               /* Light gray borders */
--muted-foreground: 115 115 115;     /* Medium gray text */
```

### Dark Mode Colors
```css
--background: 0 0 0;                 /* Pure black background */
--foreground: 255 255 255;           /* Pure white text */
--primary: 255 255 255;              /* White primary */
--primary-foreground: 0 0 0;         /* Black text on white */
--secondary: 38 38 38;               /* Dark gray */
--border: 38 38 38;                  /* Dark gray borders */
--muted-foreground: 163 163 163;     /* Light gray text */
```

## Theme Usage

### Using Theme Classes
The project provides pre-built theme classes in `/src/lib/theme.ts`:

```typescript
import { themeClasses } from '@/lib/theme';

// Background classes
themeClasses.bg.primary          // 'bg-black dark:bg-white'
themeClasses.bg.secondary        // 'bg-gray-100 dark:bg-gray-800'
themeClasses.bg.surface          // 'bg-white dark:bg-gray-900'

// Text classes
themeClasses.text.primary        // 'text-black dark:text-white'
themeClasses.text.secondary      // 'text-gray-600 dark:text-gray-400'
themeClasses.text.muted          // 'text-gray-500 dark:text-gray-500'

// Border classes
themeClasses.border.default      // 'border-gray-200 dark:border-gray-800'
themeClasses.border.strong       // 'border-black dark:border-white'

// Interactive classes
themeClasses.hover.primary       // 'hover:bg-gray-800 dark:hover:bg-gray-200'
themeClasses.focus.ring          // 'focus:ring-2 focus:ring-black dark:focus:ring-white'
```

### Component Examples

#### Button Component
```typescript
// Primary button (black background, white text)
<Button variant="default">Click me</Button>

// Outline button (black border, transparent background)
<Button variant="outline">Click me</Button>

// Secondary button (gray background)
<Button variant="secondary">Click me</Button>
```

#### Form Components
```typescript
// Input with theme colors
<Input className={themeClasses.focus.ring} />

// Textarea with consistent styling
<Textarea className={themeClasses.border.default} />
```

## Design Principles

1. **High Contrast**: Pure black and white provide maximum readability
2. **Minimal Palette**: Limited color palette reduces visual noise
3. **Consistent Focus States**: All interactive elements use black/white focus rings
4. **Semantic Colors**: Status colors (red for destructive, etc.) are preserved
5. **Dark Mode Support**: Every color has a corresponding dark mode variant

## Status Colors

While maintaining the minimal theme, certain status colors are preserved for semantic meaning:

- **Destructive**: `#dc2626` (Red) - Used for delete buttons, error states
- **Success**: `#16a34a` (Green) - Used for success messages  
- **Warning**: `#ea580c` (Orange) - Used for warning states
- **Info**: `#2563eb` (Blue) - Used for informational elements

## CSS Variables

All colors are defined as CSS custom properties in `/src/app/globals.css` using RGB values for better compatibility with Tailwind's opacity modifiers:

```css
:root {
  --primary: 0 0 0;                    /* Can be used as rgb(0 0 0) or rgb(0 0 0 / 0.5) */
  --background: 255 255 255;
  /* ... */
}
```

## Adding New Components

When creating new components, use the theme system:

1. Import theme classes: `import { themeClasses } from '@/lib/theme'`
2. Use semantic class names: `themeClasses.bg.primary` instead of `bg-black`
3. Ensure dark mode support: All theme classes include dark mode variants
4. Follow the focus ring pattern: Use `themeClasses.focus.ring` for interactive elements

This system ensures consistency, maintainability, and easy theme modifications in the future.