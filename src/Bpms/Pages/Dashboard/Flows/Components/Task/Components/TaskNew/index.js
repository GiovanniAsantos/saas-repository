/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from "react";

import { TaskService } from "@/src/Services/Bpms/TasksServices/TaskServices";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Empty,
  Form,
  Input,
  Modal,
  Space,
  Spin
} from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import FieldAtt from "../../../Field/Components/FieldAtt";
import FieldCoin from "../../../Field/Components/FieldCoin";
import FieldDate from "../../../Field/Components/FieldDate";
import FieldDateTime from "../../../Field/Components/FieldDateTime";
import FieldNumber from "../../../Field/Components/FieldNumber";
import FieldText from "../../../Field/Components/FieldText";
import FieldTextArea from "../../../Field/Components/FieldTextArea";
import FieldTextDinamic from "../../../Field/Components/FieldTextDinamic";
import "./style.module.css";

const NewTask = (props) => {
  const [loading, setLoading] = useState(false);
  const taskService = new TaskService();
  const [t] = useTranslation("global");
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [modalWidth, setModalWidth] = useState(1200);
  const maxHeight = 600;

  const generate = (form) => {
    let list = [];
    list.push(<Divider />);
    let newList = props.flow?.formInitial?.fields?.sort(
      (a, b) => a.sequence - b.sequence
    );
    newList.map((v, index) => {
      if (v?.type === "TEXT") {
        list.push(
          <FieldText title={v?.name} index={index} field={v} form={form} />
        );
      }
      if (v?.type === "TEXT_AREA") {
        list.push(
          <FieldTextArea
            maxLength={300}
            title={v?.name}
            index={index}
            field={v}
            form={form}
          />
        );
      }
      if (v?.type === "TEXT_DESCRIPTION") {
        list.push(
          <FieldTextDinamic
            title={v?.name}
            index={index}
            field={v}
            form={form}
          />
        );
      }
      if (v?.type === "LONG") {
        list.push(
          <FieldNumber title={v?.name} index={index} field={v} form={form} />
        );
      }
      if (v?.type === "DATE") {
        list.push(
          <FieldDate title={v?.name} index={index} field={v} form={form} />
        );
      }
      if (v?.type === "DATE_TIME") {
        list.push(
          <FieldDateTime title={v?.name} index={index} field={v} form={form} />
        );
      }
      if (v?.type === "BIG_DECIMAL") {
        list.push(
          <FieldCoin title={v?.name} index={index} field={v} form={form} />
        );
      }
      if (v?.type === "ATTACHMENT") {
        list.push(
          <FieldAtt
            title={v?.name}
            index={index}
            field={v}
            form={form}
            setFileList={setFileList}
            fileList={fileList}
          />
        );
      }
    });
    return list;
  };

  const create = async () => {
    setLoading(true);

    let fieldsTemp = Object.entries(form.getFieldsValue());
    let fields = fieldsTemp.filter((f) => f[1] !== undefined);

    const reqsWihtId = [];
    const files = [];

    for (const f of props.flow?.formInitial?.fields) {
      for (const v of fields) {
        if (f?.id == v[0]) {
          if (f?.type == "DATE") {
            reqsWihtId.push({
              fieldId: parseInt(v[0]),
              values: [dayjs(v[1]).format("DD/MM/YYYY")],
            });
          } else if (f?.type == "ATTACHMENT") {
            const fileList = v[1]?.fileList;
            if (fileList != null) {
              files.push(fileList);
            }
            reqsWihtId.push({
              fieldId: parseInt(v[0]),
              values: [],
            });
          } else {
            reqsWihtId.push({
              fieldId: parseInt(v[0]),
              values: [v[1]],
            });
          }
        }
      }
    }

    const request = {
      name: form.getFieldValue("name"),
      flowId: props?.flow?.id,
      fields: reqsWihtId,
    };

    try {
      await taskService.createTask(request, files);

      form.resetFields();
      props?.setOpenNewTask(false);
      props?.setNewTask(true);
      props?.closeModal();
      toast.success("Atividade cadastrada com sucesso.");
      t();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClick = async () => {
    try {
      await form.validateFields(["name"]);
      create();
    } catch (error) {}
  };

  const modalFooter = () => {
    return (
      <div>
        <Button
          onClick={() => props.setOpenNewTask(false)}
          icon={
            <CloseCircleOutlined
              style={{ fontSize: "18px", verticalAlign: "middle" }}
            />
          }
        >
          {t("bpms.dashboard.flow.taskNew.modalBtnClose")}
        </Button>

        <Button
          type="primary"
          icon={
            <CheckCircleOutlined
              style={{ fontSize: "18px", verticalAlign: "middle" }}
            />
          }
          disabled={loading}
          onClick={() => handleCreateClick()}
          style={{ backgroundColor: "initial", borderColor: "initial" }}
        >
          {t("bpms.dashboard.flow.taskNew.btnCreate")}
        </Button>
      </div>
    );
  };

  return (
    <div className="content-dnd">
      {props.flow?.formInitial?.fields?.length > 0 != null &&
        props.flow?.releasedAt != null && (
          <Modal
            zIndex={2900}
            className="modal-pequeno"
            centered
            width={500}
            confirmLoading={loading}
            title={props.flow?.name}
            open={props.openNewTask}
            footer={modalFooter()}
            closable={false}
            closeIcon={false}
          >
            <div>
              <Spin spinning={loading}>
                <Form
                  style={{
                    backgroundColor: "#F0F0F0",
                    position: "relative",
                    padding: "15px",
                    width: "100%",
                    height: maxHeight,
                    border: "1px solid #d3d3d3",
                    borderRadius: "4px",
                    overflowX: "hidden",
                    height: "500px",
                    overflowY: "auto",
                  }}
                  className="criarAtividade"
                  layout="vertical"
                  form={form}
                  name="form"
                >
                  <p>{props.flow?.description}</p>
                  <Form.Item
                    style={{
                      width: "100%",
                    }}
                    name={"name"}
                    label={t("bpms.dashboard.flow.taskNew.taskNewTitle")}
                    rules={[
                      { required: true, message: "Complete o campo de Título" },
                    ]}
                  >
                    <Input maxLength={150} />
                  </Form.Item>
                  <br />
                  <h6>
                    {t(
                      "bpms.dashboard.flow.taskNew.modalSubTitleCompleteFields"
                    )}
                  </h6>
                  {generate(form)}
                </Form>
              </Spin>
            </div>
          </Modal>
        )}

      {props.flow?.formInitial?.fields?.length == 0 && (
        <Modal
          zIndex={2900}
          className="modal-pequeno"
          centered
          width={500}
          title={t("bpms.dashboard.flow.taskNew.modalTaskNewTItle")}
          open={props.openNewTask}
          footer={null}
          closable={false}
          closeIcon={false}
        >
          <Empty
            description={t("bpms.dashboard.flow.taskNew.modalTaskNewText")}
          >
            <Space>
              <Button
                icon={<CloseOutlined />}
                onClick={() => props.setOpenNewTask(false)}
              >
                {t("bpms.dashboard.flow.taskNew.modalBtnClose")}
              </Button>
            </Space>
          </Empty>
        </Modal>
      )}

      {props.flow?.releasedAt == null && (
        <Modal
          zIndex={2900}
          className="modal-pequeno"
          centered
          width={500}
          title={t("bpms.dashboard.flow.taskNew.modalTaskNewTItle")}
          open={props.openNewTask}
          footer={null}
          closable={false}
          closeIcon={false}
        >
          <Empty
            description={t("bpms.dashboard.flow.taskNew.modalTaskNewText2")}
          >
            <Space>
              <Button
                icon={<CloseOutlined />}
                onClick={() => props.setOpenNewTask(false)}
              >
                {t("bpms.dashboard.flow.taskNew.modalBtnClose")}
              </Button>
            </Space>
          </Empty>
        </Modal>
      )}
    </div>
  );
};

export default NewTask;
