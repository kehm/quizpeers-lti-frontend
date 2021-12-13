module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#3079B6',
        secondary: '#F0A00C',
        darkGrey: '#333333',
      },
    },
    screens: {
      'es': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
