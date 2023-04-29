/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        // Or if using `src` directory:
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                header: '#ffaa2b',
                main: '#614bec'
            }
        },
        screens: {
            '2xl': { 'max': '1535px' },
            // => @media (max-width: 1535px) { ... }

            'xl': { 'max': '1350px' },
            // => @media (max-width: 1350px) { ... }

            'lg': { 'max': '1100px' },
            // => @media (max-width: 1100px) { ... }

            'lg-md': { 'max': '900px' },
            // => @media (max-width: 900px) { ... }

            'md': { 'max': '767px' },
            // => @media (max-width: 767px) { ... }

            'sm': { 'max': '639px' },
            // => @media (max-width: 639px) { ... }

            'xs': { 'max': '500px' },
            // => @media (max-width: 500px) { ... }
        }
    },
    plugins: [],
}

