"use client";
import { BaseBpmsService } from "../../Base/BaseBpmsService";

export class FieldService extends BaseBpmsService {
  constructor() {
    super("/");
  }

  // Form Init

  async getFieldById(fieldId) {
    return await this.axiosInstance
      .get(`/flows/initial/fields/${fieldId}`)
      .then((res) => res.data);
  }

  async getTypeFields() {
    return await this.axiosInstance
      .get("/flows/type-fields")
      .then((res) => res.data);
  }

  async removeField(fieldId) {
    return await this.axiosInstance
      .delete(`/flows/initial/fields/${fieldId}`)
      .then((res) => res.data);
  }
  async createField(request) {
    return await this.axiosInstance
      .post("/flows/initial/fields", request)
      .then((res) => res.data);
  }
}
