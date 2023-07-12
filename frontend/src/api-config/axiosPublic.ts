import axios from "axios";

export const axiosPublic = axios.create({
    baseURL: "https://localhost:3000/api",
    withCredentials: true,
});