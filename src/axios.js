import Axios from 'axios';

const instance = Axios.create();

// instance.defaults.headers.common['Authorization'] = "bef86fcf-a3f0-499b-97a9-8cd32e08d02f";
instance.defaults.headers.common['Authorization'] = window.sessionStorage.getItem("token");
export default instance;