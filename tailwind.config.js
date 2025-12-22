/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#0ea5e9',
                secondary: '#8b5cf6',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                surface: 'var(--surface)',
                border: 'var(--border)',
                muted: 'var(--muted)',
                'muted-foreground': 'var(--muted-foreground)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
