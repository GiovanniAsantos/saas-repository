"use client";
import { BaseCloudService } from "./Base/BaseCloudService";

export class CloudService extends BaseCloudService {
  constructor() {
    super("/");
  }

  async getBase64FromId(filesIdToView) {
    return this.axiosInstance
      .get(`/files/${filesIdToView}/download`, {
        responseType: "blob",
      })
      .then((res) => res.data);
  }
  async handleDownloadFile(fileSelect) {
    return this.axiosInstance
      .get(`/files/${fileSelect?.id}/download`, {
        responseType: "blob",

        onDownloadProgress: (e) => {
          setLoading(false);
        },
      })
      .then((res) => res.data);
  }

  async openModalAttView(key) {
    return this.axiosInstance.get(`/files/${key}/key`).then((res) => res.data);
  }
}
