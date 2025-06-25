var tailwind;
tailwind.config = {
    theme: {
        fontFamily: {
            sans: ['Inter'],
        },
        extend: {
            colors: {
                clifford: '#da373d',
            },
            maxWidth: {
                '8xl': '90rem',
            }
        },
        screens: {
            mb: '320px',
            sm: '640px',
            md: '768px',
            lg: '1024px',
            // xl: '1290px',
            '2xl': '1440px',
        },
        container: {
            center: true,
            screens: {
                sm: '640px',
                md: '768px',
                lg: '1024px',
                // xl: '1290px',
                '2xl': '1440px',
            },
        },
    },
    darkMode: 'class',
}
