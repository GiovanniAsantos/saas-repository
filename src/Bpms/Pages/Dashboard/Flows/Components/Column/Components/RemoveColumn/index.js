/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Modal,
  Spin, // Importando o Spin
} from "antd";
import "./style.module.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";

const RemoveColumn = (props) => {
  const [t] = useTranslation("global");
  const flowService = new FlowService();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [stepId, setStepId] = useState();

  const removeColumn = async () => {
    setLoading(true);

    if (form.getFieldValue("message") !== "Excluir") {
      setLoading(false);
      form.resetFields();
      return toast.info("Texto não bate com o esperado.");
    }

    try {
      await flowService.removeColumn(stepId);
      props.getFlow();
      form.resetFields();
      props.setOpenRemoveColumn(false);
      toast.success("Etapa removida com sucesso.");
    } catch (error) {
      console.error(error?.response?.data?.message);
      toast.warn(
        "A etapa inicial não pode ser excluída, mas não se preocupe! Se for necessário, você tem a opção de editá-la conforme suas necessidades."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setStepId(props?.columnSelect?.stepId);
  }, [props?.columnSelect]);

  return (
    <div className="content-dnd">
      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={500}
        title={t("bpms.dashboard.boardn.column.btnRemoveStep")}
        open={props.openRemoveColumn}
        onCancel={() => props.setOpenRemoveColumn(false)}
        onOk={form.submit}
        okText={t("bpms.dashboard.boardn.column.modalBtnRemove")}
        cancelText={t("bpms.dashboard.boardn.column.modalBtnClose")}
        confirmLoading={loading}
        closable={false}
        closeIcon={false}
        okButtonProps={{ disabled: loading }}
      >
        <Spin spinning={loading}>
          <Form form={form} onFinish={removeColumn} layout="vertical">
            <span>{t("bpms.dashboard.boardn.column.removeStepText")}</span>
            <Form.Item
              name="message"
              label={t(
                "bpms.dashboard.boardn.column.removeStepConfirmationText"
              )}
              rules={[
                {
                  required: true,
                  message: t("bpms.dashboard.boardn.column.messageAlert"),
                },
              ]}
            >
              <Input
                maxLength={20}
                placeholder={t("bpms.dashboard.boardn.column.removeStepLabel")}
                className="inputMod"
                disabled={loading}
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};
export default RemoveColumn;
