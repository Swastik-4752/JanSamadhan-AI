/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#1A73E8',
                gold: '#C9A84C',
                dark: {
                    DEFAULT: '#0A0A0A',
                    100: '#1A1A1A',
                    200: '#2A2A2A',
                    300: '#3A3A3A',
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
