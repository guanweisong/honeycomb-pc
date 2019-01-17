
// ref: https://umijs.org/config/
export default {
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/Loader/Loader'
      },
      title: 'honeycomb-pc',
      dll: true,
      hardSource: true,
      routes: {
        exclude: [
          /components/,
        ],
      },
    }],
  ],
  extraBabelPlugins: [
    "jsx-control-statements"
  ],
  theme: './src/theme.js',
  routes: [
    {
      path: '/',
      component: '../layouts',
      routes: [
        {
          path: '/',
          component: './category',
        },
        {
          path: '/category/:firstCategory?/:secondCategory?',
          component: './category',
        },
        {
          path: '/tags/:tagId',
          component: './category',
        },
        {
          path: '/authors/:authorId',
          component: './category',
        },
        {
          path: '/archives/:id',
          component: './archives',
        },
      ],
    },
  ],
};
