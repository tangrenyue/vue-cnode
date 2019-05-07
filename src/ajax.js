import axios from 'axios'

const Axios = axios.create({
  baseURL:'https://cnodejs.org/api/v1'
});

export default Axios;