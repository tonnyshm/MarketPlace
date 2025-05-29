import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',          // new App-Router pages
        './components/**/*.{js,ts,jsx,tsx}',       // new components folder
    ],      
    theme: {
      extend: {},
    },
    plugins: [],
}

export default config
  