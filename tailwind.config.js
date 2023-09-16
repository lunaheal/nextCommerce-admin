/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  important: true,
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent', 
        current: 'currentColor',
        lime: colors.lime,
        sky: colors.sky
      },
    },
  },
  plugins: [
    require('tailwindcss-pseudo-elements'),
  ],
  variants: [
    'responsive',
    'group-hover',
    'disabled',
    'hover',
    'focus',
    'active',
    'even',
    'odd',
    'before',
    'after',
    'hover::before',
    'hover::after',
    'focus::before',
  ],
  // variants: {
  //   extend: {
  //     backgroundColor: ['even'],
  //     margin: ['responsive', 'hover', 'first'],
  //     display: ['first'],
  //   }
  // },
  
}

