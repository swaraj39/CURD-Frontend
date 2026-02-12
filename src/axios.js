import axios from "axios";
export default axios.create({
    baseURL: "https://curd-backend-oxyd.onrender.com",
    withCredentials: true
})