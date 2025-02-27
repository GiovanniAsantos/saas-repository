"use client";
import axios from "axios";

export class BaseOrganogramService {
  constructor(urlBase) {
    this.url = urlBase;
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BPMS_URL,
    });
    this.initAxios();
  }
  
  initAxios() {
    this.axiosInstance.interceptors.request.use((config) => {
      defaultInterceptor(config);
    });
  }

  async defaultInterceptor(config) {
    try {
      const userToken = await getToken(); // Obtém o token sempre que o interceptor é chamado
      if (userToken) {
        config.headers.Authorization = `Bearer ${userToken}`;
      }
    } catch (error) {
      console.error("Erro ao obter o token:", error);
      // Adicione tratamento adicional aqui se necessário
    }
    return config;
  }
}
