console.log("importando request")
import axios from 'axios'
// import { Message } from 'element-ui'
import Vue from 'vue'
// create an axios instance

const iAxios = axios.create({
  baseURL: process.env.BASE_API,
  withCredentials: true,
  timeout: 30 * 1000 // request timeout
})

// request interceptor
iAxios.interceptors.request.use(config => {
  // Do something before request is sent
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
iAxios.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error) // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 30 * 1000,
    //   duration: 5000
    // })
    return Promise.reject(error)
  })

Vue.$request = Vue.prototype.$request = iAxios;

export default iAxios;

