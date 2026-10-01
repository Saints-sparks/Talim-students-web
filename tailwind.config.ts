import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx,html}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			manrope: [
  				'Manrope',
  				'sans-serif'
  			]
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			// Redesign tokens (the Teachers app's `tl-*` set): CSS variables in
  			// app/globals.css, redefined under `html.dark`, so every screen of the
  			// redesign switches theme without per-class dark overrides.
  			tl: {
  				bg: 'rgb(var(--tl-bg) / <alpha-value>)',
  				surface: 'rgb(var(--tl-surface) / <alpha-value>)',
  				subtle: 'rgb(var(--tl-subtle) / <alpha-value>)',
  				ink: 'rgb(var(--tl-ink) / <alpha-value>)',
  				body: 'rgb(var(--tl-body) / <alpha-value>)',
  				muted: 'rgb(var(--tl-muted) / <alpha-value>)',
  				faint: 'rgb(var(--tl-faint) / <alpha-value>)',
  				line: 'rgb(var(--tl-line) / <alpha-value>)',
  				'line-soft': 'rgb(var(--tl-line-soft) / <alpha-value>)',
  				control: 'rgb(var(--tl-control) / <alpha-value>)',
  				brand: 'rgb(var(--tl-brand) / <alpha-value>)',
  				'brand-fill': 'rgb(var(--tl-brand-fill) / <alpha-value>)',
  				'brand-fill-hover': 'rgb(var(--tl-brand-fill-hover) / <alpha-value>)',
  				'on-brand': 'rgb(var(--tl-on-brand) / <alpha-value>)',
  				link: 'rgb(var(--tl-link) / <alpha-value>)',
  				select: 'rgb(var(--tl-select) / <alpha-value>)',
  				track: 'rgb(var(--tl-track) / <alpha-value>)',
  				success: 'rgb(var(--tl-success) / <alpha-value>)',
  				'success-bg': 'rgb(var(--tl-success-bg) / <alpha-value>)',
  				warning: 'rgb(var(--tl-warning) / <alpha-value>)',
  				'warning-bg': 'rgb(var(--tl-warning-bg) / <alpha-value>)',
  				danger: 'rgb(var(--tl-danger) / <alpha-value>)',
  				'danger-bg': 'rgb(var(--tl-danger-bg) / <alpha-value>)',
  				accent: 'rgb(var(--tl-accent) / <alpha-value>)',
  				'accent-bg': 'rgb(var(--tl-accent-bg) / <alpha-value>)',
  				badge: 'rgb(var(--tl-badge) / <alpha-value>)',
  				'present': 'rgb(var(--tl-present) / <alpha-value>)',
  				'late': 'rgb(var(--tl-late) / <alpha-value>)',
  				'missed': 'rgb(var(--tl-missed) / <alpha-value>)'
  			},
  			// The current subject's colour, set by a `.subj-N` class (lib/learner/subjectTone.ts).
  			subj: {
  				solid: 'rgb(var(--subj-solid) / <alpha-value>)',
  				tint: 'rgb(var(--subj-tint) / <alpha-value>)',
  				ink: 'rgb(var(--subj-ink) / <alpha-value>)'
  			},
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
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
