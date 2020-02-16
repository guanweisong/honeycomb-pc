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
    [
      'umi-plugin-ga',
      {
        code: 'UA-158268354-1',
        judge: () => true,
      },
    ],
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
          path: '/tags/:tag_name',
          component: './category',
        },
        {
          path: '/authors/:user_name',
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
