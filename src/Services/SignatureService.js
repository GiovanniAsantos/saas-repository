"use client";
import { BaseSignatureService } from "./Base/BaseSignatureService";

export class SignatureService extends BaseSignatureService {
  constructor() {
    super("/");
  }

  async getBase64FromId(fileSelected) {
    return this.axiosInstance
      .get(
        `/signatures/my/${fileSelected}/signature-id`
      )
      .then((res) => res.data);
  }

  async openModalAttSignature(key, documentId) {
    return this.axiosInstance
      .get(
        `signatures/documents/${key}/archive-signed-document-uuid/${documentId}/document-id`
      )
      .then((res) => res.data);
  }
}
