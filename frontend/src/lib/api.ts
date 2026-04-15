import axios from "axios";

// BASE API CLIENT (AXIOS INSTANCE)
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
});
