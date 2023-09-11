/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "clr_background": "#1F2937",
        "clr_text_Btn": "#D1D5DB",
        // "clr_moderate":'#FFAB00'
      },
      height:{
        // "navbarHeight":"7%",
        "footerHeight":"18%",
        // "mainPageHeight":"55%",
        "5elementsT":"22.4rem"
        // "5elementsT":"25.8125rem"
      }
    },
  },
  plugins: [
  ],
}

