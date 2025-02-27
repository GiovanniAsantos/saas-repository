"use client";
import React, { useEffect, useState } from "react";
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
  Spin,
  Switch,
  Table,
  Tooltip,
} from "antd";
import "./style.module.css";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import Meta from "antd/es/card/Meta";
import { Option } from "antd/es/mentions";
import { ChromePicker, GithubPicker, SketchPicker } from "react-color";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Colors } from "../../../../../Bpms/Components/Colors";
import { getIcons, Icons } from "../../../../../Bpms/components/Icons";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";
import { useRouter } from "next/navigation";

const CreateOrUpdate = (props) => {
  const [t] = useTranslation("global");

  const flowService = new FlowService();

  const router = useRouter();

  const [form] = Form.useForm();

  const [formManagedBy] = Form.useForm();

  const [formDepartment] = Form.useForm();

  const [formAccountPermission] = Form.useForm();

  const [formOpenedBy] = Form.useForm();

  const { TextArea } = Input;

  const [loading, setLoading] = useState(false);

  const [loadingAddAccounts, setLoadingAddAccounts] = useState(false);

  const [icons, setIcons] = useState([]);

  const [accountsManagedBy, setAccountsManagedBy] = useState([]);

  const [accountsManagedBySelected, setAccountsManagedBySelected] = useState(
    []
  );

  const [accountManagedBySelected, setAccountManagedBySelected] = useState();

  const [accountsOpenedBy, setAccountsOpenedBy] = useState([]);

  const [activeSelectManagedByAccount, setActiveSelectManagedByAccount] =
    useState(true);
  const [activeSelectOpenedByAccount, setActiveSelectOpenedByAccount] =
    useState(true);

  const [departmentsOpenedBy, setDepartmentsOpenedBy] = useState([]);

  const [departmentsManagedBy, setDepartmentsManagedBy] = useState([]);

  const [typeOpenedBy, setTypeOpenedBy] = useState("ALL");

  const [typeManagedBy, setTypeManagedBy] = useState("ONLY");

  const [showAddDepartment, setShowAddDepartment] = useState(false);

  const [showAddDepartmentOpenedBy, setShowAddDepartmentOpenedBy] =
    useState(false);

  const [openedByaccountSelected, setOpenedByAccountSelected] = useState([]);

  const [
    openModalSelectAccountPermissions,
    setOpenModalSelectAccountPermissions,
  ] = useState(false);

  const [departmentManagedBySelected, setDepartmentManagedBySelected] =
    useState();

  const [
    listDepartmentsManagedBySelected,
    setListDepartmentsManagedBySelected,
  ] = useState([]);

  const [departmentOpenedBySelected, setDepartmentOpenedBySelected] =
    useState();

  const [departmentsOpenedBySelected, setDepartmentsOpenedBySelected] =
    useState([]);

  const [editDepartmentManagedBy, setEditDepartmentManagedBy] = useState(false);

  const [editDepartmentOpenedBy, setEditDepartmentOpenedBy] = useState(false);

  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const [color, setColor] = useState("#5A9BD5");

  const [selectedIcon, setSelectedIcon] = useState(null);

  const [showResposibleAccountsManagedBy, setShowResposibleAccountsManagedBy] =
    useState(false);

  const [showResposibleAccountsOpenedBy, setShowResposibleAccountsOpenedBy] =
    useState(true);

  const [isDepartmentSelectDisabled, setIsDepartmentSelectDisabled] =
    useState(false);

  const [
    isOkButtonAccountOpenedByDisabled,
    setIsOkButtonAccountOpenedByDisabled,
  ] = useState(true);

  useEffect(() => {
    setIsOkButtonAccountOpenedByDisabled(
      !(openedByaccountSelected?.length > 0 && departmentOpenedBySelected)
    );
  }, [openedByaccountSelected, departmentOpenedBySelected]);

  const [
    isOkButtonDepartmentMenagedByDisabled,
    setIsOkButtonDepartmentManagedByDisabled,
  ] = useState(true);

  useEffect(() => {
    setIsOkButtonDepartmentManagedByDisabled(
      !(accountsManagedBySelected?.length > 0 && accountManagedBySelected)
    );
  }, [accountsManagedBySelected, accountManagedBySelected]);

  const onFinish = async (values) => {
    setLoading(true);

    let tempOpenedBy = [];

    if (typeOpenedBy === "CUSTOM") {
      for (let d of departmentsOpenedBySelected) {
        let accountIds = d.accountsIds?.map((a) => a?.value);
        d.accountIds = accountIds;
        tempOpenedBy.push(d);
      }
    }

    let tempManagedBy = [];

    if (typeManagedBy === "CUSTOM") {
      for (let d of listDepartmentsManagedBySelected) {
        let accounts = d.accountsIds?.map((a) => ({
          ...a,
          accountId: a?.id,
          id: null,
        }));
        d.accounts = accounts;
        tempManagedBy.push(d);
      }

      //tempManagedBy = listDepartmentsManagedBySelected?.map?((a) => ({departmentId: a.departmentId, accountIds: a.accountsIds?.map((ac) => ac.value)}));
    }

    let request = {
      name: form.getFieldValue("name"),
      description: form.getFieldValue("description"),
      //typeOfTemporality: form.getFieldValue("typeOfTemporality"),
      //urgencyClassificationId: form.getFieldValue("urgencyClassificationId") === undefined ? null : form.getFieldValue("urgencyClassificationId"),
      config: {
        icon: form.getFieldValue("icon"),
        color: color,
        nameButtonCreateTask: "Criar Atividade",
        typeOpenedBy: typeOpenedBy,
        typeManagedBy: typeManagedBy,
        openedBy: tempOpenedBy,
        managedBy: tempManagedBy,
      },
    };

    try {
      const response = await flowService.onFinish(request);
      toast.success("Fluxo Criado com Sucesso.");
      router.push(`/dashboard/flow/my-flows/${flow.id}`);
    } catch (error) {
      toast.error(error?.response?.message);
    } finally {
      setLoading(false);
    }
  };

  const activeSelectAccountsManagedBy = (departmentId) => {
    formDepartment.setFieldsValue({ departmentId: departmentId });
    setDepartmentManagedBySelected(departmentId);
    setActiveSelectManagedByAccount(true);
    getAccountsByDepartmentId(departmentId, true, false);
  };

  const activeSelectAccountsOpenedBy = (departmentId) => {
    setDepartmentOpenedBySelected(departmentId);
    setActiveSelectManagedByAccount(true);
    getAccountsByDepartmentId(departmentId, false, true);
  };

  const findAllDepartments = async (managedBy, openedBy) => {
    await flowService.findAllDepartments().then((response) => {
      if (managedBy) {
        setDepartmentsManagedBy(response);
      }

      if (openedBy) {
        setDepartmentsOpenedBy(response);
      }
    });
  };

  const getAccountsByDepartmentId = async (organId, managedBy, openedBy) => {
    await flowService.getAccountsByDepartmentId(organId).then((response) => {
      const departmentAccountsSemAccount = response?.departmentAccounts.map(
        (item) => item.account
      );

      let list = departmentAccountsSemAccount
        ? departmentAccountsSemAccount?.map((e) => ({
            label: e.name,
            value: e.id,
          }))
        : [];

      if (managedBy) {
        setActiveSelectManagedByAccount(false);
        setAccountsManagedBy(list);
      }

      if (openedBy) {
        setActiveSelectOpenedByAccount(false);
        setAccountsOpenedBy(list);
      }
    });
  };

  const openAddDepartmentManagedBy = (department) => {
    if (department != null) {
      setLoadingAddAccounts(true);
      setEditDepartmentManagedBy(true);
      setDepartmentManagedBySelected(department);
      setAccountsManagedBySelected(department?.accountsIds);
      getAccountsByDepartmentId(department?.departmentId, true, false);

      setLoadingAddAccounts(false);
      setShowAddDepartment(true);
    }

    if (department == null) {
      formDepartment.resetFields();

      setEditDepartmentManagedBy(false);
      setDepartmentManagedBySelected(null);
      setAccountsManagedBySelected([]);

      setLoadingAddAccounts(false);
      setShowAddDepartment(true);
    }
  };

  const closeAddDepartmentManagedBy = () => {
    formManagedBy.resetFields();
    setShowAddDepartment(false);
    setShowResposibleAccountsManagedBy(false);
    setIsDepartmentSelectDisabled(false);
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
    if (listAcc?.length > 0) {
      setIsDepartmentSelectDisabled(true);
    } else {
      setIsDepartmentSelectDisabled(false);
    }
  };

  const addDepartmentManagedBy = () => {
    let list = listDepartmentsManagedBySelected;

    let department = departmentsManagedBy.filter(
      (d) => d?.id === departmentManagedBySelected
    )[0];

    let departmentFound = listDepartmentsManagedBySelected.filter(
      (d) => d?.departmentId === departmentManagedBySelected
    )[0];

    if (departmentFound != null) {
      formDepartment.resetFields();
      setShowAddDepartment(false);
      return toast.error("Departamento já foi adiconado.");
    }

    list.push({
      departmentId: departmentManagedBySelected,
      departmentName: department?.name,
      accountsIds: accountsManagedBySelected,
    });

    setAccountsManagedBySelected([]);
    setDepartmentManagedBySelected(null);
    setAccountsManagedBy([]);
    setListDepartmentsManagedBySelected(list);
    setActiveSelectManagedByAccount(false);
    setIsDepartmentSelectDisabled(false);
    formDepartment.resetFields();
    setShowAddDepartment(false);
  };

  const updateDepartmnetManagedBy = () => {
    let list = listDepartmentsManagedBySelected;

    let index = list.findIndex(
      (d) => d?.departmentId === departmentManagedBySelected?.departmentId
    );

    if (index != null) {
      let department = departmentsManagedBy.filter(
        (d) => d?.id === departmentManagedBySelected?.departmentId
      )[0];

      list[index] = {
        departmentId: department?.id,
        departmentName: department?.name,
        accountsIds: accountsManagedBySelected,
      };
    }

    setAccountsManagedBySelected([]);
    setDepartmentManagedBySelected(null);
    setAccountsManagedBy([]);
    setListDepartmentsManagedBySelected(list);

    setActiveSelectManagedByAccount(false);

    formManagedBy.resetFields();
    setShowAddDepartment(false);
  };

  const removeDepartmnetManagedBy = (department) => {
    let list = listDepartmentsManagedBySelected;

    let index = list.findIndex(
      (d) => d?.departmentId === department?.departmentId
    );

    list.splice(index, 1);

    setListDepartmentsManagedBySelected([...list]);
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
  };

  const removeDepartmnetOpenedBy = (department) => {
    let list = departmentsOpenedBySelected;

    let index = list.findIndex(
      (d) => d?.departmentId === department?.departmentId
    );

    list.splice(index, 1);

    setDepartmentsOpenedBySelected([...list]);
  };

  useEffect(() => {
    // loadClassification();
    findAllDepartments(true, true);
  }, []);

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
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChange = (selectedColor) => {
    setColor(selectedColor.hex);
  };

  const handlerAccount = (accountId) => {
    let acc = accountsManagedBy.filter((a) => a?.value === accountId)[0];
    let exist = false;
    for (const a of accountsManagedBySelected) {
      if (a.id === acc.value) {
        exist = true;
        break;
      }
    }

    if (exist) {
      formDepartment.setFieldsValue({
        accountsIds: null,
      });

      return toast.warn("conta já selecionada");
    }

    setAccountManagedBySelected(acc);
    setOpenModalSelectAccountPermissions(true);
  };

  const removeAccount = (index) => {
    const list = [...accountsManagedBySelected];
    list.splice(index, 1);
    setAccountsManagedBySelected(list);

    if (list?.length > 0) {
      setIsDepartmentSelectDisabled(true);
    } else {
      setIsDepartmentSelectDisabled(false);
    }
  };

  const handlerAddAccountManagedBy = (values) => {
    let listAcc = accountsManagedBySelected;

    let accountSelectedConv = {};

    let accFound = accountsManagedBySelected.filter(
      (a) => a?.accountId === accountManagedBySelected.value
    )[0];

    if (accFound != null) {
      formDepartment.setFieldsValue({
        accountsIds: null,
      });
      setOpenModalSelectAccountPermissions(false);
      return toast.warning("Esta conta já foi inserida.");
    }

    accountSelectedConv.id = accountManagedBySelected.value;
    accountSelectedConv.name = accountManagedBySelected.label;
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
    formDepartment.setFieldsValue({
      accountsIds: null,
    });

    if (accountsManagedBySelected?.length > 0) {
      setIsDepartmentSelectDisabled(true);
    } else {
      setIsDepartmentSelectDisabled(false);
    }
    setIsOkButtonDepartmentManagedByDisabled(false);
    formAccountPermission.resetFields();
  };

  const closeModalAddAccountPermissionManagedBy = () => {
    formDepartment.setFieldsValue({
      accountsIds: null,
    });
    formAccountPermission.resetFields();
    setOpenModalSelectAccountPermissions(false);
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
              onClick={() => removeAccount(index)}
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

  const getSelectAccountsManagedBy = (values) => {
    let listAcc = [];

    for (const acc of accountsManagedBy) {
      let accountSelectedConv = {};
      accountSelectedConv.id = acc.value;
      accountSelectedConv.name = acc.label;
      accountSelectedConv.allowFlowRemove =
        formAccountPermission.getFieldValue("allowFlowRemove") === undefined
          ? false
          : true;
      accountSelectedConv.allowFlowUpdate =
        formAccountPermission.getFieldValue("allowFlowUpdate") === undefined
          ? false
          : true;
      accountSelectedConv.allowFlowReleased =
        formAccountPermission.getFieldValue("allowFlowReleased") === undefined
          ? false
          : true;
      accountSelectedConv.allowFlowSuspend =
        formAccountPermission.getFieldValue("allowFlowSuspend") === undefined
          ? false
          : true;
      accountSelectedConv.allowFlowStepRemove =
        formAccountPermission.getFieldValue("allowFlowStepRemove") === undefined
          ? false
          : true;
      accountSelectedConv.allowFlowStepUpdate =
        formAccountPermission.getFieldValue("allowFlowStepUpdate") === undefined
          ? false
          : true;
      accountSelectedConv.allowFlowStepTaskRemove =
        formAccountPermission.getFieldValue("allowFlowStepTaskRemove") ===
        undefined
          ? false
          : true;
      accountSelectedConv.allowCardClosure =
        formAccountPermission.getFieldValue("allowCardClosure") === undefined
          ? false
          : true;
      listAcc.push(accountSelectedConv);
    }

    setAccountsManagedBySelected(listAcc);
    setShowResposibleAccountsManagedBy(false);
    setOpenModalSelectAccountPermissions(false);
    setIsDepartmentSelectDisabled(false);
    formAccountPermission.resetFields();
    setIsDepartmentSelectDisabled(true);
  };

  const getSelectAccountsOpenedBy = (e) => {
    formOpenedBy.setFieldsValue({ accountsIds: null });
    setAccountsOpenedBy([]);
    setOpenedByAccountSelected([]);
    setShowResposibleAccountsOpenedBy(e.target.checked);
  };

  const allAccountsManagedBy = () => {
    setShowResposibleAccountsManagedBy(true);
    setOpenModalSelectAccountPermissions(true);
  };

  return (
    <div className="content-dnd">
      <Modal
        zIndex={2900}
        className="modal-pequeno"
        centered
        width={800}
        title={t(
          "bpms.dashboard.boardn.createOrUpdate.modalCreateNewFlowTitle"
        )}
        open={props.openModal}
        onCancel={() => props.setOpenModal(false)}
        closable={false}
        closeIcon={false}
        maskClosable={false}
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "calc(100vh - 200px)",
        }}
        footer={[
          <Form form={form}>
            <Button
              icon={
                <CloseCircleOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              key="back"
              disabled={loading}
              onClick={() => props.setOpenModal(false)}
            >
              {t("bpms.dashboard.boardn.createOrUpdate.modalBtnClose")}
            </Button>
            <Button
              icon={
                <CheckCircleOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              key="submit"
              htmlType="submit"
              type="primary"
              disabled={loading}
              onClick={() => onFinish()}
            >
              {t("bpms.dashboard.boardn.createOrUpdate.btnCreate")}
            </Button>
          </Form>,
        ]}
      >
        <Form
          layout="vertical"
          form={form}
          name="form"
          onFinish={onFinish}
          initialValue={{
            typeOpenedBy: "ALL",
            icon: "WORKFLOW",
            typeManagedBy: "ONLY",
          }}
        >
          <Spin spinning={loading}>
            <Row gutter={[8, 0]}>
              <Col xs={5} xl={5}>
                <Col xs={24} xl={24}>
                  <Form.Item
                    name="icon"
                    label={t("bpms.dashboard.flowConfig.iconName")}
                    rules={[{ required: true }]}
                  >
                    <Select onChange={(value) => setSelectedIcon(value)}>
                      {Icons?.map((e) => (
                        <Option key={e?.enumTag} value={e?.enumTag}>
                          <Avatar
                            shape="square"
                            icon={getIcons(e.enumTag, color)}
                            style={{ background: "none" }}
                          />
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* Seletor de Cor */}
                <Col xs={24} xl={24}>
                  <Form.Item label="Select Color" name="color">
                    <div>
                      <div style={sSwatch} onClick={handleClick}>
                        <div style={sColor} />
                      </div>
                      {displayColorPicker ? (
                        <div style={sPopover}>
                          <div style={sCover} onClick={handleClose} />
                          <GithubPicker
                            disableAlpha
                            colors={Colors.map((c) => c.primary)}
                            color={color}
                            onChange={handleChange}
                          />
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
                    label={t("bpms.dashboard.boardn.createOrUpdate.flowsName")}
                    rules={[
                      {
                        required: true,
                        message: t(
                          "bpms.dashboard.boardn.createOrUpdate.messageAlert"
                        ),
                      },
                    ]}
                  >
                    <Input
                      placeholder={t(
                        "bpms.dashboard.boardn.createOrUpdate.inputCreateFlowName"
                      )}
                    ></Input>
                  </Form.Item>
                </Col>
                <Col xs={24} xl={24}>
                  <Form.Item
                    hasFeedback
                    name="description"
                    label={t(
                      "bpms.dashboard.boardn.createOrUpdate.modalFomrItemDescription"
                    )}
                  >
                    <TextArea
                      placeholder={t(
                        "bpms.dashboard.boardn.createOrUpdate.inputDescription"
                      )}
                      maxLength={244}
                      rows={3}
                    ></TextArea>
                  </Form.Item>
                </Col>
              </Col>

              <Form.Item
                name={`typeManagedBy`}
                label={t("bpms.dashboard.boardn.createOrUpdate.flowManagement")}
                style={{ marginLeft: "1vw" }}
                //rules={[{ required: true }]}
              >
                <p className="subTextForm">
                  {t(
                    "bpms.dashboard.boardn.createOrUpdate.selectFlowManagement"
                  )}
                </p>

                <Radio.Group
                  defaultValue={"ONLY"}
                  onChange={(v) => setTypeManagedBy(v?.target?.value)}
                >
                  <Radio.Button value="ONLY">
                    {t("bpms.dashboard.boardn.createOrUpdate.radioOnlyBtn")}
                  </Radio.Button>
                  <Radio.Button value="CUSTOM">
                    {t("bpms.dashboard.boardn.createOrUpdate.radioCustomBtn")}
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
                        {t(
                          "bpms.dashboard.boardn.createOrUpdate.btnAddDepartment"
                        )}
                      </Button>
                      <div className="papper-col-blank">
                        <List
                          bordered
                          loading={loading}
                          style={{ border: "0px", marginTop: "10px" }}
                          dataSource={listDepartmentsManagedBySelected}
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
                                          "bpms.dashboard.boardn.createOrUpdate.badgeTextAllAccounts"
                                        )}`
                                      : `${t(
                                          "bpms.dashboard.boardn.createOrUpdate.badgeTextSelectedAccounts"
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
                                            openAddDepartmentManagedBy(
                                              department
                                            )
                                          }
                                        />{" "}
                                        <DeleteOutlined
                                          onClick={() =>
                                            removeDepartmnetManagedBy(
                                              department
                                            )
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
                label={t(
                  "bpms.dashboard.boardn.createOrUpdate.flowOpeningResponsible"
                )}
                style={{ marginTop: "2rem", marginLeft: "1vw" }}
              >
                <p className="subTextForm">
                  {t(
                    "bpms.dashboard.boardn.createOrUpdate.selectFlowOpeningResponsible"
                  )}
                </p>

                <Radio.Group
                  defaultValue={"ALL"}
                  onChange={(v) => setTypeOpenedBy(v?.target?.value)}
                >
                  <Radio.Button value="ALL">
                    {t("bpms.dashboard.boardn.createOrUpdate.radioAllBtn")}
                  </Radio.Button>
                  <Radio.Button value="CUSTOM">
                    {t("bpms.dashboard.boardn.createOrUpdate.radioCustomBtn")}
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
                        {t(
                          "bpms.dashboard.boardn.createOrUpdate.btnAddDepartment"
                        )}
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
                                          "bpms.dashboard.boardn.createOrUpdate.badgeTextAllAccounts"
                                        )}`
                                      : `${t(
                                          "bpms.dashboard.boardn.createOrUpdate.badgeTextSelectedAccounts"
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
                                            openAddDepartmentOpenedBy(
                                              department
                                            )
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
          </Spin>
        </Form>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={800}
        style={{ overflow: "auto" }}
        title={`${t(
          "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostum"
        )}`}
        open={showAddDepartment}
        cancelText={t("bpms.dashboard.boardn.createOrUpdate.modalBtnClose")}
        closable={false}
        closeIcon={false}
        maskClosable={false}
        footer={
          <Space>
            <Button onClick={closeAddDepartmentManagedBy}>
              {t("bpms.dashboard.boardn.createOrUpdate.modalBtnClose")}
            </Button>
            <Button
              type="primary"
              onClick={() =>
                editDepartmentManagedBy
                  ? updateDepartmnetManagedBy()
                  : addDepartmentManagedBy()
              }
              disabled={isOkButtonDepartmentMenagedByDisabled}
            >
              {editDepartmentManagedBy
                ? `${t(
                    "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostumUpdateTitle"
                  )}`
                : `${t(
                    "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostumAddTitle"
                  )}`}
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
                  Configure aqui as contas que serão responsáveis pela
                  manutenção do Fluxo.
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
                  onClick={() => {
                    allAccountsManagedBy();
                    setIsDepartmentSelectDisabled(true);
                  }}
                  disabled={
                    activeSelectManagedByAccount ||
                    accountsManagedBySelected?.length > 0 ||
                    departmentManagedBySelected == null
                  }
                >
                  {t(
                    "bpms.dashboard.flow.flowColumn.checkboxSelectAllAccounts"
                  )}
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
          </Form>
        </Spin>
      </Modal>

      <Modal
        zIndex={2900}
        className="new-column"
        centered
        width={650}
        title={
          (editDepartmentOpenedBy
            ? `${t(
                "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostumAddTitle"
              )}`
            : `${t(
                "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostumUpdateTitle"
              )}`) +
          `${t("bpms.dashboard.boardn.createOrUpdate.addDepartmentCostum")}`
        }
        open={showAddDepartmentOpenedBy}
        onCancel={() => closeAddDepartmentOpenedBy()}
        closable={false}
        closeIcon={false}
        maskClosable={false}
        footer={
          <Space>
            <Button onClick={closeAddDepartmentOpenedBy}>
              {t("bpms.dashboard.boardn.createOrUpdate.modalBtnClose")}
            </Button>
            <Button
              type="primary"
              onClick={() =>
                editDepartmentOpenedBy
                  ? updateDepartmnetOpenedBy()
                  : addDepartmentOpenedBy()
              }
              disabled={isOkButtonAccountOpenedByDisabled}
            >
              {editDepartmentOpenedBy
                ? `${t(
                    "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostumAddTitle"
                  )}`
                : `${t(
                    "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostumUpdateTitle"
                  )}`}
            </Button>
          </Space>
        }
      >
        <Form form={formOpenedBy}>
          <Row gutter={[8, 8]}>
            <Col xs={24} xl={24}>
              <p>
                Configure aqui as contas autorizadas a criar atividades neste
                fluxo.
              </p>
            </Col>

            {editDepartmentOpenedBy && (
              <Col xs={24} xl={24}>
                <RightCircleOutlined />
                <span className="title">
                  {t(
                    "bpms.dashboard.boardn.createOrUpdate.addDepartmentFormItem"
                  )}
                </span>
                <br />
                <span className="backspace">
                  {departmentOpenedBySelected?.departmentName}
                </span>
                <br />
                <br />
              </Col>
            )}

            {!editDepartmentOpenedBy && (
              <Col xs={24} xl={24}>
                <Form.Item
                  name={`departmentId`}
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
                      activeSelectAccountsOpenedBy(departmentId)
                    }
                    disabled={isDepartmentSelectDisabled}
                  >
                    {departmentsOpenedBy
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

            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Form.Item name={`accountsIds`}>
                <Select
                  mode="multiple"
                  disabled={activeSelectOpenedByAccount}
                  placeholder={t(
                    "bpms.dashboard.boardn.createOrUpdate.selectResponsibleAccounts"
                  )}
                  value={openedByaccountSelected}
                  onChange={(e) => handlerAccountdOpenedBy(e)}
                  style={{ width: "100%" }}
                  options={accountsOpenedBy}
                />
              </Form.Item>
            </Col>
          </Row>
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
        onOk={() => {
          formAccountPermission.submit();
        }}
        okText={t(
          "bpms.dashboard.boardn.createOrUpdate.addDepartmentCostumAddTitle"
        )}
        cancelText={t("bpms.dashboard.boardn.createOrUpdate.modalBtnClose")}
        closable={false}
        closeIcon={false}
        maskClosable={false}
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

export default CreateOrUpdate;
