import Axios from 'axios';

const instance = Axios.create({
    baseURL: 'http://localhost:8002/api/syllabus'
});

instance.defaults.headers.common['Authorization'] = "0a9f281a-2fc4-436f-862a-9e22b95c05dc";

export default instance;