/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'nott-black': '#0a0a0a',
                'nott-red': '#8a0000',
                'nott-white': '#f0f0f0',
                'nott-gray': '#2a2a2a',
            },
            fontFamily: {
                display: ['Oswald', 'sans-serif'],
                body: ['Courier Prime', 'monospace'],
            },
        },
    },
    plugins: [],
}
