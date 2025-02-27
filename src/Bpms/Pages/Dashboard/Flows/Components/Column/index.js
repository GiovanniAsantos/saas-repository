import {
  CloseCircleOutlined,
  DeleteOutlined,
  GlobalOutlined,
  MoreOutlined,
  PlusOutlined,
  RetweetOutlined,
  RightCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Switch,
} from "antd";
import TypedInputNumber from "antd/es/input-number";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import MovCardConfig from "../../../../../../Bpms/Pages/Dashboard/Flows/Components/Column/Components/MovCardConfig";
import NewColumn from "../../../../../../Bpms/Pages/Dashboard/Flows/Components/Column/Components/NewColumn";
import RemoveColumn from "../../../../../../Bpms/Pages/Dashboard/Flows/Components/Column/Components/RemoveColumn";
import SequenceSwitch from "../../../../../../Bpms/Pages/Dashboard/Flows/Components/Column/Components/SequenceSwitch";
import ViewColumn from "../../../../../../Bpms/Pages/Dashboard/Flows/Components/Column/Components/ViewColumn";
import Task from "../Task";
import "./style.module.css";
import FieldText from "../Field/Components/FieldText";
import FieldTextArea from "../Field/Components/FieldTextArea";
import FieldTextDinamic from "../Field/Components/FieldTextDinamic";
import FieldNumber from "../Field/Components/FieldNumber";
import FieldDate from "../Field/Components/FieldDate";
import FieldDateTime from "../Field/Components/FieldDateTime";
import FieldAtt from "../Field/Components/FieldAtt";
import FieldCoin from "../Field/Components/FieldCoin";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";

