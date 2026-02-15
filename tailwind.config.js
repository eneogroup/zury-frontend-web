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
        dark: "#12243A",
        primary: "#1E6FA8",
        accent: "#28B463",
        gold: "#F4C430",
        light: "#EBF5FB",
        gray: "#64748B",
      },
    },
  },
  plugins: [],
}