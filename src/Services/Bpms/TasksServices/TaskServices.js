"use client";
import { BaseBpmsService } from "../../Base/BaseBpmsService";

export class TaskService extends BaseBpmsService {
  constructor() {
    super("/");
  }

  // Task View

  async getSteps(stepCurrentId) {
    return await this.axiosInstance
      .get(`/flows/steps/movs/${stepCurrentId}/step-id/only-enabled`)
      .then((res) => res.data);
  }

  async getAllFoundFiles(taskId) {
    return await this.axiosInstance
      .get(`/flows/steps/files/${taskId}`)
      .then((res) => res.data);
  }

  async generateModal(taskId) {
    return await this.axiosInstance
      .get(`/flows/steps/tasks/${taskId}`)
      .then((res) => res.data);
  }

  async execAction(
    taskId,
    typeAction,
    description,
    goToStep,
    reqsWithId,
    filesMap
  ) {
    const formData = new FormData();

    Object.values(filesMap).forEach((fileList) => {
      fileList.forEach((file) => {
        const fileObj = file.originFileObj || file;
        formData.append("files", fileObj, file?.name);
      });
    });

    const request = {
      taskId: taskId,
      typeAction: typeAction,
      description: description,
      goToStep: goToStep,
      fields: reqsWithId,
    };
    formData.append("request", JSON.stringify(request));

    return await this.axiosInstance
      .post("/flows/steps/tasks/actions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  }

  // TaskNew

  async createTask(request, files) {
    const formData = new FormData();

    if (files && files.length > 0) {
      files.forEach((fileList) => {
        fileList.forEach((file) => {
          const fileObj = file.originFileObj || file;
          formData.append("files", fileObj);
        });
      });
    }

    formData.append("request", JSON.stringify(request));

    return await this.axiosInstance
      .post("/flows/steps/tasks", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  }
}
