/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tailwind sẽ quét các file này để loại bỏ CSS không dùng
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Màu sắc tùy chỉnh cho theme LOL Manager
      colors: {
        'lol-dark': '#0a0e1a',       // Nền tối chính
        'lol-panel': '#111827',       // Nền panel/card
        'lol-border': '#1e2d40',      // Viền
        'lol-gold': '#c89b3c',        // Vàng LOL
        'lol-gold-light': '#f0e6d3',  // Vàng nhạt
        'lol-blue': '#0bc4e3',        // Xanh dương neon
        'lol-red': '#e84057',         // Đỏ nguy hiểm
        'lol-green': '#1db954',       // Xanh lá tích cực
      },
      // Font chữ
      fontFamily: {
        'lol': ['Cinzel', 'serif'],
      },
      // Hiệu ứng box shadow
      boxShadow: {
        'gold': '0 0 20px rgba(200,155,60,0.3)',
        'blue': '0 0 20px rgba(11,196,227,0.3)',
      },
    },
  },
  plugins: [],
};
