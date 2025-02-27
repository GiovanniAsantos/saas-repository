"use client";
import { BaseAccountService } from "./Base/BaseAccountService";

export class AccountMeService extends BaseAccountService {
  constructor() {
    super("/accounts/me");
  }

  async getMe() {
    return await this.axiosInstance.get(`${this.url}`).then((res) => res.data);
  }
}
