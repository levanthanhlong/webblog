import axios from 'axios'

const instance = axios.create({
   baseURL: 'http://localhost:5000/'
   //  baseURL: 'http://ec2-54-169-230-197.ap-southeast-1.compute.amazonaws.com:5000/'
})

export default instance
