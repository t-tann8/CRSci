/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'light-gray': '#F5F5F5',
                'primary-color': '#F59A3B',
                'dark-gray': '#85878D',
                'light-orange': '#F59A3B1A',
                'lighter-gray': '#FAFAFA',
            },
            container: {
                center: true,
                padding: '2rem',
            },
            screens: {
                '2xl': '1400px',
                mobile: { max: '767px' },
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    // eslint-disable-next-line global-require
    plugins: [require('tailwindcss-animate')],
};
