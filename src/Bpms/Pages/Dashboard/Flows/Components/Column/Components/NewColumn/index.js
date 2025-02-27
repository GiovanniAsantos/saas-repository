/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Space,
  Spin
} from "antd";
import "./style.module.css";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { ChromePicker } from "react-color";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const NewColumn = (props) => {

  const [t] = useTranslation("global");
 
  const flowService = new FlowService()

  const [form] = Form.useForm();
  const [formField] = Form.useForm();

  const { TextArea } = Input;

  const [loading, setLoading] = useState(false);

  const [okDisable, setOkDisabled] = useState(false)

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState("#3a4862");

  const [tabKey, setTabKey] = useState("0");

  const [steps, setSteps] = useState([]);

  const createStep = async () => {
    setLoading(true);
    setOkDisabled(true)

    let request = {
      flowId: props?.flow?.id,
      name: form.getFieldValue("name"),
      description: form.getFieldValue("description"),
      color: color,
      finalStep: form.getFieldValue("finalStep"),
    }

    try {

      const stepResponse = await flowService.createStep(request);
      form.resetFields();
      props.getFlow();
      toast.success("Etapa cadastrada com sucesso.");

    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setOkDisabled(false)
      setLoading(false);
    }
  };

  const handleClick = () => {
    setDisplayColorPicker(true);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setColor(color.hex);
  };

  const sSwatch = {
    padding: "5px",
    background: "#fff",
    borderRadius: "1px",
    boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
    display: "inline-block",
    cursor: "pointer",
  };

  const sColorColumn = (colorColumn) => {
    return {
      width: "50px",
      height: "18px",
      borderRadius: "2px",
      background: colorColumn,
    };
  };

  const sColor = {
    width: "22px",
    height: "22px",
    borderRadius: "2px",
    background: `${color}`,
  };

  const sPopover = {
    position: "fixed",
    zIndex: "2",
  };

  const sCover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  const closeModalStep = () => {
    formField.resetFields();
    setTabKey("0");
    props.setOpenNewColumn(false);
  }

  return (
    <div className="content-dnd">

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={750}
        title={t("bpms.dashboard.boardn.newStep.modalNewStep")}
        open={props.openNewColumn}
        onCancel={() => closeModalStep()}
        okText={t("bpms.dashboard.boardn.newStep.btnRegister")}
        cancelText={t("bpms.dashboard.boardn.newStep.modalBtnClose")}
        closable={false}
        closeIcon={false}
        confirmLoading={loading}
        footer={false}
      >
        <Spin spinning={loading}>

          <Form form={form}  layout="vertical" initialValues={{
            finalStep: false,
          }}>

            <Row gutter={[16, 16]}>
              <Col xs={2} xl={2}>
                <Form.Item label={t("bpms.dashboard.boardn.newStep.modalFomrItemColor")} name="color">
                  <div>
                    <div style={sSwatch} onClick={handleClick}>
                      <div style={sColor} />
                    </div>
                    {displayColorPicker ? (
                      <div style={sPopover}>
                        <div style={sCover} onClick={handleClose} />
                        <ChromePicker color={color} onChange={handleChange} />
                      </div>
                    ) : null}
                  </div>
                </Form.Item>
              </Col>

              <Col xs={24} xl={22} md={22}>
                <Form.Item name={`name`} label="Nome" rules={[{ required: true }]}>
                  <Input
                    maxLength={22}
                    placeholder={t("bpms.dashboard.boardn.newStep.modalInputName")}
                    className="inputMod"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={`description`}
              label={t("bpms.dashboard.boardn.newStep.modalFomrItemDescription")}
              rules={[{ required: true }]}
            >
              <TextArea
                className="inputMod"
                maxLength={244}
                placeholder={t("bpms.dashboard.boardn.newStep.modalInputDescription")}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>

            <Space style={{ width: "100%", alignItems: "end", justifyContent: "end" }}>
              <Button
                icon={<CloseCircleOutlined style={{ fontSize: '18px', verticalAlign: 'middle' }} />}
                key="back"
                onClick={() => closeModalStep()}>
                {t("bpms.dashboard.boardn.newStep.modalBtnClose")}
              </Button>
              <Button
                icon={<CheckCircleOutlined style={{ fontSize: '18px', verticalAlign: 'middle' }} />}
                key="submit"
                htmlType="submit"
                type="primary"
                disabled={okDisable}
                loading={loading}
                onClick={() => {
                  createStep()
                }}>
                {t("bpms.dashboard.boardn.newStep.btnRegister")}
              </Button>
            </Space>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
}

export default NewColumn;