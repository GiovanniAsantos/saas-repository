import {
  Col,
  Row,
  Skeleton,
  Modal,
  Form,
  Switch,
  Button,
  Tooltip,
  Divider,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { CustomTable } from "../MovCardConfig/style";

import "./style.module.css";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";

const MovCardConfig = (props) => {
  const [t] = useTranslation("global");

  // const [form] = Form.();

  const flowService = new FlowService();

  const [loading, setLoading] = useState(false);

  const [showMessageError, setShowMessageError] = useState(false);

  const [messageError, setMessageError] = useState();

  const [stepMovs, setStepMovs] = useState([]);

  const [currentStep, setCurrentStep] = useState("");

  const getStepMovs = async () => {
    setLoading(true);
    try {
      const response = await flowService.getStepMovs(
        props?.columnSelect?.stepId
      );
      setStepMovs(response?.data.filter((step) => !step.stepCurrent));
      setCurrentStep(response?.data.filter((step) => step.stepCurrent));
    } catch (error) {
      setShowMessageError(true);
      setMessageError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMov = async (record) => {
    setLoading(true);
    try {
      const request = {
        stepId: props?.columnSelect?.stepId,
        stepAllowId: record?.stepId,
      };

      const response = await flowService.updateMov(request);

      const updatedAllowMov = response?.data?.allowMov ?? !record.allowMov;
      record.allowMov = updatedAllowMov;

      getStepMovs();

      toast.success(response?.data?.message);
    } catch (error) {
      setShowMessageError(true);
      setMessageError(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props?.columnSelect?.stepId != undefined) {
      getStepMovs();
    }
  }, [props?.columnSelect]);

  const goToDashboard = () => {
    history.push(`/bpms`);
  };

  const closeModal = () => {
    props?.setOpenMovConfig(false);
  };

  const coluns = [
    {
      title: t("bpms.dashboard.boardn.moveCardConfig.modalmoveCardConfigText1"),
      dataIndex: "Nome",
      key: "stepName",
      width: 80,
      className: "column-actions",
      render: (_, record) => <>{record?.stepName}</>,
    },
    {
      title: t("bpms.dashboard.boardn.moveCardConfig.modalmoveCardConfigText2"),
      dataIndex: "stepName",
      key: "stepName",
      className: "column-name",
      width: "30%",
      render: (_, record) => (
        <>
          <Switch
            defaultChecked={record?.allowMov}
            onChange={() => updateMov(record)}
          />
        </>
      ),
    },
  ];

  const footer = () => {
    let elements = [];

    elements.push(
      <Tooltip title="Fechar">
        <Button onClick={() => closeModal()}>
          {t("bpms.dashboard.boardn.moveCardConfig.modalBtnClose")}
        </Button>
      </Tooltip>
    );

    return elements;
  };

  return (
    <Modal
      zIndex={2900}
      className="new-column"
      centered
      width={500}
      title={t("bpms.dashboard.boardn.moveCardConfig.modalmoveCardConfigTitle")}
      open={props?.openMovConfig}
      onCancel={() => closeModal()}
      closable={false}
      footer={footer()}
      closeIcon={false}
    >
      <Skeleton avatar title={true} loading={loading} active>
        <br />
        <span>
          {t("bpms.dashboard.boardn.moveCardConfig.modalmoveCardConfigText3")}:{" "}
          <Tag color={currentStep[0]?.stepColor}>
            {currentStep[0]?.stepName}
          </Tag>
        </span>
        <br />
        <br />
        <span>
          {t("bpms.dashboard.boardn.moveCardConfig.modalTextExplanation")}
        </span>
        <Divider />
        <CustomTable
          tableLayout="auto"
          scroll={{ x: 450 }}
          loading={loading}
          columns={coluns}
          dataSource={[...stepMovs]}
          pagination={false}
        />
      </Skeleton>
    </Modal>
  );
};

export default MovCardConfig;
