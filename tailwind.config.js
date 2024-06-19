/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryIdle: '#2B52EA',
        primaryLighter: '#4468F1',
        primaryDarker: '#1C3EC4',
        secoundaryIdle: '#FC6F1F',
        secoundaryLighter: '#FF763C',
        secoundaryDarker: '#DC4502',
        textSecound: '#868686',
        disabled: '#D3D3D3',
        background: '#FCFCFC',
        superLight: '#F1F1F1',
      },
    },
  },
  plugins: [],
}

