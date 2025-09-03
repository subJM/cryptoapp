import axios from "@/lib/api";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE, // dev: 3000, prod: /api
  // withCredentials: true, // 쿠키 쓸 때만 켜세요
});

export default api;
