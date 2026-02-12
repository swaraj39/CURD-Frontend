import axios from "axios"
const axiosInstance = axios.create({
    baseURL: "https://curd-backend-oxyd.onrender.com",
    withCredentials: true
});

export default axiosInstance;