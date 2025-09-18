import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://ssr-talk.onrender.com",
    withCredentials: true,
})
