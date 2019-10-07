
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
      title: '',
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
  hash: true,
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
          path: '/tags/:tagName',
          component: './category',
        },
        {
          path: '/authors/:authorName',
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
