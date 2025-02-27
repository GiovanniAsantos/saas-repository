  "use client";
  import axios from "axios";
  import { getToken } from "../../auth/keycloakConfig"

  export class BaseBpmsService {
    constructor(urlBase) {
      this.url = urlBase;
      this.axiosInstance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BPMS_URL,
      });
      this.initAxios();
    }
    
    initAxios() {
      this.axiosInstance.interceptors.request.use((config) => {
        return this.defaultInterceptor(config);
      });
    }

    async defaultInterceptor(config) {
      try {
        const userToken = await getToken();
        if (userToken) {
          config.headers.Authorization = `Bearer ${userToken}`;
        }
      } catch (error) {
      }
      return config;
    }
  }
