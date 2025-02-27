import { Button, Form, Modal, Select, Spin } from 'antd';
import { Option } from 'antd/es/mentions';
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import './style.module.css';
import { FlowService } from '@/src/Services/Bpms/FlowServices/FlowService';

const SequenceSwitch = (props) => {
  const [t] = useTranslation("global");
  const [form] = Form.useForm();
  const flowService = new FlowService()
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [okDisabled, setOkDisabled] = useState(false);

  const handleOkClick = async (action, closeModal) => {
    setOkDisabled(true);   // Desabilita o botão "Ok"
    setLoading(true);      // Mostra o spinner

    try {
      await changeStepPosition();  // Executa a ação específica
    } finally {
      setLoading(false);   // Oculta o spinner
      setOkDisabled(false); // Reativa o botão (opcional, caso queira reativar depois)
      props?.closeModal(false)  // Fecha o modal específico
    }
  };

  const footerSelectModal = () => {
    return [
      <Button
        key="close"
        onClick={() => props?.closeModal(false)}
      >
        {t("bpms.dashboard.flow.taskView.modalBtnClose")}
      </Button>,
      <Button
        type="primary"
        key="confirm"
        onClick={handleOkClick}
        disabled={okDisabled}
      >
        {t("bpms.dashboard.flow.taskView.btnConfirm")}
      </Button>
    ];
  };

  const changeStepPosition = async () => {
    let request = {
      "stepId": props?.stepId,
      "newSequence": form?.getFieldValue("stepSelection")
    };

    try {
      await flowService.changeStepPosition(request);
    } catch (error) {
      console.error("Error changing step position:", error);
    }
  };

  const listStepSequence = async () => {
    try {
      const response = await flowService.listStepSequence(flowId, stepId);
      setSteps(response.data);
    } catch (error) {
      console.error("Error listing step sequence:", error);
    }
  };

  useEffect(() => {
    if(props?.stepId != undefined){
      if (props?.openModal) {
        listStepSequence()
      }
    }
  }, [props?.stepId, props?.openModal]);

  return (
    <div className="column">
      <Modal
        zIndex={2900}
        centered
        width={650}
        title={t("bpms.dashboard.flow.flowColumn.modalSelectPositionTItle")}
        open={props?.openModal}
        cancelText={t("bpms.dashboard.flow.flowColumn.modalBtnClose")}
        closable={false}
        footer={footerSelectModal()}
      >
        <Spin spinning={loading}>
        <Form form={form}>
          <Form.Item name="stepSelection">
            <Select placeholder={t("bpms.dashboard.flow.flowColumn.modalSelectName")}>
              {steps.map(step => (
                <Option key={step?.id} value={step?.sequence}>
                  {step?.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default SequenceSwitch;
