import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        paper: "#f7f4ee",
        line: "#d9d2c6",
        charcoal: "#0b0d0c",
        acid: "#39b928",
        redStyle: "#d94a38",
        yellowStyle: "#d8a51d",
        greenStyle: "#3f8f6b",
        blueStyle: "#366ac9"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(23, 32, 42, 0.12)",
        dark: "0 24px 70px rgba(0, 0, 0, 0.35)"
      }
    }
  },
  plugins: []
};

export default config;
