// @ts-ignore
import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      dva: true,
      antd: true,
      dynamicImport: {
        webpackChunkName: true,
        loadingComponent: './components/Loader'
      },
      title: '',
      routes: {
        exclude: [
          /components/,
        ],
      },
    }],
  ],
  theme: './src/theme.ts',
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

export default config;
