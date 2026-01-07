import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
      // Professional font family - Inter
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'JetBrains Mono', 'Courier New', 'monospace'],
      },
      // Responsive breakpoints
      screens: {
        'xs': '480px',      // Large phones landscape
        'sm': '640px',      // Tablets portrait
        'md': '768px',      // Tablets landscape
        'lg': '1024px',     // Small desktops
        'xl': '1280px',     // Desktops
        '2xl': '1536px',    // Large desktops
        '3xl': '1920px',    // Full HD displays
        '4xl': '2560px',    // 2K displays
        '5xl': '3840px',    // 4K/TV displays
        'tv': '3840px',
        'tv-hd': '1920px',
      },
      // Professional typography scale
      fontSize: {
        // Display sizes (hero sections)
        'display-2xl': ['clamp(2.5rem, 5vw, 6rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'display-xl': ['clamp(2.25rem, 4.5vw, 5rem)', { lineHeight: '1.1', fontWeight: '700' }],
        'display-lg': ['clamp(2rem, 4vw, 4.5rem)', { lineHeight: '1.1', fontWeight: '700' }],
        
        // Heading sizes
        'heading-xl': ['clamp(1.75rem, 3.5vw, 4rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-lg': ['clamp(1.5rem, 3vw, 3.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-md': ['clamp(1.25rem, 2.5vw, 3rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-sm': ['clamp(1.125rem, 2vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-xs': ['clamp(1rem, 1.5vw, 2rem)', { lineHeight: '1.2', fontWeight: '600' }],
        
        // Body text sizes
        'body-xl': ['clamp(1.125rem, 1.25vw, 1.75rem)', { lineHeight: '1.5', fontWeight: '400' }],
        'body-lg': ['clamp(1rem, 1.125vw, 1.5rem)', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['clamp(0.875rem, 1vw, 1.25rem)', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['clamp(0.8125rem, 0.875vw, 1.125rem)', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['clamp(0.75rem, 0.8125vw, 1rem)', { lineHeight: '1.5', fontWeight: '400' }],
        
        // Label sizes
        'label-lg': ['clamp(0.875rem, 0.875vw, 1.25rem)', { lineHeight: '1.4', fontWeight: '500' }],
        'label-md': ['clamp(0.8125rem, 0.8125vw, 1.125rem)', { lineHeight: '1.4', fontWeight: '500' }],
        'label-sm': ['clamp(0.75rem, 0.75vw, 1rem)', { lineHeight: '1.4', fontWeight: '500' }],
        'label-xs': ['clamp(0.6875rem, 0.6875vw, 0.875rem)', { lineHeight: '1.4', fontWeight: '500' }],
      },
      // Consistent spacing scale
      spacing: {
        '0.5': '0.125rem',  // 2px
        '1': '0.25rem',     // 4px
        '1.5': '0.375rem',  // 6px
        '2': '0.5rem',      // 8px
        '2.5': '0.625rem',  // 10px
        '3': '0.75rem',     // 12px
        '3.5': '0.875rem',  // 14px
        '4': '1rem',        // 16px
        '5': '1.25rem',     // 20px
        '6': '1.5rem',      // 24px
        '7': '1.75rem',     // 28px
        '8': '2rem',        // 32px
        '9': '2.25rem',     // 36px
        '10': '2.5rem',     // 40px
        '11': '2.75rem',    // 44px - WCAG touch target
        '12': '3rem',       // 48px
        '14': '3.5rem',     // 56px
        '16': '4rem',       // 64px
        '20': '5rem',       // 80px
        '24': '6rem',       // 96px
        '28': '7rem',       // 112px
        '32': '8rem',       // 128px
      },
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
        xl: 'calc(var(--radius) + 4px)',
        '2xl': 'calc(var(--radius) + 8px)',
  		},
      // Line heights
      lineHeight: {
        'tight': '1.1',
        'snug': '1.2',
        'normal': '1.5',
        'relaxed': '1.625',
      },
      // Animations
      keyframes: {
        gradient: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      },
      animation: {
        gradient: "gradient 6s ease infinite",
      },
      backgroundSize: {
        "size-200": "200% 200%",
      },
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
