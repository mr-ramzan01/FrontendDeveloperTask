const withMT = require("@material-tailwind/react/utils/withMT");
const plugin = require("tailwindcss/plugin");
module.exports = withMT({
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        pixel: "0px",
        mobile: "479px",
        tablet: "768px",
        laptop: "1024px",
        mac: "1200px",
        desktop: "1440px",
      },
    },
    colors: {
    },
  },
});
