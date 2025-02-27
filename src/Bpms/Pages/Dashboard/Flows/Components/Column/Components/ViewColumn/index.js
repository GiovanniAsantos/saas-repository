/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Result,
  Row,
  Select,
  Skeleton,
  Slider,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
} from "antd";
import "./style.module.css";
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  ClockCircleFilled,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RightCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Option } from "antd/es/mentions";
import { ChromePicker } from "react-color";
import { useTranslation } from "react-i18next";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";

const ViewColumn = (props) => {
  const [t] = useTranslation("global");

  const flowService = new FlowService();

  const [form] = Form.useForm();

  const [formDepartment] = Form.useForm();

  const [formAccountPermission] = Form.useForm();

  const [formExternalAccountPermission] = Form.useForm();

  const { TextArea } = Input;

  const [loading, setLoading] = useState(false);

  const [updateBtnDisabled, setUpdateBtnDisabled] = useState(false);

  const [loadingAddAccounts, setLoadingAddAccounts] = useState(false);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const [color, setColor] = useState("");

  const [showCreateValidatedBy, setShowCreateValidatedBy] = useState(false);

  const [activeSelectAccount, setActiveSelectAccount] = useState(true);

  const [editDepartment, setEditDepartment] = useState(false);

  const [departmentSelected, setDepartmentSelected] = useState();

  const [showAddDepartment, setShowAddDepartment] = useState(false);

  const [departmentsSelected, setDepartmentsSelected] = useState([]);

  const [departments, setDepartments] = useState([]);

  const [accountsSelected, setAccountsSelected] = useState([]);

  const [accountSelected, setAccountSelected] = useState();

  const [accounts, setAccounts] = useState([]);

  const [timeWorkingDays, setTimeWorkingDays] = useState(false);

  const [externalData, setExternalData] = useState([]);

  const [data, setData] = useState(externalData);

  const [timeUnit, setTimeUnit] = useState("DAY");
  const [timeValue, setTimeValue] = useState(0);
  const [timeAdmUnit, setTimeAdmUnit] = useState("DAY");
  const [timeAdmValue, setTimeAdmValue] = useState(0);
  const [isWorkingHours, setIsWorkingHours] = useState(false);

  const [openModalFormExternalEmail, setOpenModalFormExternalEmail] =
    useState(false);

  const [
    openModalSelectAccountPermissions,
    setOpenModalSelectAccountPermissions,
  ] = useState(false);

  const [statusStepName, setStatusStepName] = useState("");

  const [isDepartmentSelectDisabled, setIsDepartmentSelectDisabled] =
    useState(false);

  const [showResposibleAccounts, setShowResposibleAccounts] = useState(false);

  const [selectCreatorResponsible, setSelectCreatorResponsible] =
    useState(false);

  const [disableBtnAddDepartment, setDisableBtnAddDepartment] = useState(false);

  const [isOkButtonDepartmentDisabled, setIsOkButtonDepartmentDisabled] =
    useState(true);

  useEffect(() => {
    setIsOkButtonDepartmentDisabled(
      !(accountSelected && accountsSelected.length > 0)
    );
  }, [accountSelected, accountsSelected]);

  const iCON_WHITE_ORIGINAL_TRANSPARENT =
    process.env.REACT_APP_ICON_WHITE_ORIGINAL_TRANSPARENT;

  const handleCreatorResponsible = (value) => {
    formDepartment.setFieldsValue({ onlyTheCreator: value });
    setSelectCreatorResponsible(value);
    setDisableBtnAddDepartment(value);
  };

  const updateStep = async () => {
    setLoading(true);
    setUpdateBtnDisabled(true);

    let atributeValueInitialStep = false;
    if (props?.columnSelect?.sequence === 1) {
      atributeValueInitialStep = true;
    }

    let validatedBy = [];

    for (const doc of departmentsSelected) {
      let depTemp = {};
      depTemp.id = doc?.id;
      depTemp.departmentId = doc?.departmentId;
      let accountsIds = [];
      for (const acc of doc?.accountsIds) {
        accountsIds.push({
          accountId: acc.accountId,
          allowCardClosure: atributeValueInitialStep
            ? true
            : acc.allowCardClosure === undefined
            ? false
            : acc.allowCardClosure,
        });
      }
      depTemp.accounts = accountsIds;
      validatedBy.push(depTemp);
    }

    let request = {
      flowId: props?.flow?.id,
      name: form.getFieldValue("name"),
      description: form.getFieldValue("description"),
      sequence: props?.columnSelect?.sequence,
      action: form.getFieldValue("action"),
      sharedInfo: form.getFieldValue("sharedInfo"),
      color: color,
      validatedBy: validatedBy,
      notifyAdmIn: form.getFieldValue("notifyAdmIn"),
      admTimeUnity: form.getFieldValue("admTimeUnity"),
      time: form.getFieldValue("time"),
      timeUnit: form.getFieldValue("timeUnit"),
      timeWorkingDays: timeWorkingDays,
      finalStep: form.getFieldValue("finalStep"),
      onlyTheCreator: selectCreatorResponsible,
    };

    await flowService
      .ViewColumn(props?.columnSelect?.stepId, request)
      .then((response) => {
        form.resetFields();
        props.setOpenViewColumn(false);
        toast.success("Etapa atualizada com sucesso.");
        props.getFlow();
      })

      .catch((error) => {
        toast.error(error?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
        setUpdateBtnDisabled(false);
      });
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

  const [tabKey, setTabKey] = useState("0");

  const closeColumn = () => {
    props.setOpenViewColumn(false);
    setShowCreateValidatedBy(false);
    form.resetFields();
  };

  const getAccountsByDepartmentId = async (departmentId) => {
    await flowService.getAccountsByDepartmentId().then((response) => {
      setActiveSelectAccount(false);

      const departmentAccountsSemAccount =
        response.data?.departmentAccounts.map((item) => item.account);

      let list = departmentAccountsSemAccount
        ? departmentAccountsSemAccount?.map((e) => ({
            name: e.name,
            accountId: e.id,
          }))
        : [];

      setAccounts(list);
    });
  };

  const openAddDepartment = async (department) => {
    try {
      const response = await flowService
        .openAddDepartment()
        .then((response) => response);
      setDepartments(response.data);
    } catch (error) {}

    if (department != null) {
      setLoadingAddAccounts(true);
      setEditDepartment(true);
      setDepartmentSelected(department);
      setAccountsSelected(department?.accountsIds);
      getAccountsByDepartmentId(department?.departmentId);
      setSelectCreatorResponsible(false);

      setLoadingAddAccounts(false);
      setShowAddDepartment(true);
    }

    if (department == null) {
      formDepartment.resetFields();

      setEditDepartment(false);
      setDepartmentSelected(null);
      setAccountsSelected([]);
      setLoadingAddAccounts(false);
      setShowAddDepartment(true);
      setSelectCreatorResponsible();
    }
  };

  const removeDepartmnet = (department) => {
    let list = departmentsSelected;

    let index = list.findIndex(
      (d) => d?.departmentId === department?.departmentId
    );

    list.splice(index, 1);

    setDepartmentsSelected([...list]);
  };

  const closeAddDepartment = () => {
    setShowAddDepartment(false);
    setShowResposibleAccounts(false);
    setIsDepartmentSelectDisabled(false);
    formDepartment.resetFields();
  };

  const updateDepartmnet = () => {
    if (accountsSelected?.length == 0) {
      return toast.error("Adicione ao menos uma conta para este departamento.");
    }

    let list = departmentsSelected;

    let index = list.findIndex(
      (d) => d?.departmentId === departmentSelected?.departmentId
    );

    if (index != null) {
      let department = departments.filter(
        (d) => d?.id === departmentSelected?.departmentId
      )[0];

      list[index] = {
        departmentId: departmentSelected?.departmentId,
        departmentName: department?.name,
        accountsIds: accountsSelected,
      };
    }

    setAccountsSelected([]);
    setDepartmentSelected(null);
    setAccounts([]);
    setDepartmentsSelected(list);

    setActiveSelectAccount(false);

    formDepartment.resetFields();
    setShowAddDepartment(false);
    setEditDepartment(false);
  };

  const addDepartment = () => {
    let list = departmentsSelected;

    let department = departments.filter((d) => d?.id === departmentSelected)[0];

    let departmentFound = departmentsSelected.filter(
      (d) => d?.departmentId === departmentSelected
    )[0];

    if (departmentFound != null) {
      formDepartment.resetFields();
      setShowAddDepartment(false);
      return toast.error("Departamento já foi adiconado.");
    }

    list.push({
      departmentId: departmentSelected,
      departmentName: department?.name,
      accountsIds: accountsSelected,
    });

    setAccountsSelected([]);
    setDepartmentSelected(null);
    setAccounts([]);
    setDepartmentsSelected(list);

    setActiveSelectAccount(false);
    setIsDepartmentSelectDisabled(false);
    formDepartment.resetFields();
    setShowAddDepartment(false);
  };

  const activeSelectAccounts = (departmentId) => {
    setDepartmentSelected(departmentId);
    setActiveSelectAccount(true);
    getAccountsByDepartmentId(departmentId);
  };

  const handlerAccount = (accountId) => {
    let acc = accounts.filter((a) => a?.accountId === accountId)[0];
    let exist = false;
    for (const a of accountsSelected) {
      if (a.accountId === acc.accountId) {
        exist = true;
        break;
      }
    }

    if (exist) {
      return toast.warn("conta já selecionada");
    }

    setAccountSelected(acc);
    setOpenModalSelectAccountPermissions(true);
  };

  const handlerAddAccount = (values) => {
    let listAcc = accountsSelected;

    let accountSelectedConv = {};

    let accFound = accountsSelected.filter(
      (a) => a?.accountId === accountSelected.value
    )[0];

    if (accFound != null) {
      formDepartment.setFieldsValue({
        accountsIds: null,
      });
      setOpenModalSelectAccountPermissions(false);
      return toast.warning("Esta conta já foi inserida.");
    }

    accountSelectedConv.accountId = accountSelected.accountId;
    accountSelectedConv.name = accountSelected.name;
    accountSelectedConv.allowCardClosure = values.allowCardClosure;

    listAcc.push(accountSelectedConv);
    setAccountsSelected(listAcc);
    setOpenModalSelectAccountPermissions(false);
    formDepartment.setFieldsValue({
      accountsIds: null,
    });

    if (accountsSelected?.length > 0) {
      setIsDepartmentSelectDisabled(true);
    } else {
      setIsDepartmentSelectDisabled(false);
    }
    setIsOkButtonDepartmentDisabled(false);
    setShowResposibleAccounts(false);
    formAccountPermission.resetFields();
  };

  useEffect(() => {
    if (props?.columnSelect != undefined) {
      getStepName(false, props?.columnSelect?.finalStep);

      formDepartment.setFieldsValue({
        id: props?.columnSelect?.stepId,
        flowId: props?.flow?.id,
        name: props?.columnSelect?.name,
        description: props?.columnSelect?.description,
        sequence: props?.columnSelect?.sequence,
        sharedInfo: props?.columnSelect?.sharedInfo,
        notifyAdmIn: props?.columnSelect?.notifyAdmIn,
        admTimeUnity: props?.columnSelect?.admTimeUnity,
        time: props?.columnSelect?.time,
        timeUnit: props?.columnSelect?.timeUnit,
        timeWorkingDays: props?.columnSelect?.timeWorkingDays,
        color: props?.columnSelect?.color,
        finalStep: props?.columnSelect?.finalStep,
        initialStep: props?.columnSelect?.initialStep,
        onlyTheCreator: props?.columnSelect?.onlyTheCreator,
      });

      const listManagedBy =
        props?.columnSelect?.validatedBy?.lenght === 0
          ? []
          : props?.columnSelect?.validatedBy?.map((e) => ({
              departmentId: e?.departmentId,
              departmentName: e?.departmentName,
              accountsIds: e.accounts?.map((a) => a),
            }));

      setColor(props?.columnSelect?.color);
      setDepartmentsSelected(listManagedBy);
      setSelectCreatorResponsible(props?.columnSelect?.onlyTheCreator);
      setDisableBtnAddDepartment(props?.columnSelect?.onlyTheCreator);
      setTimeUnit(props?.columnSelect?.timeUnit);
      setTimeValue(props?.columnSelect?.time);
      setTimeAdmUnit(props?.columnSelect?.admTimeUnity);
      setTimeAdmValue(props?.columnSelect?.notifyAdmIn);
    }
  }, [props?.columnSelect]);

  const removeAccount = (index) => {
    const list = [...accountsSelected];
    list.splice(index, 1);
    setAccountsSelected(list);

    if (list?.length > 0) {
      setIsDepartmentSelectDisabled(true);
    } else {
      setIsDepartmentSelectDisabled(false);
    }
  };

  const columns = [
    {
      title: t("bpms.dashboard.flow.flowColumn.permissionNameTable"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("bpms.dashboard.flow.flowColumn.permissionActionsTable"),
      dataIndex: "Ações",
      key: "Ações",
      width: 80,
      className: "column-actions",
      render: (_, record, index) => (
        <>
          <Tooltip title="Remover conta" color="#2D415A">
            <Button
              style={{ marginRight: "5px" }}
              shape="round"
              className={"button-ver"}
              icon={<DeleteOutlined />}
              onClick={() => removeAccount(index)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  const columnsMiddleSteps = [
    {
      title: t("bpms.dashboard.flow.flowColumn.permissionNameTable"),
      dataIndex: "name",
      key: "name",
    },
    {
      title: t("bpms.dashboard.flow.flowColumn.permissionAllowToCancel"),
      dataIndex: "allowCardClosure",
      key: "allowCardClosure",
      width: 100,
      className: "column-actions",
      render: (_, record) => (
        <div>{record?.allowCardClosure ? "Sim" : "Não"}</div>
      ),
    },
    {
      title: t("bpms.dashboard.flow.flowColumn.permissionActionsTable"),
      dataIndex: "Ações",
      key: "Ações",
      width: 80,
      className: "column-actions",
      render: (_, record, index) => (
        <>
          <Tooltip title="Remover conta" color="#2D415A">
            <Button
              style={{ marginRight: "5px" }}
              shape="round"
              className={"button-ver"}
              icon={<DeleteOutlined />}
              onClick={() => removeAccount(index)}
            />
          </Tooltip>
        </>
      ),
    },
  ];

  const getStepName = (initialStep, finalStep) => {
    if (initialStep == true && finalStep == false) {
      setStatusStepName(
        t("bpms.dashboard.flow.flowColumn.modalStatusStepInitial")
      );
    }
    if (initialStep == false && finalStep == true) {
      setStatusStepName(
        t("bpms.dashboard.flow.flowColumn.modalStatusStepFinal")
      );
    }
  };

  useEffect(() => {
    getStepName(false, props?.columnSelect?.finalStep);
  }, [props?.columnSelect?.finalStep]);

  const handleSelectAllAccounts = (values) => {
    let listAcc = [];

    for (const acc of accounts) {
      let accountSelectedConv = {};
      accountSelectedConv.accountId = acc.accountId;
      accountSelectedConv.name = acc.name;
      accountSelectedConv.allowCardClosure = values.allowCardClosure;
      listAcc.push(accountSelectedConv);
    }

    setAccountsSelected(listAcc);
    setOpenModalSelectAccountPermissions(false);
    formDepartment.setFieldsValue({
      accountsIds: null,
    });
    setIsDepartmentSelectDisabled(true);
    setShowResposibleAccounts(false);
    formAccountPermission.resetFields();
  };

  const allAccounts = () => {
    setOpenModalSelectAccountPermissions(true);
    setShowResposibleAccounts(true);
  };

  const toggleTimeUnit = () => {
    const newUnit =
      timeUnit === "DAY" ? "HOUR" : timeUnit === "HOUR" ? "MINUTE" : "DAY";
    setTimeUnit(newUnit);
    form.setFieldsValue({ timeUnit: newUnit });
  };

  const toggleTimeAdmUnit = () => {
    const newUnit =
      timeAdmUnit === "DAY"
        ? "HOUR"
        : timeAdmUnit === "HOUR"
        ? "MINUTE"
        : "DAY";
    setTimeAdmUnit(newUnit);
    form.setFieldsValue({ admTimeUnity: newUnit });
  };

  const handleSliderChange = (value) => {
    setTimeValue(value);
    form.setFieldsValue({ time: value });
  };

  const handleSliderAdmChange = (value) => {
    setTimeAdmValue(value);
    form.setFieldsValue({ notifyAdmIn: value });
  };

  const onChangeSwitch = (values) => {
    setTimeWorkingDays(values);
  };

  const showModalFormExternalEmail = () => {
    setOpenModalFormExternalEmail(true);
  };

  const closeModalFormExternalEmail = () => {
    setOpenModalFormExternalEmail(false);
  };

  const createExternalAccount = async () => {
    setLoading(true);

    const request = {
      flowStepId: props?.columnSelect?.stepId,
      name: formExternalAccountPermission.getFieldValue("name"),
      email: formExternalAccountPermission.getFieldValue("email"),
      numberDocument:
        formExternalAccountPermission.getFieldValue("numberDocument"),
    };

    await flowService
      .createExternalAccount(request)
      .then((response) => {
        toast.success("Conta externa enviada com sucesso!");

        setExternalData((prevData) => [...prevData, request]);
      })
      .catch((error) => {
        toast.error("Erro ao enviar conta externa.");
      })
      .finally(() => {
        setLoading(false);
        setOpenModalFormExternalEmail(false);
      });
  };

  const fetchExternalData = async () => {
    setExternalData(props?.columnSelect?.validatedByExternal);
  };

  useEffect(() => {
    fetchExternalData();
  }, [props?.columnSelect]);

  const handleDeleteExternalAccount = async (index) => {
    try {
      const id = externalData[index]?.id;

      if (!id) {
        toast.error("ID não encontrado para deletar.");
        return;
      }

      const response = await flowService.handleDeleteExternalAccount(id);

      if (response.status === 200) {
        const updatedData = [...externalData].filter((_, idx) => idx !== index);
        setExternalData(updatedData);
        toast.success("Conta externa excluída com sucesso!");
      } else {
        toast.error("Erro ao excluir a conta externa.");
      }
    } catch (error) {
      console.error("Erro ao deletar conta externa:", error);
      toast.error("Erro ao deletar conta externa.");
    }
  };

  return (
    <div className="content-dnd">
      <Modal
        zIndex={2900}
        centered
        width={750}
        title={t("bpms.dashboard.flow.flowColumn.modalTitleConfigPage1")}
        open={props.openViewColumn}
        onCancel={() => closeColumn()}
        closable={false}
        closeIcon={false}
        footer={null}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            onFinish={updateStep}
            layout="vertical"
            initialValues={{
              id: props?.columnSelect?.stepId,
              name: props?.columnSelect?.name,
              description: props?.columnSelect?.description,
              action: props?.columnSelect?.action,
              color: props?.columnSelect?.color,
              sharedInfo: props?.columnSelect?.sharedInfo,
              notifyAdmIn: props?.columnSelect?.notifyAdmIn,
              admTimeUnity: props?.columnSelect?.admTimeUnity,
              time: props?.columnSelect?.time,
              timeUnit: props?.columnSelect?.timeUnit,
              timeWorkingDays: props?.columnSelect?.timeWorkingDays,
              finalStep: props?.columnSelect?.finalStep,
              initialStep: props?.columnSelect?.initialStep,
              parentStepId: props?.columnSelect?.parentStepId,
              flowId: props?.columnSelect?.flowId,
              departmentId:
                props?.columnSelect?.validatedBy == null
                  ? null
                  : props?.columnSelect?.validatedBy?.departmentId,
              accountId:
                props?.columnSelect?.validatedBy == null
                  ? null
                  : props?.columnSelect?.validatedBy?.account == null
                  ? null
                  : props?.columnSelect?.validatedBy?.account?.accountId,
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} xl={6} md={6}>
                <Form.Item
                  label={t("bpms.dashboard.flow.flowColumn.modalFomrItemColor")}
                  name="color"
                >
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
              <Col xs={24} xl={18} md={18}>
                <Form.Item
                  name={`name`}
                  label={t("bpms.dashboard.flow.flowColumn.modalFomrItemName")}
                  rules={[{ required: true }]}
                >
                  <Input
                    maxLength={20}
                    placeholder={t(
                      "bpms.dashboard.flow.flowColumn.modalInputName"
                    )}
                    className="inputMod"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={`description`}
              label={t(
                "bpms.dashboard.flow.flowColumn.modalFomrItemDescription"
              )}
            >
              <TextArea
                className="inputMod"
                maxLength={244}
                placeholder={t(
                  "bpms.dashboard.flow.flowColumn.modalInputDescription"
                )}
                autoSize={{ minRows: 3, maxRows: 5 }}
              />
            </Form.Item>

            <div>
              <h6>Configuração de (SLA)</h6>
              <span style={{ color: "gray" }}>
                Configure os tempos de alerta para responsáveis e superiores
              </span>
            </div>
            <br />

            <div style={{ marginTop: "8px", width: "55%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "gray" }}>
                  Configurações para Responsável:
                </span>
                <div style={{ display: "flex", fontSize: "16px" }}>
                  <ClockCircleFilled
                    style={{
                      marginRight: "8px",
                      marginBottom: "4px",
                      color: "gray",
                    }}
                  />
                  <span style={{ color: "gray" }}>{timeValue}</span>
                </div>
                <Form.Item name="timeUnit" noStyle>
                  <Button onClick={toggleTimeUnit}>
                    {timeUnit === "DAY" && "Dias"}
                    {timeUnit === "HOUR" && "Horas"}
                    {timeUnit === "MINUTE" && "Minutos"}
                  </Button>
                </Form.Item>
              </div>
              <Form.Item name="time" noStyle>
                <Tooltip
                  title={`Selecione o tempo em ${timeUnit?.toLowerCase()}`}
                >
                  <Slider
                    min={0}
                    max={
                      timeUnit === "DAY" ? 30 : timeUnit === "HOUR" ? 24 : 60
                    }
                    onChange={handleSliderChange}
                    value={timeValue}
                    style={{ width: "24rem" }}
                  />
                </Tooltip>
              </Form.Item>
              <Form.Item name="timeWorkingDays" valuePropName="checked">
                <Switch onChange={onChangeSwitch} />{" "}
                <span style={{ color: "gray" }}> Horário comercial</span>
              </Form.Item>
              <br />

              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span style={{ color: "gray" }}>
                  Configurações para Superior imediato:
                </span>
                <div style={{ display: "flex", fontSize: "16px" }}>
                  <ClockCircleFilled
                    style={{
                      marginRight: "8px",
                      marginBottom: "4px",
                      color: "gray",
                    }}
                  />
                  <span style={{ color: "gray" }}>{timeAdmValue}</span>
                </div>
                <Form.Item name="admTimeUnity" noStyle>
                  <Button onClick={toggleTimeAdmUnit}>
                    {timeAdmUnit === "DAY" && "Dias"}
                    {timeAdmUnit === "HOUR" && "Horas"}
                    {timeAdmUnit === "MINUTE" && "Minutos"}
                  </Button>
                </Form.Item>
              </div>
              <Form.Item name="notifyAdmIn" noStyle>
                <Tooltip
                  title={`Selecione o tempo em ${timeAdmUnit?.toLowerCase()}`}
                >
                  <Slider
                    min={0}
                    max={
                      timeAdmUnit === "DAY"
                        ? 30
                        : timeAdmUnit === "HOUR"
                        ? 24
                        : 60
                    }
                    onChange={handleSliderAdmChange}
                    value={timeAdmValue}
                    style={{ width: "24rem" }}
                  />
                </Tooltip>
              </Form.Item>
            </div>

            {!props?.columnSelect?.finalStep &&
              props?.columnSelect?.parentStepId == null && (
                <div>
                  <div>
                    <span style={{ fontSize: "15px" }}>Responsáveis:</span>
                    <br />
                    <br />
                    <div>
                      <Button onClick={showModalFormExternalEmail}>
                        Responsável Externo
                      </Button>
                      <div
                        style={{
                          marginTop: "10px",
                          maxHeight: "300px",
                          overflowY: "auto",
                        }}
                      >
                        <Card>
                          {Array.isArray(externalData) &&
                          externalData.length > 0 ? (
                            <ul style={{ padding: 0, margin: 0 }}>
                              {externalData.map((item, index) => (
                                <li
                                  key={index}
                                  style={{
                                    borderBottom: "1px solid #e8e8e8",
                                    padding: "10px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <strong>Nome:</strong> {item.name}
                                  <br />
                                  <strong>E-mail:</strong> {item.email}
                                  <Button
                                    variant="solid"
                                    danger
                                    size="small"
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() =>
                                      handleDeleteExternalAccount(index)
                                    }
                                  >
                                    <DeleteOutlined />
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p>Não há responsáveis externos.</p>
                          )}
                        </Card>
                      </div>
                    </div>
                    {props?.columnSelect?.validatedBy?.length == 0 &&
                      !showCreateValidatedBy &&
                      formDepartment.getFieldValue("onlyTheCreator") ==
                        false && (
                        <div style={{ textAlignLast: "center" }}>
                          <Space>
                            <Button
                              icon={<UserOutlined />}
                              onClick={() => setShowCreateValidatedBy(true)}
                            >
                              {t(
                                "bpms.dashboard.flow.flowColumn.btnDenineResposible"
                              )}
                            </Button>
                          </Space>
                        </div>
                      )}
                    <br />
                    {(props?.columnSelect?.validatedBy?.length > 0 ||
                      showCreateValidatedBy ||
                      formDepartment.getFieldValue("onlyTheCreator") ==
                        true) && (
                      <div>
                        <Col xs={24} xl={24}>
                          <div style={{ overflowY: "auto" }}>
                            <div className="papper-col">
                              <Space>
                                <Button
                                  disabled={disableBtnAddDepartment}
                                  icon={<PlusOutlined />}
                                  onClick={() => openAddDepartment(null)}
                                  style={{ marginBottom: "10px" }}
                                >
                                  {t(
                                    "bpms.dashboard.flow.flowColumn.btnAddDepartment"
                                  )}
                                </Button>
                                {departmentsSelected.length <= 0 && (
                                  <div
                                    style={{
                                      marginBottom: "10px",
                                      textAlign: "center",
                                    }}
                                  >
                                    <Switch
                                      defaultChecked={selectCreatorResponsible}
                                      onChange={(e) =>
                                        handleCreatorResponsible(e)
                                      }
                                    />{" "}
                                    <span>
                                      Criador da Atividade como responsável
                                    </span>
                                  </div>
                                )}
                              </Space>
                              <div className="papper-col-blank">
                                {(formDepartment.getFieldValue(
                                  "onlyTheCreator"
                                ) == false ||
                                  departmentsSelected.length > 0) && (
                                  <List
                                    bordered
                                    loading={loading}
                                    style={{ border: "0px", marginTop: "10px" }}
                                    dataSource={departmentsSelected}
                                    size="small"
                                    key={"list"}
                                    grid={{ gutter: 8, column: 2 }}
                                    renderItem={(department, index) => (
                                      <List.Item>
                                        <Skeleton
                                          avatar
                                          title={false}
                                          loading={loading}
                                          active
                                        >
                                          <Badge.Ribbon
                                            placement="end"
                                            text={
                                              department?.accountsIds
                                                ?.length === 0
                                                ? `${t(
                                                    "bpms.dashboard.flowConfig.btnAddDepartment"
                                                  )}`
                                                : `${t(
                                                    "bpms.dashboard.flowConfig.badgeTextSelectedAccounts"
                                                  )} (${
                                                    department?.accountsIds
                                                      ?.length
                                                  })`
                                            }
                                            color={"blue"}
                                          >
                                            <Card
                                              bordered={false}
                                              actions={[
                                                <Space>
                                                  <EditOutlined
                                                    onClick={() =>
                                                      openAddDepartment(
                                                        department
                                                      )
                                                    }
                                                  />{" "}
                                                  <DeleteOutlined
                                                    onClick={() =>
                                                      removeDepartmnet(
                                                        department
                                                      )
                                                    }
                                                  />
                                                </Space>,
                                              ]}
                                            >
                                              <Row>
                                                <Col>
                                                  <br />
                                                  <span>
                                                    {department?.departmentName}
                                                  </span>
                                                  <br />
                                                </Col>
                                              </Row>
                                            </Card>
                                          </Badge.Ribbon>
                                        </Skeleton>
                                      </List.Item>
                                    )}
                                  />
                                )}
                                {formDepartment.getFieldValue(
                                  "onlyTheCreator"
                                ) == true &&
                                  departmentsSelected.length <= 0 && (
                                    <div>
                                      <Result
                                        icon={
                                          <img
                                            src={
                                              iCON_WHITE_ORIGINAL_TRANSPARENT
                                            }
                                            style={{ width: "10%" }}
                                          />
                                        }
                                        title="ABA Blockchain"
                                        subTitle="O criador da Atividade foi selecionado como Responsável"
                                      />
                                    </div>
                                  )}
                              </div>
                              <br />
                              <br />
                            </div>
                          </div>
                          <br></br>
                        </Col>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
              <Button
                icon={
                  <CheckCircleOutlined
                    style={{ fontSize: "18px", verticalAlign: "middle" }}
                  />
                }
                key="submit"
                type="primary"
                onClick={() => updateStep()}
              >
                {t("bpms.dashboard.flow.flowColumn.modalBtnUpdate")}
              </Button>
            </Space>
          </Form>
        </Spin>
      </Modal>

      <Modal
        zIndex={2900}
        centered
        width={800}
        title={
          (editDepartment
            ? t("bpms.dashboard.flow.flowColumn.addDepartmentCostumUpdateTitle")
            : t("bpms.dashboard.flow.flowColumn.addDepartmentCostumAddTitle")) +
          t("bpms.dashboard.flow.flowColumn.addDepartmentCostum")
        }
        open={showAddDepartment}
        closable={false}
        closeIcon={false}
        footer={
          <Space>
            <Button onClick={closeAddDepartment}>
              {t("bpms.dashboard.boardn.createOrUpdate.modalBtnClose")}
            </Button>
            <Button
              type="primary"
              onClick={() =>
                editDepartment ? updateDepartmnet() : addDepartment()
              }
              disabled={isOkButtonDepartmentDisabled}
            >
              {editDepartment
                ? t(
                    "bpms.dashboard.flow.flowColumn.addDepartmentCostumUpdateTitle"
                  )
                : t(
                    "bpms.dashboard.flow.flowColumn.addDepartmentCostumAddTitle"
                  )}
            </Button>
          </Space>
        }
      >
        <Spin spinning={loadingAddAccounts} tip="Carregando...">
          <Form
            form={formDepartment}
            layout="vertical"
            initialValue={{
              departmentId: formDepartment.getFieldValue("departmentId"),
              accountsIds: formDepartment.getFieldValue("accountsIds"),
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} xl={24}>
                <p>
                  Configure aqui as contas que serão responsáveis pela Etapa.
                </p>
              </Col>
              {editDepartment && (
                <Col xs={24} xl={24}>
                  <RightCircleOutlined />
                  <span className="title">
                    {t("bpms.dashboard.flow.flowColumn.addDepartmentFormItem")}
                  </span>
                  <br />
                  <span className="backspace">
                    {departmentSelected?.departmentName}
                  </span>
                  <br />
                  <br />
                </Col>
              )}

              {!editDepartment && (
                <Col xs={24} xl={24}>
                  <Form.Item
                    name={`departmentId`}
                    label={t(
                      "bpms.dashboard.flow.flowColumn.addDepartmentFormItem"
                    )}
                    rules={[
                      {
                        required: true,
                        message: "Por favor, selecione o Departamento",
                      },
                    ]}
                  >
                    <Select
                      placeholder={t(
                        "bpms.dashboard.flow.flowColumn.addDepartmentSelect"
                      )}
                      onChange={(departmentId) => {
                        activeSelectAccounts(departmentId);
                      }}
                      disabled={isDepartmentSelectDisabled}
                    >
                      {departments
                        ?.filter((e) => e.departmentAccounts.length > 0)
                        ?.map((e) => (
                          <Option key={e?.id} value={e?.id}>
                            {e?.name}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
              )}

              <Col xs={24} sm={24} md={18} lg={18} xl={18}>
                <Form.Item name={`accountsIds`}>
                  <Select
                    disabled={
                      activeSelectAccount ||
                      accounts?.length == 0 ||
                      departmentSelected == null
                    }
                    placeholder={t(
                      "bpms.dashboard.flow.flowColumn.selectResponsibleAccounts"
                    )}
                    value={accountSelected}
                    onChange={(e) => handlerAccount(e)}
                    style={{ width: "100%" }}
                  >
                    {accounts?.map((e) => (
                      <Option key={e?.accountId} value={e?.accountId}>
                        {e?.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={6} lg={6} xl={6}>
                <Button
                  onClick={allAccounts}
                  disabled={
                    activeSelectAccount ||
                    accountsSelected?.length > 0 ||
                    departmentSelected == null
                  }
                >
                  {t(
                    "bpms.dashboard.flow.flowColumn.checkboxSelectAllAccounts"
                  )}
                </Button>
              </Col>
              <Col xs={24} xl={24}>
                <Table
                  scroll={{ y: 2400 }}
                  dataSource={[...accountsSelected]}
                  columns={
                    props?.columnSelect?.sequence === 1
                      ? columns
                      : columnsMiddleSteps
                  }
                />
              </Col>
            </Row>
          </Form>
        </Spin>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={650}
        title={t("bpms.dashboard.flow.flowColumn.permissionsAccount")}
        open={openModalSelectAccountPermissions}
        onCancel={() => setOpenModalSelectAccountPermissions(false)}
        onOk={() => formAccountPermission.submit()}
        okText={t("bpms.dashboard.flow.flowColumn.addDepartmentCostumAddTitle")}
        cancelText={t("bpms.dashboard.flow.flowColumn.modalBtnClose")}
        closable={false}
        closeIcon={false}
      >
        <Row>
          <Col span={24}>
            <span>
              Caso deseje, selecione a permissão abaixo para o responsável pela
              atividade.
            </span>
            <Divider>{t("bpms.dashboard.flow.flowColumn.permissions")}</Divider>
            <Form
              form={formAccountPermission}
              layout="vertical"
              onFinish={
                showResposibleAccounts
                  ? handleSelectAllAccounts
                  : handlerAddAccount
              }
            >
              <Form.Item name={`allowCardClosure`} valuePropName="checked">
                <Checkbox disabled={props?.columnSelect?.sequence === 1}>
                  {t("bpms.dashboard.flow.flowColumn.permissionsCheckBox8")}
                </Checkbox>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Modal>

      <Modal
        title="Formulário para Responsável Externo"
        zIndex={3000}
        onCancel={closeModalFormExternalEmail}
        open={openModalFormExternalEmail}
        footer={false}
      >
        <Spin spinning={loading}>
          <Form
            form={formExternalAccountPermission}
            onFinish={createExternalAccount}
          >
            <Form.Item
              name={`email`}
              label="E-mail"
              rules={[
                { required: true, message: "O campo E-mail é obrigatório." },
                { type: "email", message: "Insira um E-mail válido." },
              ]}
            >
              <Input
                placeholder="Insira o E-mail do responsável"
                className="inputMod"
              />
            </Form.Item>

            <Form.Item
              name={`name`}
              label="Nome"
              rules={[
                { required: true, message: "O campo Nome é obrigatório." },
              ]}
            >
              <Input
                maxLength={30}
                placeholder="Insira o Nome do responsável"
                className="inputMod"
                onKeyPress={(e) => {
                  const char = String.fromCharCode(e.charCode);
                  if (!/^[a-zA-Z\s]+$/.test(char)) {
                    e.preventDefault(); // Bloqueia caracteres inválidos
                  }
                }}
              />
            </Form.Item>

            <Form.Item
              name={`numberDocument`}
              label="CPF"
              rules={[
                { required: true, message: "O campo CPF é obrigatório." },
                {
                  validator: (_, value) => {
                    if (!/^\d{11}$/.test(value)) {
                      return Promise.reject("CPF inválido. Insira 11 números.");
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input
                maxLength={11}
                placeholder="Insira o CPF do responsável"
                className="inputMod"
                onKeyPress={(e) => {
                  const char = String.fromCharCode(e.charCode);
                  if (!/^\d$/.test(char)) {
                    e.preventDefault(); // Bloqueia caracteres que não sejam números
                  }
                }}
              />
            </Form.Item>

            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Space>
                <Button onClick={() => closeModalFormExternalEmail()}>
                  Fechar
                </Button>
                <Button type="primary" htmlType="submit">
                  Enviar Dados
                </Button>
              </Space>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default ViewColumn;
