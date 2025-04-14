/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef2f2',
                    100: '#ffe5e5',
                    200: '#ffcaca',
                    300: '#ffb1b1',
                    400: '#ff9696',
                    500: '#bb5030', // Tu color primario
                    600: '#d34d4d',
                    700: '#b13d3d',
                    800: '#8f2e2e',
                    900: '#6d1e1e',
                },
                secondary: {
                    // Define aquí colores secundarios si los necesitas
                },
                accent: {
                    50: '#fdecea',
                    100: '#f9d3d0',
                    200: '#f3aca1',
                    300: '#ed8371',
                    400: '#e75a42',
                    500: '#ecab0f', // Un rojo de acento
                    600: '#c8280e',
                    700: '#af1f0a',
                    800: '#961606',
                    900: '#7d0d02',
                },
                neutral: {
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
                // Añade más colores si es necesario
            },
            fontFamily: {
                sans: ['"Nunito"', 'sans-serif'], // Una fuente moderna y legible
                // Puedes añadir otras fuentes aquí
            },
        },
    },
    plugins: [],
};
