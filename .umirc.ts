// @ts-ignore
import { IConfig } from 'umi-types';
import theme from './src/theme';

// ref: https://umijs.org/config/
const config: IConfig = {
  antd: {},
  dynamicImport: {
    loading: '@/components/Loader'
  },
  title: '稻草人博客',
  analytics: {
    ga: 'UA-158268354-1',
  },
  theme: theme,
  ignoreMomentLocale: true,
  publicPath: process.env.NODE_ENV === 'development' ? '/' : 'https://cdn.guanweisong.com/',
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
