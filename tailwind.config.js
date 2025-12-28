/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#13d2b0',
                secondary: '#0e9f85',
                dark: '#1f2937',
                light: '#f3f4f6'
            }
        },
    },
    plugins: [],
}
