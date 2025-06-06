/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'wechat-green': '#07C160',
        'wechat-dark': '#181818',
        'wechat-light': '#F7F7F7',
        'wechat-gray': '#EDEDED',
        'wechat-text': '#191919',
      },
    },
  },
  plugins: [],
} 