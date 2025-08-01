/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'fade-in': 'fadeIn 1s ease-in-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': {opacity: 0},
                    '100%': {opacity: 1},
                },
            },
        },
    },
    plugins: [],
};
