// Minimal Theme Color Scheme
export const theme = {
  // Primary Colors
  primary: {
    DEFAULT: '#000000',    // Pure black
    foreground: '#ffffff', // Pure white
  },
  
  // Secondary Colors
  secondary: {
    DEFAULT: '#f5f5f5',    // Light gray
    foreground: '#000000', // Black text
    dark: '#262626',       // Dark gray for dark mode
    'dark-foreground': '#ffffff', // White text for dark mode
  },
  
  // Background Colors
  background: {
    DEFAULT: '#ffffff',    // Pure white
    dark: '#000000',       // Pure black for dark mode
  },
  
  // Surface Colors (Cards, Modals, etc.)
  surface: {
    DEFAULT: '#ffffff',    // Pure white
    dark: '#121212',       // Near black for dark mode
  },
  
  // Border Colors
  border: {
    DEFAULT: '#e5e5e5',    // Light gray
    dark: '#262626',       // Dark gray for dark mode
    strong: '#000000',     // Black for strong borders
    'strong-dark': '#ffffff', // White for strong borders in dark mode
  },
  
  // Text Colors
  text: {
    primary: '#000000',    // Primary text - black
    'primary-dark': '#ffffff', // Primary text - white (dark mode)
    secondary: '#737373',  // Secondary text - gray
    'secondary-dark': '#a3a3a3', // Secondary text - light gray (dark mode)
    muted: '#a3a3a3',      // Muted text - light gray
    'muted-dark': '#737373', // Muted text - gray (dark mode)
  },
  
  // Interactive States
  interactive: {
    hover: {
      light: '#f9f9f9',    // Very light gray hover
      dark: '#1a1a1a',     // Very dark gray hover
    },
    focus: {
      light: '#000000',    // Black focus ring
      dark: '#ffffff',     // White focus ring
    },
    active: {
      light: '#e5e5e5',    // Light gray active
      dark: '#404040',     // Medium gray active
    },
  },
  
  // Status Colors
  status: {
    destructive: {
      DEFAULT: '#dc2626',  // Red
      foreground: '#ffffff', // White text
    },
    success: {
      DEFAULT: '#16a34a',  // Green
      foreground: '#ffffff', // White text
    },
    warning: {
      DEFAULT: '#ea580c',  // Orange
      foreground: '#ffffff', // White text
    },
    info: {
      DEFAULT: '#2563eb',  // Blue
      foreground: '#ffffff', // White text
    },
  },
  
  // Component-specific colors
  input: {
    background: '#ffffff',
    'background-dark': '#000000',
    border: '#d4d4d4',
    'border-dark': '#525252',
    placeholder: '#a3a3a3',
    'placeholder-dark': '#737373',
  },
  
  // Shadows (for minimal theme, very subtle)
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
} as const;

// Helper function to get dark mode color
export const getDarkColor = (lightColor: string, darkColor: string) => {
  return `${lightColor} dark:${darkColor}`;
};

// CSS class helpers
export const themeClasses = {
  // Background classes
  bg: {
    primary: 'bg-black dark:bg-white',
    primaryForeground: 'bg-white dark:bg-black',
    secondary: 'bg-gray-100 dark:bg-gray-800',
    surface: 'bg-white dark:bg-gray-900',
    muted: 'bg-gray-50 dark:bg-gray-900',
  },
  
  // Text classes
  text: {
    primary: 'text-black dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    inverse: 'text-white dark:text-black',
  },
  
  // Border classes
  border: {
    default: 'border-gray-200 dark:border-gray-800',
    strong: 'border-black dark:border-white',
    muted: 'border-gray-100 dark:border-gray-900',
  },
  
  // Interactive classes
  hover: {
    primary: 'hover:bg-gray-800 dark:hover:bg-gray-200',
    secondary: 'hover:bg-gray-100 dark:hover:bg-gray-800',
    ghost: 'hover:bg-gray-50 dark:hover:bg-gray-900',
  },
  
  // Focus classes
  focus: {
    ring: 'focus:ring-2 focus:ring-black dark:focus:ring-white',
    border: 'focus:border-black dark:focus:border-white',
  },
} as const;