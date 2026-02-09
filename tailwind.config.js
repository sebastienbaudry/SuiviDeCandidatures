/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Safelist classes that may be missed by the scanner (ensures availability on Pages)
  safelist: [
    'bg-blue-50','from-blue-50','p-3','sm:p-6','text-2xl','sm:text-3xl','shadow-sm','border-gray-200','text-gray-900','text-gray-600','grid-cols-3','sm:grid-cols-6','gap-2','sm:gap-4','rounded-lg','bg-white','text-blue-700','text-yellow-700','text-green-700','text-xs','sm:p-4','p-4','px-4','py-3','bg-gray-100','bg-green-600','hover:bg-green-700'
  ],
  // Also add legacy 'purge' safelist for broader compatibility with older plugin versions
  purge: {
    enabled: true,
    content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
    options: {
      safelist: [
        'bg-blue-50','from-blue-50','p-3','sm:p-6','text-2xl','sm:text-3xl','shadow-sm','border-gray-200','text-gray-900','text-gray-600','grid-cols-3','sm:grid-cols-6','gap-2','sm:gap-4','rounded-lg','bg-white','text-blue-700','text-yellow-700','text-green-700','text-xs','sm:p-4','p-4','px-4','py-3','bg-gray-100','bg-green-600','hover:bg-green-700'
      ]
    }
  },
  theme: {
    extend: {},
  },
  plugins: [],
} 
