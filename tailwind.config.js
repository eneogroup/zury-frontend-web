/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#000000",
        primary: "#38326C",
        accent: "#3A34AB",
        gold: "#F4C430",
        light: "#EBF5FB",
        gray: "#64748B",
      },
    },
  },
  plugins: [],
}