/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import "./style.module.css";

import {
  CloseCircleOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import TypedInputNumber from "antd/es/input-number";
import { useTranslation } from "react-i18next";
import FieldAtt from "../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldAtt";
import FieldCoin from "../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldCoin";
import FieldDateTime from "../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldDateTime";
import FieldDate from "../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldDate";
import FieldNumber from "../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldNumber";
import FieldText from "../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldText";
import FieldTextArea from "../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldTextArea";
import FieldTextDinamic from "../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldTextDinamic";
import { FieldService } from "@/src/Services/Bpms/FieldsServices/FieldService";

const FormInit = (props) => {
  const [t] = useTranslation("global");

  const fieldService = new FieldService();

  const { TextArea } = Input;

  const [form] = Form.useForm();

  const [formField] = Form.useForm();

  const [onClose, setOnClose] = useState(false);

  const [fields, setFields] = useState([]);

  const [loading, setLoading] = useState(false);

  const [okDisabled, setOkDisabled] = useState(false);

  const [createFlexFieldModalVisible, setCreateFlexFieldModalVisible] =
    useState(false);

  const [sizeDisable, setSizeDisable] = useState(true);

  const [showDesciption, setShowDescription] = useState(false);

  const [showHelpText, setShowHelpText] = useState(false);

  const [showRegexValidation, setShowRegexValidation] = useState(false);

  const [typeFields, setTypeFields] = useState([]);

  const [notNull, setNotNull] = useState(false);

  const getTypeFields = async () => {
    try {
      const response = await fieldService.getTypeFields();
      setTypeFields(response?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setOnClose(false);
    }
  };

  const closeAddField = () => {
    setShowDescription(false);
    setCreateFlexFieldModalVisible(false);
    formField.resetFields();
    setSizeDisable(true);
  };

  const removeField = async (fieldId) => {
    setOnClose(true);

    await fieldService
      .removeField(fieldId)
      .then((response) => {
        formField.resetFields();
        toast.success("Campo removido com sucesso.");
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        setOnClose(false);
      });
  };

  const handleTypeOfField = (fieldValue) => {
    if (fieldValue === "TEXT" || fieldValue === "TEXTAREA") {
      setSizeDisable(false);
    } else {
      setSizeDisable(true);
      formField.setFieldValue("size", null);
    }
  };

  useEffect(() => {
    getTypeFields();

    if (props?.flow?.formInitial != null) {
      setFields(props?.flow?.formInitial?.fields);
    }

    if (!createFlexFieldModalVisible) {
      setShowDescription(false);
      setShowHelpText(false);
      setShowRegexValidation(false);
    }
  }, [props?.flow?.formInitial]);

  const getFieldById = async (fieldId) => {
    await fieldService
      .getFieldById(fieldId)
      .then((response) => {
        formField.setFieldsValue({
          id: fieldId,
          name: response?.data?.name,
          size: response?.data?.size,
          type: response?.data?.type,
          notNull: response?.data?.notNull,
          sharedInfo: response?.data?.sharedInfo,
          stepId: props?.column?.stepId,
          helpText: props?.column?.helpText,
          description: props?.column?.description,
          regexValidation: props?.column?.regexValidation,
        });

        setCreateFlexFieldModalVisible(true);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createField = async (fieldId) => {
    setOkDisabled(true);
    setLoading(true);

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
      description:
        formField.getFieldValue("description") === undefined
          ? null
          : formField.getFieldValue("description"),
      regexValidation:
        formField.getFieldValue("regexValidation") === undefined
          ? null
          : formField.getFieldValue("regexValidation"),
      formInitialId: props?.flow?.formInitial?.id,
    };

    if (request?.type === "ATTACHMENT") {
      const attConfig = {
        allowSignature: formField.getFieldValue("allowSignature"),
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

    await fieldService
      .createField(request)
      .then((response) => {
        setCreateFlexFieldModalVisible(false);
        setShowDescription(false);

        if (fieldId == null) {
          toast.success("Campo adicionado com sucesso.");
        } else {
          toast.success("Campo atualizado com sucesso.");
        }

        formField.resetFields();

        //getFields();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        setOkDisabled(false);
        setLoading(false);
      });
  };

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

  const openDescription = (value) => {
    setShowDescription(value);
  };

  const openHelpText = (value) => {
    setShowHelpText(value);
  };

  const openRegexValidation = (value) => {
    setShowRegexValidation(value);
  };

  const footer = () => {
    let elements = [];

    elements.push(
      <Tooltip title="Fechar modal">
        <Button
          key="Fechar"
          icon={
            <CloseCircleOutlined
              style={{ fontSize: "18px", verticalAlign: "middle" }}
            />
          }
          onClick={() => {
            props.setOpenInitForm(false);
            setOnClose(false);
          }}
        >
          {t("bpms.dashboard.boardn.formInit.modalBtnClose")}
        </Button>
      </Tooltip>
    );

    return elements;
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

  return (
    <div className="content-dnd">
      <Modal
        zIndex={2900}
        style={{
          overflowY: "-moz-hidden-unscrollable",
          overflowX: "-moz-hidden-unscrollable",
          maxHeight: "calc(150vh - 200px)",
        }}
        centered
        width={600}
        title={t("bpms.dashboard.boardn.formInit.modalFomrInitTitle")}
        open={props.openInitForm}
        onCancel={() => props.setOpenInitForm(false)}
        closable={false}
        closeIcon={false}
        footer={footer()}
      >
        <Spin spinning={onClose}>
          <Form form={form} layout="vertical">
            <div style={{ overflowY: "auto" }}>
              <div className="papper-col">
                <Button
                  icon={
                    <PlusCircleOutlined
                      style={{ fontSize: "18px", verticalAlign: "middle" }}
                    />
                  }
                  onClick={() => setCreateFlexFieldModalVisible(true)}
                  style={{ marginBottom: "10px" }}
                >
                  {t("bpms.dashboard.boardn.formInit.btnAddField")}
                </Button>
                <div className="papper-col-blank">
                  <div className="papper-col-blank-title">
                    <span>
                      {props?.flow?.name}{" "}
                      <i style={{ fontWeight: "normal" }}>
                        {t("bpms.dashboard.boardn.formInit.preView")}
                      </i>
                    </span>
                  </div>
                  {generate()}
                </div>
              </div>
            </div>
          </Form>
        </Spin>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={650}
        title={t("bpms.dashboard.boardn.formInit.modalFieldCreationTitle")}
        open={createFlexFieldModalVisible}
        onCancel={() => closeAddField()}
        onOk={() => formField.submit()}
        okButtonProps={{ disabled: okDisabled }}
        okText={t("bpms.dashboard.boardn.formInit.btnCreate")}
        cancelText={t("bpms.dashboard.boardn.formInit.modalBtnClose")}
        closable={false}
        closeIcon={false}
        style={{ height: "auto", overflowY: "auto" }}
      >
        <Spin
          indicator={<LoadingOutlined spin />}
          size="small"
          spinning={loading}
        >
          <Form
            form={formField}
            layout="vertical"
            onFinish={() =>
              formField.getFieldValue("id") == null
                ? createField(null)
                : createField(formField.getFieldValue("id"))
            }
          >
            <Form.Item name={`id`} style={{ display: "none" }} />

            <Form.Item
              name={`name`}
              label={t(
                "bpms.dashboard.boardn.formInit.modalFieldCreationLabelInput1"
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
                  options={typeFields?.filter((option) => !option.disabled)}
                  style={{ width: "15vw" }}
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
                    disabled={sizeDisable}
                    min={1}
                    max={9999}
                    style={{
                      width: "15vw",
                    }}
                  />
                </Form.Item>
              )}
            </div>

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
              )}

              <Form.Item name={`showRegexValidation`} valuePropName="checked">
                <Switch onChange={openRegexValidation} />     <span >{t("bpms.dashboard.boardn.formInit.modalFieldCreationCustomValidationTItle")}</span>
              </Form.Item>

              {showRegexValidation && (
                <Form.Item name={`regexValidation`}>
                  <TextArea  maxLength={150} rows={3} />
                </Form.Item>
              )} */}

                <Form.Item name={`showDescription`} valuePropName="checked">
                  <Switch onChange={openDescription} />{" "}
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
    </div>
  );
};

export default FormInit;
