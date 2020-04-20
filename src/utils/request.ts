import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '//127.0.0.1:7001' : '//api.guanweisong.com',
  withCredentials: true,
  timeout: 10000,
  headers: {},
})

instance.interceptors.response.use(
  (res) => {
    return {
      status: res.status,
      data: res.data,
    }
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default instance
