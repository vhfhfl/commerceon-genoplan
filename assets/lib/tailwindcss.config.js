tailwind.config = {
  content: ['./**/*.{html,js,hbs}'],
  // corePlugins: {
  //   preflight: false,
  // },
  theme: {
    extend: {},
    screens: {
      'xs': '0px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      'pc': '1280px',
      '2xl': '1536px',
      '3xl': '1800px',
    },
  },
};
