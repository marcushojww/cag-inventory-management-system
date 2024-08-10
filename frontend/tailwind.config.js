/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "cag-logo": "url('/public/images/cag-logo.png')",
        "category-icon": "url('/public/svg/category.svg')",
        "item-icon": "url('/public/svg/item.svg')",
        "exclamation-icon": "url('/public/svg/exclamation.svg')",
        "spinner-icon": "url('/public/svg/spinner.svg')",
      },
    },
  },
  plugins: [],
};
