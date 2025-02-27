"use client";
import { BaseBpmsService } from "../../Base/BaseBpmsService";

export class FlowService extends BaseBpmsService {
  constructor() {
    super("/");
  }

  // My Flows && FlowConfig
  async getFlow(flowId, typeView) {
    return await this.axiosInstance
      .get(`/flows/${flowId}/${typeView}/by-type-view`)
      .then((res) => res.data);
  }

  async getFlowsMenagedBy(name) {
    return await this.axiosInstance
      .get(`/flows/me/managed-by`, {
        params: {
          name: name,
        },
      })
      .then((res) => res.data);
  }

  async getFlowsSizeChangeMenagedBy() {
    return await this.axiosInstance
      .get("/flows/me/managed-by", {
        params: {
          name: form.getFieldValue("name"),
          limit: lineByPage,
          page: 0,
        },
      })
      .then((res) => res.data);
  }

  async getFlowsPaginationChangeMenagedBy(page) {
    return await this.axiosInstance
      .get("/flows/me/managed-by", {
        params: {
          name: form.getFieldValue("name"),
          limit: lineByPage,
          page: page - 1,
        },
      })
      .then((res) => res.data);
  }

  async findAllDepartments() {
    return await this.axiosInstance.get("/department").then((res) => res.data);
  }

  async getAccountsByDepartmentId(organId) {
    return await this.axiosInstance
      .get(`/department/${organId}`)
      .then((res) => res.data);
  }

  // My Pending Tasks
  async getFlowsWithPendingWork() {
    return await this.axiosInstance
      .get("/flows/me/with-peding-work")
      .then((res) => res.data);
  }

  async getFlowsWithPendingWorkPaginationChange(page) {
    return await this.axiosInstance
      .get("/flows/me/with-peding-work", {
        params: {
          name: form.getFieldValue("name"),
          limit: lineByPage,
          page: page - 1,
        },
      })
      .then((res) => res.data);
  }

  async getFlowsWithPendingWorkSizeChange() {
    return await this.axiosInstance
      .get("/flows/me/with-peding-work", {
        params: {
          name: form.getFieldValue("name"),
          limit: lineByPage,
          page: 0,
        },
      })
      .then((res) => res.data);
  }

  // Opened Tasks By Me
  async getFlowsOpenedBy() {
    return await (this.axiosInstance.get("/flows/me/opened-by"),
    {
      params: {
        name: form.getFieldValue("name"),
      },
    }.then((res) => res.data));
  }

  async getFlowsWithMyTasks(name) {
    return await this.axiosInstance
      .get("/flows/me/with-my-tasks", {
        params: {
          name: name,
        },
      })
      .then((res) => res.data);
  }

  async getFlowsWithMyTasksSizeChange() {
    return await this.axiosInstance
      .get("/flows/me/with-my-tasks", {
        params: {
          name: form.getFieldValue("name"),
          limit: lineByPage,
          page: 0,
        },
      })
      .then((res) => res.data);
  }

  async getFlowsWithMyTasksPaginationChange(page) {
    return await this.axiosInstance
      .get("/flows/me/with-my-tasks", {
        params: {
          name: form.getFieldValue("name"),
          limit: lineByPage,
          page: page - 1,
        },
      })
      .then((res) => res.data);
  }

  async getFlowsSizeChangeOpenedBy() {
    return await this.axiosInstance
      .get("/flows/me/opened-by", {
        params: {
          name: form.getFieldValue("name"),
          limit: lineByPageFlows,
          page: 0,
        },
      })
      .then((res) => res.data);
  }

  async getFlowsPaginationChangeOpenedBy(pageFlows) {
    return await this.axiosInstance
      .get("/flows/me/opened-by", {
        params: {
          name: form.getFieldValue("name"),
          limit: lineByPageFlows,
          page: pageFlows - 1,
        },
      })
      .then((res) => res.data);
  }

  // Edit Menaged By
  async findAllDepartments() {
    return await this.axiosInstance.get("/department").then((res) => res.data);
  }

  async getAccountsByDepartmentId(departmentId) {
    return await this.axiosInstance
      .get(`/department/${departmentId}`)
      .then((res) => res.data);
  }

  // Column
  async findAllDepartments() {
    return await this.axiosInstance.get("/department").then((res) => res.data);
  }

  async getAccountsByDepartmentId(organId) {
    return await this.axiosInstance
      .get(`/department/${organId}`)
      .then((res) => res.data);
  }

