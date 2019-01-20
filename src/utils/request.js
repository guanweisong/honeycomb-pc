import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: 'http://127.0.0.1:7001',
  withCredentials: true,
  timeout: 10000,
  headers: {},
});


instance.interceptors.response.use(res=>{
  return res;
}, err => {
  message.error(err.response.data.error);
});

export default instance;
