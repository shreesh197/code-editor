import axios from "axios";
import { rapidApi } from "../constants";

export default function Api() {
  const api = axios.create({
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "X-RapidAPI-Key": rapidApi.key,
      "X-RapidAPI-Host": rapidApi.host,
    },
  });
  const token = localStorage.getItem("token");
  if (token) {
    api.defaults.headers.common["Authorization"] = "Bearer " + token;
  } else {
    api.defaults.headers.common["Authorization"] = "";
  }
  return api;
}
