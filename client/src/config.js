import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://traveldev.herokuapp.com/api/",
});
