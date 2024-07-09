import { colors } from './src/styles/colors';
import { fonts } from './src/styles/fonts';

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    colors,
    fontFamily: fonts,
    extend: {},
  },
  plugins: [],
};
