import axios from "axios";

export const request = () => {
    const axiosInstance = axios.create({
        baseURL: 'http://203.194.114.17:4000/api'
    });
    return axiosInstance;
}