  async onUpdate(flowId) {
    return await this.axiosInstance
      .put(`/flows/${flowId}`)
      .then((res) => res.data);
  }

  async remmoveFlow(flowId) {
    return await this.axiosInstance
      .delete(`/flows/${flowId}/delete`)
      .then((res) => res.data);
  }

  async suspendFlow(flowId) {
    return await this.axiosInstance
      .patch(`/flows/${flowId}/suspend-release-version`)
      .then((res) => res.data);
  }

  async releaseVersion(flowId) {
    return await this.axiosInstance
      .patch(`/flows/${flowId}/release-version`)
      .then((res) => res.data);
  }

  // Column
  async getFields(stepId) {
    return await this.axiosInstance
      .get(`/flows/steps/fields/${stepId}/step-id`)
      .then((res) => res.data);
  }

  async getTypeFields() {
    return await this.axiosInstance
      .get("/flows/type-fields")
      .then((res) => res.data);
  }

  async removeField(fieldId) {
    return await this.axiosInstance
      .delete(`/flows/steps/fields/${fieldId}`)
      .then((res) => res.data);
  }

  async getFieldById(fieldId) {
    return await this.axiosInstance
      .get(`/flows/steps/fields/${fieldId}`)
      .then((res) => res.data);
  }

  async createField() {
    return await this.axiosInstance
      .post("/flows/steps/fields")
      .then((res) => res.data);
  }

  async getStepMovs(stepId) {
    return await this.axiosInstance
      .get(`/flows/steps/movs/${stepId}/step-id`)
      .then((res) => res.data);
  }

  async updateMov() {
    return await this.axiosInstance
      .post(`/flows/steps/movs/add-mov`)
      .then((res) => res.data);
  }

  async createStep() {
    return await this.axiosInstance
      .post("/flows/steps")
      .then((res) => res.data);
  }

  async RemoveColumn(stepId) {
    return await this.axiosInstance
      .delete(`/flows/steps/${stepId}`)
      .then((res) => res.data);
  }

  async changeStepPosition() {
    return await this.axiosInstance
      .post(`/flows/steps/change/sequence`)
      .then((res) => res.data);
  }
  async changeStepPosition(flowId, stepId) {
    return await this.axiosInstance
      .get(`/flows/steps/nonFinalSteps/${flowId}/${stepId}`)
      .then((res) => res.data);
  }

  async ViewColumn(stepId) {
    return await this.axiosInstance
      .put(`/flows/steps/${stepId}`)
      .then((res) => res.data);
  }

  async getAccountsByDepartmentId(departmentId) {
    return await this.axiosInstance
      .get(`/department/${departmentId}`)
      .then((res) => res.data);
  }

  async openAddDepartment() {
    return await this.axiosInstance.get(`/department`).then((res) => res.data);
  }

  async createExternalAccount() {
    return await this.axiosInstance
      .post("/flow-step-validated-external")
      .then((res) => res.data);
  }

  async handleDeleteExternalAccount(externalId) {
    return await this.axiosInstance
      .delete(`/flow-step-validated-external/${externalId}`)
      .then((res) => res.data);
  }

  async onFinish() {
    return await this.axiosInstance.post("/flows").then((res) => res.data);
  }

  async getFlowSearch() {
    return await this.axiosInstance
      .get(`/flows/steps/tasks/search`)
      .then((res) => res.data);
  }

  async getPermissions() {
    return await this.axiosInstance
      .get(`/flows/me/${null}/permissions-managed-by`)
      .then((res) => res.data);
  }

  // Departement

  async updateDepartment(data) {
    return await this.axiosInstance
      .post("/department", data)
      .then((res) => res.data);
  }

  async getDepartmentInfo(id) {
    return await this.axiosInstance
      .get(`/department/${id}`)
      .then((res) => res.data);
  }

  async addUserToDepartment(request) {
    return await this.axiosInstance
      .post("/department/add-account", request)
      .then((res) => res.data);
  }

  async getUsersAvailable() {
    return await this.axiosInstance
      .get("/department/accounts")
      .then((res) => res.data);
  }

  async createDepartment(data) {
    return await this.axiosInstance
      .post("/department", data)
      .then((res) => res.data);
  }

  async removeUserFromDepartment(request) {
    return await this.axiosInstance
      .delete("/department/accounts", { data: request })
      .then((res) => res.data);
  }

  async deleteDepartment(departmentId) {
    return await this.axiosInstance
      .delete(`/department/${departmentId}/delete`)
      .then((res) => res.data);
  }
}