const Column = (props) => {
  const [t] = useTranslation("global");

  const flowService = new FlowService();

  const [form] = Form.useForm();

  // const myRef = useRef < HTMLDivElement > null;

  const [formField] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [showDesciption, setShowDescription] = useState(false);

  const [openViewColumn, setOpenViewColumn] = useState(false);

  const [openNewColumn, setOpenNewColumn] = useState(false);

  const [openRemoveColumn, setOpenRemoveColumn] = useState(false);

  const [openMovConfig, setOpenMovConfig] = useState(false);

  const [columnSelect, setColumnSelect] = useState();

  const [openModalFormFields, setOpenModalFormFields] = useState(false);

  const [openModalSelectFormPosition, setOpenModalSelectPosition] =
    useState(false);

  const [openFormStep, setOpenFormStep] = useState(false);

  const [showHelpText, setShowHelpText] = useState(false);

  const [fields, setFields] = useState([]);

  const [sizeDisable, setSizeDisable] = useState(true);

  const [showAllowSignature, setShowAllowSignature] = useState(false);

  const [allowSignature, setAllowSignature] = useState(false);

  const [typeFields, setTypeFields] = useState([]);

  const [showRegexValidation, setShowRegexValidation] = useState(false);

  const [notNull, setNotNull] = useState(false);

  const [okDisabled, setOkDisabled] = useState(false);

  const generate = () => {
    let list = [];
    fields?.map((v, index) => {
      if (v?.type === "TEXT") {
        list.push(
          <FieldText
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "TEXT_AREA") {
        list.push(
          <FieldTextArea
            maxLength={300}
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "TEXT_DESCRIPTION") {
        list.push(
          <FieldTextDinamic
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "LONG") {
        list.push(
          <FieldNumber
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "DATE") {
        list.push(
          <FieldDate
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "DATETIME") {
        list.push(
          <FieldDateTime
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "ATTACHMENT") {
        list.push(
          <FieldAtt
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "BIG_DECIMAL") {
        list.push(
          <FieldCoin
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "MULTIPLE_CHOISE") {
        list.push(
          <FieldText
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }

      if (v?.type === "ONLY_CHOISE") {
        list.push(
          <FieldText
            title={v?.name}
            remove={removeField}
            edit={getFieldById}
            index={v?.id}
            field={v}
            preview={true}
          />
        );
      }
    });

    return list;
  };

  const getFields = async () => {
    await flowService.getFields(props?.column?.stepId).then((response) => {
      setFields(response.content);
    });
  };

  const getTypeFields = async () => {
    try {
      const response = await flowService.getTypeFields();
      setTypeFields(response.content);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const removeField = async (fieldId) => {
    await flowService
      .removeField(fieldId)
      .then((response) => {
        formField.resetFields();
        setOpenFormStep(false);
        getFields();
        toast.success("Campo removido com sucesso.");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getFieldById = async (fieldId) => {
    await flowService
      .getFieldById()
      .then((response) => {
        formField.setFieldsValue({
          id: fieldId,
          name: response?.name,
          size: response?.size,
          type: response?.type,
          notNull: response?.notNull,
          sharedInfo: response?.sharedInfo,
          stepId: props?.column?.stepId,
          helpText: response?.helpText,
          regexValidation: response?.regexValidation,
          description: response?.description,
          showDescription: response?.description == null ? false : true,
        });

        setNotNull(response?.notNull);

        if (response?.description != null) {
          setShowDescription(true);
        }

        if (response?.attConfig != null) {
          setAllowSignature(response?.attConfig?.allowSignature);

          if (response?.attConfig?.allowSignature) {
            setShowAllowSignature(true);
          }
        }

        if (response?.size != null) {
          setSizeDisable(false);
        }

        setOpenFormStep(true);
      })
      .catch((error) => {
        toast.error(error?.response?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createField = async (fieldId) => {
    setOkDisabled(true);
    setLoading(true);

    let description = "";

    if (showDesciption) {
      description =
        formField.getFieldValue("description") === undefined
          ? null
          : formField.getFieldValue("description");
    } else {
      description = null;
    }

    let request = {
      id: fieldId,
      name: formField.getFieldValue("name"),
      size: formField.getFieldValue("size"),
      type: formField.getFieldValue("type"),
      notNull: notNull,
      sharedInfo: formField.getFieldValue("sharedInfo"),
      helpText:
        formField.getFieldValue("helpText") === undefined
          ? null
          : formField.getFieldValue("helpText"),
      description: description,
      regexValidation:
        formField.getFieldValue("regexValidation") === undefined
          ? null
          : formField.getFieldValue("regexValidation"),
      stepId: props?.column?.stepId,
    };

    if (request?.type === "ATTACHMENT") {
      const attConfig = {
        allowSignature: allowSignature,
      };

      request.attConfig = attConfig;
    }

    if (
      request?.type === "MULTIPLE_CHOISE" ||
      request?.type === "ONLY_CHOISE"
    ) {
      const chooseConfig = {
        options: [],
      };

      request.chooseConfig = chooseConfig;
    }

    await flowService
      .createField(request)
      .then((response) => {
        formField.resetFields();

        if (fieldId == null) {
          toast.success("Campo adicionado com sucesso.");
        } else {
          toast.success("Campo atualizado com sucesso.");
        }

        getFields();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        closeAddField();
      });
  };

  const handleTypeOfField = (fieldValue) => {
    setSizeDisable(true);
    setShowAllowSignature(false);

    if (fieldValue === "TEXT") {
      setSizeDisable(false);
      setShowAllowSignature(false);
    }

    if (fieldValue === "ATTACHMENT") {
      setSizeDisable(true);
      formField.setFieldValue("size", null);
      setShowAllowSignature(true);
    }
  };

  const openRegexValidation = (value) => {
    setShowRegexValidation(value);
  };

  const closeColumn = () => {
    resetFormStates();
    setOpenModalFormFields(false);
  };

  const openViewColumnHandler = (value) => {
    setOpenViewColumn(true);
    setColumnSelect(value);
  };

  const openRemoveColumnHandler = (value) => {
    setOpenRemoveColumn(true);
    setColumnSelect(value);
  };

  const openMovConfigColumnHandler = (value) => {
    setOpenMovConfig(true);
    setColumnSelect(value);
  };

  const openModalCreateFormFields = (column) => {
    getTypeFields();
    getFields();
    setOpenModalFormFields(true);
  };

  const openModalSelectStepPosition = () => {
    setOpenModalSelectPosition(true);
  };

  const closeSelectPositionModal = () => {
    setOpenModalSelectPosition(false);
  };

  const closeAddField = () => {
    resetFormStates();
    setOkDisabled(false);
    setLoading(false);
    setAllowSignature(false);
    setShowAllowSignature(false);
    setSizeDisable(true);
    setOpenFormStep(false);
    setShowDescription(false);
    setNotNull(false);
    formField.resetFields();
  };

  const openDescription = (value) => {
    setShowDescription(value);
  };

  const openHelpText = (value) => {
    setShowHelpText(value);
  };

  const items = [
    {
      key: "1",
      label: (
        <span onClick={() => openViewColumnHandler(props?.column)}>
          <SettingOutlined style={{ cursor: "pointer", marginRight: "5px" }} />{" "}
          {t("bpms.dashboard.boardn.column.modalTitleConfigDropdown")}
        </span>
      ),
      style: {
        color: "#1B4280",
      },
    },
    {
      key: "2",
      label: (
        <span onClick={() => openModalCreateFormFields(props?.column)}>
          <GlobalOutlined />{" "}
          {t("bpms.dashboard.boardn.column.modalTitleConfigPage2")}
        </span>
      ),
      style: {
        color: "#1B4280",
      },
    },
    {
      key: "3",
      label: (
        <span onClick={() => openMovConfigColumnHandler(props?.column)}>
          <RightCircleOutlined />{" "}
          {t("bpms.dashboard.boardn.column.btnConfigEvolutionStep")}
        </span>
      ),

      style: {
        color: "#1B4280",
      },
    },
    {
      key: "4",
      label: (
        <span onClick={() => openModalSelectStepPosition(props?.column)}>
          <RetweetOutlined />{" "}
          {t("bpms.dashboard.boardn.column.modalSelectPositionTItle")}
        </span>
      ),
      style: {
        color: "#1B4280",
      },
    },
    {
      key: "5",
      label: (
        <span onClick={() => openRemoveColumnHandler(props?.column)}>
          <DeleteOutlined /> {t("bpms.dashboard.boardn.column.btnRemoveStep")}
        </span>
      ),
      style: {
        color: "#ef3e3e",
      },
    },
  ];

  const itemInitialStep = [
    {
      key: "1",
      label: (
        <span onClick={() => openModalCreateFormFields(props?.column)}>
          <GlobalOutlined />{" "}
          {t("bpms.dashboard.boardn.column.modalTitleConfigPage2")}
        </span>
      ),
      style: {
        color: "#1B4280",
      },
    },
    {
      key: "2",
      label: (
        <span onClick={() => openMovConfigColumnHandler(props?.column)}>
          <RightCircleOutlined />{" "}
          {t("bpms.dashboard.boardn.column.btnConfigEvolutionStep")}
        </span>
      ),

      style: {
        color: "#1B4280",
      },
    },
  ];

  const resetFormStates = () => {
    setShowDescription(false);
    setShowHelpText(false);
    setShowRegexValidation(false);
    setShowAllowSignature(false);
    formField.resetFields();
  };

  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;

    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    if (/[^0-9]/g.test(value)) {
      e.target.value = value.replace(/[^0-9]/g, "");
    }
  };

  useEffect(() => {
    setShowDescription(false);
    setSizeDisable(true);
    setOpenFormStep(false);
  }, []);

  return (
    <div className="column">
      {props?.column.isStep && (
        <div className="column-content">
          <div
            className="column-content-header"
            style={{
              borderTop: `7px solid ${props?.column.color}`,
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <h6 style={{ color: props?.column.color, fontWeight: "bold" }}>
              {props?.column.name} ({props?.tasks?.length})
            </h6>

            {props?.isMyTask == null && props?.isMyPendingWork == null && (
              <div>
                {!props?.column?.finalStep &&
                  props?.column?.typeFinalStep !== "SIGNATURE" && (
                    <Dropdown
                      menu={props?.column?.initialStep ? { items } : { items }}
                    >
                      <MoreOutlined style={{ cursor: "pointer" }} />
                    </Dropdown>
                  )}
              </div>
            )}
          </div>

          <div className="column-content-body">
            <Droppable droppableId={props?.column?.id?.toString()}>
              {(provided) => (
                <div
                  className="task-list"
                  {...provided.droppableProps}
                  ref={(node) => provided.innerRef(node)}
                >
                  {props?.tasks.map((task, index) => (
                    <Task
                      key={task.id}
                      task={task}
                      index={index}
                      columnSelect={props?.column}
                      newTask={props?.newTask}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      )}

      {props?.isMyTask == null &&
        props?.isMyPendingWork == null &&
        !props?.column.isStep && (
          <div className="column-content">
            <Button
              className="column-content-header-btn"
              style={{ color: props?.column.color, fontWeight: "bold" }}
              onClick={() => setOpenNewColumn(true)}
            >
              {props?.column?.name}
            </Button>
          </div>
        )}

      <Modal open={openModalFormFields} footer={false}>
        {fields?.length == 0 && (
          <Empty
            description={
              <div style={{ textAlignLast: "center" }}>
                <p style={{ fontWeight: "bold" }}>
                  {t(
                    "bpms.dashboard.flow.flowColumn.modalTitleConfigPage2Text1"
                  )}
                </p>
                <p style={{ padding: "20px 10px" }}>
                  {t(
                    "bpms.dashboard.flow.flowColumn.modalTitleConfigPage2Text2"
                  )}
                </p>
              </div>
            }
          >
            <Space>
              <Button
                icon={<PlusOutlined />}
                onClick={() => setOpenFormStep(true)}
              >
                {t("bpms.dashboard.flow.flowColumn.btnAddField")}
              </Button>
            </Space>
          </Empty>
        )}

        {fields?.length > 0 && (
          <div className="papper-col">
            <Button
              icon={<PlusOutlined />}
              onClick={() => setOpenFormStep(true)}
              style={{ marginBottom: "10px" }}
            >
              {t("bpms.dashboard.flow.flowColumn.btnAddField")}
            </Button>
            <div className="papper-col-blank">
              <div className="papper-col-blank-title">
                <span>{props?.columnSelect?.name}</span>
              </div>
              {generate()}
            </div>
          </div>
        )}
        <br></br>
        <Space style={{ width: "100%", justifyContent: "end" }}>
          <Button
            icon={
              <CloseCircleOutlined
                style={{ fontSize: "18px", verticalAlign: "middle" }}
              />
            }
            key="back"
            onClick={() => closeColumn()}
          >
            {t("bpms.dashboard.flow.flowColumn.modalBtnClose")}
          </Button>
        </Space>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={650}
        title={
          formField.getFieldValue("id") == null
            ? t("bpms.dashboard.flow.flowColumn.modalFieldCreationTitle")
            : t("bpms.dashboard.flow.flowColumn.modalFieldEditTitle")
        }
        open={openFormStep}
        onCancel={() => closeAddField()}
        onOk={() => formField.submit()}
        okButtonProps={{ disabled: okDisabled }}
        okText={
          formField.getFieldValue("id") == null
            ? t("bpms.dashboard.flow.flowColumn.addDepartmentCostumAddTitle")
            : t("bpms.dashboard.flow.flowColumn.addDepartmentCostumUpdateTitle")
        }
        cancelText={t("bpms.dashboard.flow.flowColumn.modalBtnClose")}
        closable={false}
        style={{ height: "auto", overflowY: "auto" }}
      >
        <Spin spinning={loading}>
          <Form
            form={formField}
            layout="vertical"
            initialValues={{
              notNull: false,
            }}
            onFinish={() =>
              formField.getFieldValue("id") == null
                ? createField(null)
                : createField(formField.getFieldValue("id"))
            }
          >
            <div className="header">
              <p>
                {t("bpms.dashboard.flow.flowColumn.modalFieldCreationText")}
              </p>
            </div>
            <Form.Item
              name={`name`}
              label={t(
                "bpms.dashboard.flow.flowColumn.modalFieldCreationLabelInput1"
              )}
              rules={[{ required: true }]}
            >
              <Input maxLength={40} />
            </Form.Item>

            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Form.Item
                name={`type`}
                label={t(
                  "bpms.dashboard.boardn.formInit.modalFieldCreationLabelInput2"
                )}
                rules={[{ required: true }]}
              >
                <Select
                  onChange={handleTypeOfField}
                  options={typeFields.filter((option) => !option.disabled)}
                  style={{ width: "15vw" }}
                  disabled={formField.getFieldValue("id") != null}
                />
              </Form.Item>

              {!sizeDisable && (
                <Form.Item
                  name={`size`}
                  label={t(
                    "bpms.dashboard.boardn.formInit.modalFieldCreationLabelInput3"
                  )}
                  rules={[{ required: !props.sizeDisable }]}
                >
                  <TypedInputNumber
                    onKeyPress={handleKeyPress}
                    onChange={handleChange}
                    min={1}
                    max={9999}
                    style={{ width: "15vw" }}
                  />
                </Form.Item>
              )}
            </div>

            {showAllowSignature && (
              <Form.Item name="allowSignature">
                <Switch
                  checked={allowSignature}
                  onChange={setAllowSignature}
                  disabled={formField.getFieldValue("id") != null}
                />{" "}
                <span>
                  {t(
                    "bpms.dashboard.flow.flowColumn.modalFieldCreationAssignmentTItle"
                  )}
                </span>
              </Form.Item>
            )}

            <div style={{ display: "block" }}>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* <Form.Item name={`sharedInfo`} valuePropName="checked">
                <Switch />     <span >{t("bpms.dashboard.boardn.formInit.modalFieldCreationShareFieldTItle")}</span>
              </Form.Item> */}

                <Form.Item
                  name={`notNull`}
                  valuePropName="checked"
                  layout="horizontal"
                >
                  <Switch
                    defaultChecked
                    checked={notNull}
                    onChange={() => setNotNull(!notNull)}
                  />{" "}
                  <span>
                    {t(
                      "bpms.dashboard.boardn.formInit.modalFieldCreationMandatoryTItle"
                    )}
                  </span>
                </Form.Item>
              </div>

              <div style={{ display: "block" }}>
                {/* <Form.Item name={`showHelpText`} valuePropName="checked">
                <Switch onChange={openHelpText} />     <span >{t("bpms.dashboard.boardn.formInit.modalFieldCreationTextHelpTItle")}</span>
              </Form.Item> 

              {showHelpText && (
                <Form.Item name={`helpText`} >
                  <TextArea  maxLength={150} rows={3} />
                </Form.Item>
              )}*/}

                {/* <Form.Item name={`showRegexValidation`} valuePropName="checked">
                <Switch onChange={openRegexValidation} />     <span >{t("bpms.dashboard.boardn.formInit.modalFieldCreationCustomValidationTItle")}</span>
              </Form.Item>

              {showRegexValidation && (
                <Form.Item name={`regexValidation`}>
                  <TextArea  maxLength={150} rows={3} />
                </Form.Item>
              )} */}

                <Form.Item name={`showDescription`} valuePropName="checked">
                  <Switch
                    defaultChecked
                    checked={showDesciption}
                    onChange={openDescription}
                  />{" "}
                  <span>
                    {t(
                      "bpms.dashboard.boardn.formInit.modalFieldCreationDescriptionTItle"
                    )}
                  </span>
                </Form.Item>

                {showDesciption && (
                  <Form.Item name={`description`}>
                    <TextArea maxLength={150} rows={3} />
                  </Form.Item>
                )}
              </div>
            </div>
          </Form>
        </Spin>
      </Modal>

      <ViewColumn
        openViewColumn={openViewColumn}
        setOpenViewColumn={setOpenViewColumn}
        flow={props?.flow}
        getFlow={props.getFlow}
        columnSelect={columnSelect}
      />
      <ViewColumn
        openViewColumn={props?.openViewColumn}
        setOpenViewColumn={props?.setOpenViewColumn}
        flow={props?.flow}
        getFlow={props.getFlow}
        columnSelect={columnSelect}
      />
      <NewColumn
        openNewColumn={openNewColumn}
        setOpenNewColumn={setOpenNewColumn}
        flow={props?.flow}
        getFlow={props.getFlow}
      />
      <RemoveColumn
        openRemoveColumn={openRemoveColumn}
        setOpenRemoveColumn={setOpenRemoveColumn}
        fluxTemplate={props?.flow}
        getFlow={props.getFlow}
        columnSelect={columnSelect}
      />
      <MovCardConfig
        openMovConfig={openMovConfig}
        setOpenMovConfig={setOpenMovConfig}
        flow={props?.flow}
        getFlow={props.getFlow}
        columnSelect={columnSelect}
      />
      <SequenceSwitch
        stepId={props?.column?.stepId}
        flowId={props?.flow?.id}
        openModal={openModalSelectFormPosition}
        closeModal={setOpenModalSelectPosition}
      />
    </div>
  );
};

export default Column;
