import axios from "axios";

const fetchAxios = axios.create ({
    baseURL: "http://localhost:3001/api/v1",
    
    }
    );
export default fetchAxios;
