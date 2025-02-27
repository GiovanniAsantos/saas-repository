/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";

import {
  Avatar,
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
  Radio,
  Row,
  Select,
  Skeleton,
  Space,
  Table,
  Tooltip,
} from "antd";
import "./style.module.css";

import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RightCircleOutlined
} from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import dayjs from "dayjs";
import { ChromePicker } from "react-color";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const Config = (props) => {
  const [t] = useTranslation("global");
  const flowService = new FlowService();
  const [typeManagedBy, setTypeManagedBy] = useState("ONLY");
  const [editDepartmentManagedBy, setEditDepartmentManagedBy] = useState(false);
  const [departmentsManagedBy, setDepartmentsManagedBy] = useState([]);
  const [activeSelectManagedByAccount, setActiveSelectManagedByAccount] =
  useState(true);
  const [accountManagedBySelected, setAccountManagedBySelected] = useState();
  const [accountsManagedBy, setAccountsManagedBy] = useState([]);
  const [accountsManagedBySelected, setAccountsManagedBySelected] = useState(
    []
  );
  const [showResposibleAccountsManagedBy, setShowResposibleAccountsManagedBy] =
    useState(false);

  const [formManagedBy] = Form.useForm();
  const [form] = Form.useForm();
  const [formRemove] = Form.useForm();
  const [formSuspend] = Form.useForm();
  const [formOpenedBy] = Form.useForm();
  const [formDepartment] = Form.useForm();
  const [formAccountPermission] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [classificacoes, setClassificacoes] = useState([]);

  const [openRemoveFlow, setOpenRemoveFlow] = useState(false);
  const [openSuspendFlow, setOpenSuspendFlow] = useState(false);

  const [icons, setIcons] = useState([]);

  const [accountsOpenedBy, setAccountsOpenedBy] = useState([]);

  const [activeSelectOpenedByAccount, setActiveSelectOpenedByAccount] =
    useState(true);

  const [departmentsOpenedBy, setDepartmentsOpenedBy] = useState([]);

  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [showAddDepartmentOpenedBy, setShowAddDepartmentOpenedBy] =
    useState(false);

  const [typeOpenedBy, setTypeOpenedBy] = useState("ALL");

  const [openedByaccountSelected, setOpenedByAccountSelected] = useState([]);

  const [departmentOpenedBySelected, setDepartmentOpenedBySelected] =
    useState();
  const [departmentsOpenedBySelected, setDepartmentsOpenedBySelected] =
    useState([]);

  const [editDepartmentOpenedBy, setEditDepartmentOpenedBy] = useState(false);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [color, setColor] = useState("#3a4862");

  const [showResposibleAccountsOpenedBy, setShowResposibleAccountsOpenedBy] =
    useState(true);

  const [isDepartmentSelectDisabled, setIsDepartmentSelectDisabled] =
    useState(false);

  const [
    openModalSelectAccountPermissions,
    setOpenModalSelectAccountPermissions,
  ] = useState(false);

  const close = () => {
    props.setOpenConfig(false);
    //form.resetFields();
    setShowResposibleAccountsOpenedBy(true);
  };

  const allAccountsManagedBy = () => {
    setShowResposibleAccountsManagedBy(true);
    setOpenModalSelectAccountPermissions(true);
  };

  const getAccountsByDepartmentId = async (managedBy, openedBy) => {
    await flowService.getAccountsByDepartmentId.then((response) => {
      const departmentAccountsSemAccount =
        response.data?.departmentAccounts.map((item) => item.account);

      let list = departmentAccountsSemAccount
        ? departmentAccountsSemAccount?.map((e) => ({
            label: e.name,
            value: e.id,
          }))
        : [];

      if (openedBy) {
        setActiveSelectOpenedByAccount(false);
        setAccountsOpenedBy(list);
      }
    });
  };

  const findAllDepartments = async (managedBy, openedBy) => {
    await flowService.findAllDepartments().then((response) => {
      if (openedBy) {
        setDepartmentsOpenedBy(response.data);
      }
    });
  };

  useEffect(() => {
    findAllDepartments(true, true);
    form.setFieldsValue({
      id: props?.flow?.id,
      name: props?.flow?.name,
      description: props?.flow?.description,
      icon: props?.flow?.config?.iconName,
      color: props?.flow?.config?.color,
      typeOpenedBy: props?.flow?.config?.typeOpenedBy,
      typeManagedBy: props?.flow?.config?.typeManagedBy,
      openedBy: props?.flow?.config?.openedBy,
      managedBy: props?.flow?.config?.managedBy,
      nameButtonCreateTask: props?.flow?.config?.nameButtonCreateTask,
    });

    const listOpenedBy =
      props?.flow?.config?.openedBy?.length === 0
        ? []
        : props?.flow?.config?.openedBy?.map((e) => ({
            departmentId: e?.department?.id,
            departmentName: e?.department?.name,
            accountsIds: e.accounts?.map((a) => a.id),
          }));
    const listManagedBy =
      props?.flow?.config?.managedBy?.length === 0
        ? []
        : props?.flow?.config?.managedBy?.map((e) => ({
            departmentId: e?.department?.id,
            departmentName: e?.department?.name,
            accountsIds: e.accounts?.map((a) => a.id),
          }));

    setColor(props?.flow?.config?.color);
    setTypeOpenedBy(props?.flow?.config?.typeOpenedBy);

    setDepartmentsOpenedBySelected(listOpenedBy);
  }, [props?.flow]);

  const onUpdate = async (values) => {
    setLoading(true);

    let tempOpenedBy = [];

    if (typeOpenedBy === "CUSTOM") {
      for (let d of departmentsOpenedBySelected) {
        let accountIds = d.accountsIds?.map((a) => {
          if (a?.value == undefined) {
            return a;
          } else {
            return a?.value;
          }
        });

        if (accountIds == undefined) {
          d.accountIds = d.accountsIds;
        } else {
          d.accountIds = accountIds;
        }

        tempOpenedBy.push(d);
      }
    }

    let tempManagedBy = [];

    if (typeManagedBy === "CUSTOM") {
      for (let d of departmentsManagedBySelected) {
        let accountIds = d.accountsIds?.map((a) => {
          if (a?.value == undefined) {
            return a;
          } else {
            return a?.value;
          }
        });

        if (accountIds == undefined) {
          d.accountIds = d.accountsIds;
        } else {
          d.accountIds = accountIds;
        }

        tempManagedBy.push(d);
      }

      //tempManagedBy = departmentsManagedBySelected?.map?((a) => ({departmentId: a.departmentId, accountIds: a.accountsIds?.map((ac) => ac.value)}));
    }

    let request = {
      name: form.getFieldValue("name"),
      description: form.getFieldValue("description"),
      //typeOfTemporality: form.getFieldValue("typeOfTemporality"),
      //urgencyClassificationId: form.getFieldValue("urgencyClassificationId") === undefined ? null : form.getFieldValue("urgencyClassificationId"),
      config: {
        icon: form.getFieldValue("icon"),
        color: color,
        nameButtonCreateTask: form.getFieldValue("nameButtonCreateTask"),
        typeOpenedBy: typeOpenedBy,
        typeManagedBy: typeManagedBy,
        openedBy: tempOpenedBy,
        managedBy: tempManagedBy,
      },
    };

    try {
      const response = await flowService.onUpdate(
        props?.flow?.id,
        request
      );
      toast.success("Fluxo Atualizado com Sucesso.");
      props?.getFlow();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const remmoveFlow = async () => {
    try {
      if (formRemove.getFieldValue("message") != "Excluir") {
        return toast.warning("Palavra não bate com o exigido.");
      }

      const response = await flowService.remmoveFlow(props?.flow?.id)
      setOpenRemoveFlow(false);
      toast.success(response?.data?.message);
      route.push(`/bpms`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
    }
  };

  const suspendFlow = async () => {
    try {
      if (formSuspend.getFieldValue("message") != "Suspender") {
        return toast.warning("Palavra não bate com o exigido.");
      }

      const response = await flowService.suspendFlow(props?.flow?.id);
      setOpenSuspendFlow(false);
      toast.success(response?.data?.message);
      route.push(`/bpms`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
    }
  };

  const releaseVersion = async () => {
    try {
      const response = await flowService.releaseVersion(props?.flow?.id);
      toast.success("Fluxo foi liberado para uso.");
      route.push(`/bpms`);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
    }
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
            close();
          }}
        >
          {t("bpms.dashboard.flowConfig.modalBtnClose")}
        </Button>
      </Tooltip>
    );

    elements.push(
      <Tooltip title="Fechar modal">
        <Button
          type="primary"
          key="Fechar"
          icon={
            <CheckCircleOutlined
              style={{ fontSize: "18px", verticalAlign: "middle" }}
            />
          }
          htmlType="submit"
          onClick={() => {
            onUpdate();
          }}
        >
          {t("bpms.dashboard.flowConfig.modalBtnUpdate")}
        </Button>
      </Tooltip>
    );

    return elements;
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
      borderRadius: "14px",
      background: colorColumn,
    };
  };

  const sColor = {
    width: "90px",
    height: "60px",
    borderRadius: "14px",
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

  const handleClick = () => {
    setDisplayColorPicker(true);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (color) => {
    setColor(color.hex);
  };

  const openAddDepartmentOpenedBy = (department) => {
    if (department != null) {
      getAccountsByDepartmentId(department?.departmentId, false, true);

      setEditDepartmentOpenedBy(true);
      setDepartmentOpenedBySelected(department?.departmentId);

      formOpenedBy.setFieldsValue({
        departmentId: department?.departmentId,
        accountsIds: department?.accountsIds,
      });
    }

    setShowAddDepartmentOpenedBy(true);
  };

  const closeAddDepartmentOpenedBy = () => {
    formOpenedBy.resetFields();
    setShowAddDepartmentOpenedBy(false);
    setEditDepartmentOpenedBy(false);
    setShowResposibleAccountsOpenedBy(true);
    setIsDepartmentSelectDisabled(false);
  };

  const handlerAccountdOpenedBy = (values) => {
    let listAcc = [];

    for (const value of values) {
      let acc = accountsOpenedBy.filter((a) => a?.value === value)[0];
      listAcc.push(acc);
    }

    setOpenedByAccountSelected(listAcc);
  };

  const addDepartmentOpenedBy = () => {
    let list = departmentsOpenedBySelected;

    let department = departmentsOpenedBy.filter(
      (d) => d?.id === departmentOpenedBySelected
    )[0];

    let departmentFound = departmentsOpenedBySelected.filter(
      (d) => d?.departmentId === departmentOpenedBySelected
    )[0];

    if (departmentFound != null) {
      formOpenedBy.resetFields();
      setShowAddDepartmentOpenedBy(false);
      return toast.error("Departamento já foi adiconado.");
    }

    list.push({
      departmentId: departmentOpenedBySelected,
      departmentName: department?.name,
      accountsIds: openedByaccountSelected,
    });

    setOpenedByAccountSelected([]);
    setDepartmentOpenedBySelected(null);
    setAccountsOpenedBy([]);
    setDepartmentsOpenedBySelected(list);
    setActiveSelectOpenedByAccount(false);
    setIsDepartmentSelectDisabled(false);
    formOpenedBy.resetFields();
    setShowAddDepartmentOpenedBy(false);
    setEditDepartmentOpenedBy(false);
  };

  const updateDepartmnetOpenedBy = () => {
    let list = departmentsOpenedBySelected;

    let index = list.findIndex(
      (d) => d?.departmentId === departmentOpenedBySelected
    );

    if (index != null) {
      let department = departmentsOpenedBy.filter(
        (d) => d?.id === departmentOpenedBySelected
      )[0];

      list[index] = {
        departmentId: departmentOpenedBySelected,
        departmentName: department?.name,
        accountsIds: openedByaccountSelected,
      };
    }

    setOpenedByAccountSelected([]);
    setDepartmentOpenedBySelected(null);
    setAccountsOpenedBy([]);
    setDepartmentsOpenedBySelected(list);

    setActiveSelectOpenedByAccount(false);

    formOpenedBy.resetFields();
    setShowAddDepartment(false);
    setShowAddDepartmentOpenedBy(false);
    setEditDepartmentOpenedBy(false);
  };

  const removeDepartmnetOpenedBy = (department) => {
    let list = departmentsOpenedBySelected;

    let index = list.findIndex(
      (d) => d?.departmentId === department?.departmentId
    );

    list.splice(index, 1);

    setDepartmentsOpenedBySelected([...list]);
  };

  const activeSelectAccountsOpenedBy = (departmentId) => {
    setDepartmentOpenedBySelected(departmentId);
    getAccountsByDepartmentId(departmentId, false, true);
  };

  const getSelectAccountsOpenedBy = (e) => {
    formOpenedBy.setFieldsValue({ accountsIds: null });
    if (e.target.checked == true) {
      setAccountsOpenedBy([]);
      setOpenedByAccountSelected([]);
    }

    setShowResposibleAccountsOpenedBy(e.target.checked);
  };

  const columns = [
    {
      title: t("bpms.dashboard.boardn.createOrUpdate.actionsPermissionaTitle"),
      dataIndex: "Ações",
      key: "Ações",
      width: 80,
      className: "column-actions",
      render: (_, record, index) => (
        <>
          <Tooltip
            title={t(
              "bpms.dashboard.boardn.createOrUpdate.permissionsTitleRemoveAccount"
            )}
            color="#2D415A"
          >
            <Button
              style={{ marginRight: "5px" }}
              shape="round"
              className={"button-ver"}
              icon={<DeleteOutlined />}
              onClick={() => removeManagedByAccount(index)}
            />
          </Tooltip>
        </>
      ),
    },
    {
      title: t(
        "bpms.dashboard.boardn.createOrUpdate.actionsPermissionaNameTitle"
      ),
      dataIndex: "name",
      key: "name",
      width: 400,
    },
    {
      title: t("bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox2"),
      dataIndex: "allowFlowUpdate",
      key: "allowFlowUpdate",
      width: 212,
      className: "column-actions",
      render: (_, record) => (
        <div>
          {record?.allowFlowUpdate
            ? `${t("bpms.dashboard.boardn.createOrUpdate.permissionsYesBtn")}`
            : `${t("bpms.dashboard.boardn.createOrUpdate.permissionsNoBtn")}`}
        </div>
      ),
    },
    {
      title: t("bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox1"),
      dataIndex: "allowFlowRemove",
      key: "allowFlowRemove",
      width: 212,
      className: "column-actions",
      render: (_, record) => (
        <div>
          {record?.allowFlowRemove
            ? `${t("bpms.dashboard.boardn.createOrUpdate.permissionsYesBtn")}`
            : `${t("bpms.dashboard.boardn.createOrUpdate.permissionsNoBtn")}`}
        </div>
      ),
    },
    {
      title: t("bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox6"),
      dataIndex: "allowFlowReleased",
      key: "allowFlowReleased",
      width: 212,
      className: "column-actions",
      render: (_, record) => (
        <div>
          {record?.allowFlowReleased
            ? `${t("bpms.dashboard.boardn.createOrUpdate.permissionsYesBtn")}`
            : `${t("bpms.dashboard.boardn.createOrUpdate.permissionsNoBtn")}`}
        </div>
      ),
    },
    {
      title: t("bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox7"),
      dataIndex: "allowFlowSuspend",
      key: "allowFlowSuspend",
      width: 212,
      className: "column-actions",
      render: (_, record) => (
        <div>
          {record?.allowFlowSuspend
            ? `${t("bpms.dashboard.boardn.createOrUpdate.permissionsYesBtn")}`
            : `${t("bpms.dashboard.boardn.createOrUpdate.permissionsNoBtn")}`}
        </div>
      ),
    },
    {
      title: t("bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox4"),
      dataIndex: "allowFlowStepUpdate",
      key: "allowFlowStepUpdate",
      width: 220,
      className: "column-actions",
      render: (_, record) => (
        <div>
          {record?.allowFlowStepUpdate
            ? `${t("bpms.dashboard.boardn.createOrUpdate.permissionsYesBtn")}`
            : `${t("bpms.dashboard.boardn.createOrUpdate.permissionsNoBtn")}`}
        </div>
      ),
    },
    {
      title: t("bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox3"),
      dataIndex: "allowFlowStepRemove",
      key: "allowFlowStepRemove",
      width: 240,
      className: "column-actions",
      render: (_, record) => (
        <div>
          {record?.allowFlowStepRemove
            ? `${t("bpms.dashboard.boardn.createOrUpdate.permissionsYesBtn")}`
            : `${t("bpms.dashboard.boardn.createOrUpdate.permissionsNoBtn")}`}
        </div>
      ),
    },
    {
      title: t("bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox5"),
      dataIndex: "allowFlowStepTaskRemove",
      key: "allowFlowStepTaskRemove",
      width: 240,
      className: "column-actions",
      render: (_, record) => (
        <div>
          {record?.allowFlowStepTaskRemove
            ? `${t("bpms.dashboard.boardn.createOrUpdate.permissionsYesBtn")}`
            : `${t("bpms.dashboard.boardn.createOrUpdate.permissionsNoBtn")}`}
        </div>
      ),
    },
  ];

  const handlerAddAccountManagedBy = (values) => {
    let listAcc = accountsManagedBySelected;

    let accountSelectedConv = {};

    let accFound = accountsManagedBySelected.filter(
      (a) => a?.accountId === accountManagedBySelected.accountId
    )[0];

    if (accFound != null) {
      formManagedBy.setFieldsValue({
        accountsIds: null,
      });
      setOpenModalSelectAccountPermissions(false);
      return toast.warning("Esta conta já foi inserida.");
    }

    accountSelectedConv.id = accountManagedBySelected.id;
    accountSelectedConv.accountId = accountManagedBySelected.accountId;
    accountSelectedConv.name = accountManagedBySelected.name;
    accountSelectedConv.allowFlowRemove =
      values.allowFlowRemove === undefined ? false : true;
    accountSelectedConv.allowFlowUpdate =
      values.allowFlowUpdate === undefined ? false : true;
    accountSelectedConv.allowFlowReleased =
      values.allowFlowReleased === undefined ? false : true;
    accountSelectedConv.allowFlowSuspend =
      values.allowFlowSuspend === undefined ? false : true;
    accountSelectedConv.allowFlowStepRemove =
      values.allowFlowStepRemove === undefined ? false : true;
    accountSelectedConv.allowFlowStepUpdate =
      values.allowFlowStepUpdate === undefined ? false : true;
    accountSelectedConv.allowFlowStepTaskRemove =
      values.allowFlowStepTaskRemove === undefined ? false : true;
    accountSelectedConv.allowCardClosure =
      values.allowCardClosure === undefined ? false : true;

    listAcc.push(accountSelectedConv);
    setAccountsManagedBySelected(listAcc);
    setOpenModalSelectAccountPermissions(false);
    formManagedBy.setFieldsValue({
      accountsIds: null,
    });

    if (accountsManagedBySelected?.length > 0) {
      setIsDepartmentSelectDisabled(true);
    } else {
      setIsDepartmentSelectDisabled(false);
    }

    formAccountPermission.resetFields();
  };

  return (
    <div className="content-dnd">
      <Modal
        zIndex={2900}
        className="modal-pequeno"
        centered
        width={720}
        title={t("bpms.dashboard.flowConfig.modalTitleConfig")}
        open={props.openConfig}
        footer={footer()}
        closable={false}
        closeIcon={false}
        style={{ overflowY: "auto", maxHeight: "calc(100vh - 200px)" }}
      >
        <Form
          layout="vertical"
          form={form}
          name="form"
          onFinish={onUpdate}
          style={{ overflowX: "hidden" }}
        >
          <Row gutter={[8, 0]}>
            <Col xs={5} xl={5}>
              <Col xs={24} xl={24}>
                <Form.Item
                  name={`icon`}
                  label={t("bpms.dashboard.flowConfig.iconName")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Select>
                    {icons?.map((e) => (
                      <Option key={e?.enumTag} value={e?.enumTag}>
                        <Avatar shape="square" size={24} src={e?.pathAws} />
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} xl={24}>
                <Form.Item
                  label={t("bpms.dashboard.flowConfig.colorName")}
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
            </Col>

            <Col xs={19} xl={19}>
              <Col xs={20} xl={20}>
                <Form.Item
                  hasFeedback
                  name="name"
                  label={t("bpms.dashboard.flowConfig.flowsName")}
                  rules={[
                    {
                      required: true,
                      message: t("bpms.dashboard.flowConfig.messageAlert"),
                    },
                  ]}
                >
                  <Input
                    placeholder={t("bpms.dashboard.flowConfig.inputFlowsName")}
                  ></Input>
                </Form.Item>
              </Col>

              <Col xs={24} xl={24}>
                <Form.Item
                  hasFeedback
                  name="description"
                  label={t("bpms.dashboard.flowConfig.description")}
                >
                  <TextArea
                    maxLength={150}
                    placeholder={t(
                      "bpms.dashboard.flowConfig.inputDescription"
                    )}
                    rows={3}
                  ></TextArea>
                </Form.Item>
              </Col>

              <Col xs={24} xl={24}>
                <Form.Item
                  hasFeedback
                  name="nameButtonCreateTask"
                  label={t(
                    "bpms.dashboard.flowConfig.exempleBtnCreateTaskName"
                  )}
                  rules={[
                    {
                      required: true,
                      message: t("bpms.dashboard.flowConfig.messageAlert"),
                    },
                  ]}
                >
                  <Input
                    placeholder={t(
                      "bpms.dashboard.flowConfig.btnCreateTaskName"
                    )}
                  ></Input>
                </Form.Item>
              </Col>
            </Col>

            <Form.Item
              name={`typeManagedBy`}
              label={t("bpms.dashboard.flowConfig.flowManagement")}
              style={{ marginLeft: "1vw" }}
              //rules={[{ required: true }]}
            >
              <p className="subTextForm">
                {t("bpms.dashboard.flowConfig.selectFlowManagement")}
              </p>

              <Radio.Group
                onChange={(v) => setTypeManagedBy(v?.target?.value)}
                defaultValue={typeManagedBy}
              >
                <Radio.Button value="ONLY">
                  {t("bpms.dashboard.flowConfig.radioOnlyBtn")}
                </Radio.Button>
                <Radio.Button value="CUSTOM">
                  {t("bpms.dashboard.flowConfig.radioCustomBtn")}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {typeManagedBy === "CUSTOM" && (
              <Col xs={24} xl={24}>
                <div style={{ overflowY: "auto" }}>
                  <div className="papper-col">
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => openAddDepartmentManagedBy(null)}
                      style={{ marginBottom: "10px" }}
                    >
                      {t("bpms.dashboard.flowConfig.btnAddDepartment")}
                    </Button>
                    <div className="papper-col-blank">
                      <List
                        bordered
                        loading={loading}
                        style={{ border: "0px", marginTop: "10px" }}
                        dataSource={departmentsManagedBySelected}
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
                                  department?.accountsIds?.length === 0
                                    ? `${t(
                                        "bpms.dashboard.flowConfig.btnAddDepartment"
                                      )}`
                                    : `${t(
                                        "bpms.dashboard.flowConfig.badgeTextSelectedAccounts"
                                      )} (${department?.accountsIds?.length})`
                                }
                                color={"blue"}
                              >
                                <Card
                                  bordered={false}
                                  actions={[
                                    <Space>
                                      <EditOutlined
                                        onClick={() =>
                                          openAddDepartmentManagedBy(department)
                                        }
                                      />{" "}
                                      <DeleteOutlined
                                        onClick={() =>
                                          removeDepartmnetManagedBy(department)
                                        }
                                      />
                                    </Space>,
                                  ]}
                                >
                                  <br />
                                  <Meta title={department.departmentName} />
                                </Card>
                              </Badge.Ribbon>
                            </Skeleton>
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            )}

            <Form.Item
              name={`typeOpenedBy`}
              label={t("bpms.dashboard.flowConfig.flowOpeningResponsible")}
              //rules={[{ required: true }]}
              style={{ marginTop: "2rem", marginLeft: "1vw" }}
            >
              <p className="subTextForm">
                {t("bpms.dashboard.flowConfig.selectFlowOpeningResponsible")}
              </p>

              <Radio.Group
                onChange={(v) => setTypeOpenedBy(v?.target?.value)}
                defaultValue={typeOpenedBy}
              >
                <Radio.Button value="ALL">
                  {t("bpms.dashboard.flowConfig.radioAllBtn")}
                </Radio.Button>
                <Radio.Button value="CUSTOM">
                  {t("bpms.dashboard.flowConfig.radioCustomBtn")}
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            {typeOpenedBy === "CUSTOM" && (
              <Col xs={24} xl={24}>
                <div style={{ overflowY: "auto" }}>
                  <div className="papper-col">
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => openAddDepartmentOpenedBy(null)}
                      style={{ marginBottom: "10px" }}
                    >
                      {t("bpms.dashboard.flowConfig.btnAddDepartment")}
                    </Button>
                    <div className="papper-col-blank">
                      <List
                        bordered
                        loading={loading}
                        style={{ border: "0px", marginTop: "10px" }}
                        dataSource={departmentsOpenedBySelected}
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
                                  department?.accountsIds?.length === 0
                                    ? `${t(
                                        "bpms.dashboard.flowConfig.btnAddDepartment"
                                      )} `
                                    : `${t(
                                        "bpms.dashboard.flowConfig.badgeTextSelectedAccounts"
                                      )} (${department?.accountsIds?.length})`
                                }
                                color={"blue"}
                              >
                                <Card
                                  bordered={false}
                                  actions={[
                                    <Space>
                                      <EditOutlined
                                        onClick={() =>
                                          openAddDepartmentOpenedBy(department)
                                        }
                                      />{" "}
                                      <DeleteOutlined
                                        onClick={() =>
                                          removeDepartmnetOpenedBy(department)
                                        }
                                      />
                                    </Space>,
                                  ]}
                                >
                                  <Row>
                                    <Col>
                                      <br />
                                      <span>{department.departmentName}</span>
                                      <br />
                                    </Col>
                                  </Row>
                                </Card>
                              </Badge.Ribbon>
                            </Skeleton>
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Form>

        <Divider />

        {props?.flow?.releasedAt === null && (
          <div>
            {props?.permissions?.allowFlowSuspend &&
              props?.flow?.formInitial?.fields?.length > 0 && (
                <span style={{ textAlignLast: "center" }}>
                  <p>
                    {t("bpms.dashboard.flowConfig.releaseVersion")}{" "}
                    <a
                      style={{ color: "black", fontWeight: "bold" }}
                      onClick={() => releaseVersion()}
                    >
                      {t("bpms.dashboard.flowConfig.btnClickHere")}
                    </a>
                  </p>
                </span>
              )}
            <Divider />
          </div>
        )}

        {props?.flow?.releasedAt != null && (
          <div>
            <span style={{ textAlignLast: "center" }}>
              <p>
                {t("bpms.dashboard.flowConfig.dateVersionRelease")}{" "}
                <span>
                  {dayjs(props?.flow?.releasedAt).format("DD/MM/YYYY HH:mm")}
                </span>
              </p>
            </span>

            {props?.permissions?.allowFlowSuspend && (
              <span style={{ textAlignLast: "center" }}>
                <p>
                  {t("bpms.dashboard.flowConfig.suspensionFlow")}{" "}
                  <a
                    style={{ color: "red", fontWeight: "bold" }}
                    onClick={() => setOpenSuspendFlow(true)}
                  >
                    {t("bpms.dashboard.flowConfig.btnClickHere")}
                  </a>
                </p>
              </span>
            )}
            <Divider />
          </div>
        )}

        {props?.permissions?.allowFlowRemove && (
          <span style={{ textAlignLast: "center" }}>
            <p>
              {t("bpms.dashboard.flowConfig.removeFlow")}{" "}
              <a
                style={{ color: "red", fontWeight: "bold" }}
                onClick={() => setOpenRemoveFlow(true)}
              >
                {t("bpms.dashboard.flowConfig.btnClickHere")}
              </a>
            </p>
          </span>
        )}
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={500}
        title={t("bpms.dashboard.flowConfig.modalTitleRemoveFlow")}
        open={openRemoveFlow}
        onCancel={() => setOpenRemoveFlow(false)}
        onOk={formRemove.submit}
        okText={t("bpms.dashboard.flowConfig.modalBtnRemove")}
        cancelText={t("bpms.dashboard.flowConfig.modalBtnClose")}
        closable={false}
        closeIcon={false}
      >
        <Form form={formRemove} onFinish={remmoveFlow} layout="vertical">
          <span>{t("bpms.dashboard.flowConfig.modalRemoveFlow")}(Cards).</span>
          <Form.Item
            name={`message`}
            label={t("bpms.dashboard.flowConfig.messageRemoveAlert")}
            rules={[
              {
                required: true,
                message: t("bpms.dashboard.flowConfig.messageAlert"),
              },
            ]}
          >
            <Input
              maxLength={20}
              placeholder={t("bpms.dashboard.flowConfig.inputModalRemoveFlow")}
              className="inputMod"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={500}
        title={t("bpms.dashboard.flowConfig.modalTitleSuspendFlow")}
        open={openSuspendFlow}
        onCancel={() => setOpenSuspendFlow(false)}
        onOk={formSuspend.submit}
        okText={t("bpms.dashboard.flowConfig.modalBtnSuspend")}
        cancelText={t("bpms.dashboard.flowConfig.modalBtnClose")}
        closable={false}
        closeIcon={false}
      >
        <Form form={formSuspend} onFinish={suspendFlow} layout="vertical">
          <span>
            {t("bpms.dashboard.flowConfig.modalSuspensionFlow")}(Cards).
          </span>
          <Form.Item
            name={`message`}
            label={t("bpms.dashboard.flowConfig.messageSuspendAlert")}
            rules={[
              {
                required: true,
                message: t("bpms.dashboard.flowConfig.messageAlert"),
              },
            ]}
          >
            <Input
              maxLength={20}
              placeholder={t(
                "bpms.dashboard.flowConfig.inputModalSuspensionFlow"
              )}
              className="inputMod"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={650}
        title={`${t(
          "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostum"
        )}`}
        open={showAddDepartment}
        onCancel={() => closeAddDepartmentManagedBy()}
        onOk={() =>
          editDepartmentManagedBy
            ? updateDepartmnetManagedBy()
            : addDepartmentManagedBy()
        }
        okText={
          editDepartmentManagedBy
            ? `${t("bpms.dashboard.flowConfig.addDepartmentCostumUpdateTitle")}`
            : `${t("bpms.dashboard.flowConfig.addDepartmentCostumAddTitle")}`
        }
        cancelText={t("bpms.dashboard.flowConfig.modalBtnClose")}
        closable={false}
        closeIcon={false}
      >
        <Form
          form={formManagedBy}
          initialValue={{
            departmentId: formManagedBy.getFieldValue("departmentId"),
            accountsIds: formManagedBy.getFieldValue("accountsIds"),
          }}
        >
          <Row gutter={[8, 8]}>
            <Col xs={24} xl={24}>
              <p>
                Configure aqui as contas que serão responsáveis pela manutenção
                do Fluxo.
              </p>
            </Col>

            {editDepartmentManagedBy && (
              <Col xs={24} xl={24}>
                <RightCircleOutlined />
                <span className="title">
                  {t(
                    "bpms.dashboard.boardn.createOrUpdate.addDepartmentFormItem"
                  )}
                </span>
                <br />
                <span className="backspace">
                  {departmentManagedBySelected?.departmentName}
                </span>
                <br />
                <br />
              </Col>
            )}

            {!editDepartmentManagedBy && (
              <Col xs={24} xl={24}>
                <Form.Item
                  name={`departmentId`}
                  // label={t("bpms.dashboard.boardn.createOrUpdate.addDepartmentFormItem")}
                  rules={[
                    {
                      required: true,
                      message: t(
                        "bpms.dashboard.boardn.createOrUpdate.messageForDepartment"
                      ),
                    },
                  ]}
                >
                  <Select
                    placeholder={t(
                      "bpms.dashboard.boardn.createOrUpdate.addDepartmentSelect"
                    )}
                    onChange={(departmentId) =>
                      activeSelectAccountsManagedBy(departmentId)
                    }
                    disabled={isDepartmentSelectDisabled}
                  >
                    {departmentsManagedBy
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
                    activeSelectManagedByAccount ||
                    accountsManagedBy?.length == 0 ||
                    departmentManagedBySelected == null
                  }
                  placeholder={t(
                    "bpms.dashboard.boardn.createOrUpdate.selectResponsibleAccounts"
                  )}
                  value={accountManagedBySelected}
                  //             onChange={handleResponsibleChange}
                  onChange={(e) => handlerAccount(e)}
                  style={{ width: "100%" }}
                  options={accountsManagedBy}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={6} lg={6} xl={6}>
              <Button
                onClick={allAccountsManagedBy}
                disabled={
                  activeSelectManagedByAccount ||
                  accountsManagedBySelected?.length > 0 ||
                  departmentManagedBySelected == null
                }
              >
                {t("bpms.dashboard.flow.flowColumn.checkboxSelectAllAccounts")}
              </Button>
            </Col>

            <Col xs={24} xl={24}>
              <Table
                dataSource={[...accountsManagedBySelected]}
                columns={columns}
                scroll={{ x: 2400 }}
              />
            </Col>
          </Row>

          {/* 
          <Col xs={24} xl={24}>
            <Form.Item
              name={`departmentId`}
              label={t("bpms.dashboard.flowConfig.addDepartmentFormItem")}
              rules={[
                {
                  required: true,
                  message: t("bpms.dashboard.flowConfig.messageForDepartment"),
                },
              ]}
            >
              <Select
                placeholder={t("bpms.dashboard.flowConfig.addDepartmentSelect")}
                onChange={(departmentId) => {
                  activeSelectAccountsManagedBy(departmentId);
                  setIsDepartmentSelectDisabled(true);
                }}
                disabled={isDepartmentSelectDisabled}
              >
                {departmentsManagedBy?.map((e) => (
                  <Option key={e?.id} value={e?.id}>
                    {e?.name}
                  </Option>
                ))}
              </Select>
              <br /><br />
              <Checkbox
                defaultChecked={showResposibleAccountsManagedBy}
                onClick={getSelectAccountsManagedBy}
              >
                {t("bpms.dashboard.flow.flowColumn.checkboxSelectAllAccounts")}
              </Checkbox>
            </Form.Item>
          </Col>

          {!showResposibleAccountsManagedBy && (
            <Col xs={24} xl={24}>
              <Form.Item name={`accountsIds`} label={t("bpms.dashboard.flowConfig.addResponsibleFormItem")}>

                <Select
                  mode="multiple"
                  disabled={activeSelectManagedByAccount}
                  placeholder={t("bpms.dashboard.flowConfig.selectResponsibleAccounts")}
                  value={managedByaccountSelected}
                  //             onChange={handleResponsibleChange}
                  onChange={(e) => handlerAccountdManagedBy(e)}
                  style={{ width: '100%' }}
                  options={accountsManagedBy}
                />

              </Form.Item>
            </Col> */}
        </Form>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={650}
        title={
          (editDepartmentOpenedBy
            ? `${t("bpms.dashboard.flowConfig.addDepartmentCostumUpdateTitle")}`
            : `${t("bpms.dashboard.flowConfig.addDepartmentCostumAddTitle")}`) +
          `${t("bpms.dashboard.flowConfig.addDepartmentCostum")}`
        }
        open={showAddDepartmentOpenedBy}
        onCancel={() => closeAddDepartmentOpenedBy()}
        onOk={() =>
          editDepartmentOpenedBy
            ? updateDepartmnetOpenedBy()
            : addDepartmentOpenedBy()
        }
        okText={
          editDepartmentOpenedBy
            ? `${t("bpms.dashboard.flowConfig.addDepartmentCostumUpdateTitle")}`
            : `${t("bpms.dashboard.flowConfig.addDepartmentCostumAddTitle")}`
        }
        cancelText={t("bpms.dashboard.flowConfig.modalBtnClose")}
        closable={false}
        closeIcon={false}
      >
        <Form form={formOpenedBy}>
          <Col xs={24} xl={24}>
            <Form.Item
              name={`departmentId`}
              label={t("bpms.dashboard.flowConfig.addDepartmentFormItem")}
              rules={[
                {
                  required: true,
                  message: t("bpms.dashboard.flowConfig.messageForDepartment"),
                },
              ]}
            >
              <Select
                placeholder={t("bpms.dashboard.flowConfig.addDepartmentSelect")}
                onChange={(value) => {
                  activeSelectAccountsOpenedBy(value);
                  setIsDepartmentSelectDisabled(true);
                }}
                disabled={isDepartmentSelectDisabled}
              >
                {departmentsOpenedBy?.map((e) => (
                  <Option key={e?.id} value={e?.id}>
                    {e?.name}
                  </Option>
                ))}
              </Select>
              <Checkbox
                defaultChecked={showResposibleAccountsOpenedBy}
                onClick={getSelectAccountsOpenedBy}
              >
                {t("bpms.dashboard.flow.flowColumn.checkboxSelectAllAccounts")}
              </Checkbox>
            </Form.Item>
          </Col>
          {!showResposibleAccountsOpenedBy && (
            <Col xs={24} xl={24}>
              <Form.Item
                name={`accountsIds`}
                label={t("bpms.dashboard.flowConfig.addResponsibleFormItem")}
              >
                <Select
                  mode="multiple"
                  disabled={activeSelectOpenedByAccount}
                  placeholder={t(
                    "bpms.dashboard.flowConfig.selectResponsibleAccounts"
                  )}
                  value={openedByaccountSelected}
                  //             onChange={handleResponsibleChange}
                  onChange={(e) => handlerAccountdOpenedBy(e)}
                  style={{ width: "100%" }}
                  options={accountsOpenedBy}
                />
              </Form.Item>
            </Col>
          )}
        </Form>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={650}
        title={t(
          "bpms.dashboard.boardn.createOrUpdate.modalAddAccountsPermissinns"
        )}
        open={openModalSelectAccountPermissions}
        onCancel={() => closeModalAddAccountPermissionManagedBy()}
        onOk={() => formAccountPermission.submit()}
        okText={t(
          "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostumAddTitle"
        )}
        cancelText={t("bpms.dashboard.boardn.createOrUpdate.modalBtnClose")}
        closable={false}
        closeIcon={false}
      >
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          <Row>
            <Col span={24}>
              {t("bpms.dashboard.boardn.createOrUpdate.permissionsAccount")}{" "}
              {accountManagedBySelected?.label}
            </Col>
            <Col span={24}>
              <Divider>
                {t("bpms.dashboard.boardn.createOrUpdate.permissions")}
              </Divider>
              <Form
                form={formAccountPermission}
                layout="vertical"
                onFinish={
                  showResposibleAccountsManagedBy
                    ? getSelectAccountsManagedBy
                    : handlerAddAccountManagedBy
                }
              >
                <Form.Item name={`allowFlowRemove`} valuePropName="checked">
                  <Checkbox>
                    {t(
                      "bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox1"
                    )}
                  </Checkbox>
                </Form.Item>

                <Form.Item name={`allowFlowUpdate`} valuePropName="checked">
                  <Checkbox>
                    {t(
                      "bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox2"
                    )}
                  </Checkbox>
                </Form.Item>

                <Form.Item name={`allowFlowReleased`} valuePropName="checked">
                  <Checkbox>
                    {t(
                      "bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox6"
                    )}
                  </Checkbox>
                </Form.Item>

                <Form.Item name={`allowFlowSuspend`} valuePropName="checked">
                  <Checkbox>
                    {t(
                      "bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox7"
                    )}
                  </Checkbox>
                </Form.Item>

                <Form.Item name={`allowFlowStepRemove`} valuePropName="checked">
                  <Checkbox>
                    {t(
                      "bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox3"
                    )}
                  </Checkbox>
                </Form.Item>

                <Form.Item name={`allowFlowStepUpdate`} valuePropName="checked">
                  <Checkbox>
                    {t(
                      "bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox4"
                    )}
                  </Checkbox>
                </Form.Item>

                <Form.Item
                  name={`allowFlowStepTaskRemove`}
                  valuePropName="checked"
                >
                  <Checkbox>
                    {t(
                      "bpms.dashboard.boardn.createOrUpdate.permissionsCheckBox5"
                    )}
                  </Checkbox>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default Config;
