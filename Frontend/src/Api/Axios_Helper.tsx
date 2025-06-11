import axios from 'axios';
import useAuth from '../Hooks/useAuth';

axios.defaults.baseURL = 'http://localhost:8080'
axios.defaults.headers.post["Content-type"] = 'application/json'

export const request = (method : any, url : any, data : any) => {
    const { auth } : any = useAuth();
    let headers = {};
    const accessToken = auth?.jwt;

    if(accessToken !== null && accessToken !== "null") {
        headers = {"Authorization": `Bearer ${accessToken}`};
    }
    
    return axios({
        method: method,
        headers: headers,
        url: url,
        data: data
    });
}