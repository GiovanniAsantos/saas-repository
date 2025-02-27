"use client";
import { BaseOrganogramService } from "../../Base/BaseOrganogramService";

export class OrganogramService extends BaseOrganogramService {
  constructor() {
    super("/");
  }

  async getDepartmentsV2() {
    return await this.axiosInstance
      .get("/department/v2")
      .then((res) => res.data);
  }
}
