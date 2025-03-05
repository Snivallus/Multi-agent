/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}' // 确保 Tailwind 扫描到所有需要的文件
  ],
  theme: {
    extend: {
      colors: {
        medical: {
          'blue': '#3498db',
          'light-blue': '#63ceee',
          'dark-blue': '#2c3e50',
          'green': '#2ecc71',
          'red': '#e74c3c',
          'gray': '#95a5a6',
          'doctor': '#12a1f4',
          'patient': '#b2adad'
        }
      }
    },
  },
  plugins: [],
}