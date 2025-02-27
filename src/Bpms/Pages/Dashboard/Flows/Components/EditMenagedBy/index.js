/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Modal,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import "./style.module.css";

import { DeleteOutlined, RightCircleOutlined } from "@ant-design/icons";

import { Option } from "antd/es/mentions";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FlowService } from "../../../../../../Services/Bpms/FlowServices";

const EditManagedBy = (props) => {
  const [t] = useTranslation("global");

  const flowService = FlowService();

  const [formManagedBy] = Form.useForm();
  const [formAccountPermission] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const [accountsManagedBy, setAccountsManagedBy] = useState([]);
  const [activeSelectManagedByAccount, setActiveSelectManagedByAccount] =
    useState(true);
  const [departmentsManagedBy, setDepartmentsManagedBy] = useState([]);
  const [showAddDepartment, setShowAddDepartment] = useState(false);

  const [typeOpenedBy, setTypeOpenedBy] = useState("ALL");
  const [typeManagedBy, setTypeManagedBy] = useState("ONLY");

  const [departmentManagedBySelected, setDepartmentManagedBySelected] =
    useState();
  const [departmentsManagedBySelected, setDepartmentsManagedBySelected] =
    useState([]);

  const [departmentsOpenedBySelected, setDepartmentsOpenedBySelected] =
    useState([]);

  const [editDepartmentManagedBy, setEditDepartmentManagedBy] = useState(false);

  const [showResposibleAccountsManagedBy, setShowResposibleAccountsManagedBy] =
    useState(false);

  const [isDepartmentSelectDisabled, setIsDepartmentSelectDisabled] =
    useState(false);

  const [accountsManagedBySelected, setAccountsManagedBySelected] = useState(
    []
  );
  const [accountManagedBySelected, setAccountManagedBySelected] = useState();

  const [
    openModalSelectAccountPermissions,
    setOpenModalSelectAccountPermissions,
  ] = useState(false);

  const getAccountsByDepartmentId = async (departmentId) => {
    await flowService.getAccountsByDepartmentId().then((response) => {
      const departmentAccountsSemAccount =
        response.data?.departmentAccounts.map((item) => item.account);

      let list = departmentAccountsSemAccount
        ? departmentAccountsSemAccount?.map((e) => ({
            name: e.name,
            accountId: e.id,
          }))
        : [];

      setActiveSelectManagedByAccount(false);
      setAccountsManagedBy(list);
    });
  };

  const findAllDepartments = async () => {
    await flowService.findAllDepartments().then((response) => {
      setDepartmentsManagedBy(response.data);
    });
  };

  useEffect(() => {
    findAllDepartments();

    setTypeManagedBy(props?.config?.typeManagedBy);
    setTypeOpenedBy(props?.config?.typeOpenedBy);

    const listManagedBy =
      props?.config?.managedBy?.lenght === 0
        ? []
        : props?.flow?.config?.managedBy?.map((e) => ({
            departmentId: e?.department?.id,
            departmentName: e?.department?.name,
            accountsIds: e.accounts?.map((a) => a),
          }));

    setDepartmentsManagedBySelected(listManagedBy);
  }, [props?.config]);

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

  const closeAddDepartmentManagedBy = () => {
    formManagedBy.resetFields();
    setShowAddDepartment(false);
    setEditDepartmentManagedBy(false);
    setShowResposibleAccountsManagedBy(false);
    setIsDepartmentSelectDisabled(false);
  };

  const addDepartmentManagedBy = () => {
    if (accountsManagedBySelected?.length == 0) {
      return toast.error("Adicione ao menos uma conta para este departamento.");
    }

    let list = departmentsManagedBySelected;

    let department = departmentsManagedBy.filter(
      (d) => d?.id === departmentManagedBySelected
    )[0];

    let departmentFound = departmentsManagedBySelected.filter(
      (d) => d?.departmentId === departmentManagedBySelected
    )[0];

    if (departmentFound != null) {
      formManagedBy.resetFields();
      setShowAddDepartment(false);
      setActiveSelectManagedByAccount(false);
      setShowAddDepartment(false);
      setEditDepartmentManagedBy(false);
      setIsDepartmentSelectDisabled(false);

      return toast.error("Departamento já foi adiconado.");
    }

    list.push({
      departmentId: departmentManagedBySelected,
      departmentName: department?.name,
      accountsIds: accountsManagedBySelected,
    });

    setDepartmentManagedBySelected(null);
    setAccountsManagedBy([]);
    setDepartmentsManagedBySelected(list);
    setActiveSelectManagedByAccount(false);
    setIsDepartmentSelectDisabled(false);
    formManagedBy.resetFields();
    setShowAddDepartment(false);
    setEditDepartmentManagedBy(false);
  };

  const handlerAccount = (accountId) => {
    let acc = accountsManagedBy.filter((a) => a?.accountId === accountId)[0];
    let exist = false;
    for (const a of accountsManagedBySelected) {
      if (a.accountId === acc.accountId) {
        exist = true;
        break;
      }
    }

    if (exist) {
      formManagedBy.setFieldsValue({
        accountsIds: null,
      });

      return toast.warn("conta já selecionada");
    }

    setAccountManagedBySelected(acc);
    setOpenModalSelectAccountPermissions(true);
  };

  const removeManagedByAccount = (index) => {
    const list = [...accountsManagedBySelected];
    list.splice(index, 1);
    setAccountsManagedBySelected(list);

    if (list?.length > 0) {
      setIsDepartmentSelectDisabled(true);
    } else {
      setIsDepartmentSelectDisabled(false);
    }
  };

  const updateDepartmnetManagedBy = () => {
    let list = departmentsManagedBySelected;

    let index = list.findIndex(
      (d) => d?.departmentId === departmentManagedBySelected?.departmentId
    );

    if (index != null) {
      let department = departmentsManagedBy.filter(
        (d) => d?.id === departmentManagedBySelected?.departmentId
      )[0];

      if (department != null) {
        list[index] = {
          departmentId: department?.id,
          departmentName: department?.name,
          accountsIds: accountsManagedBySelected,
        };
      }
    }

    setDepartmentManagedBySelected(null);
    setAccountsManagedBy([]);
    setDepartmentsManagedBySelected(list);

    setActiveSelectManagedByAccount(false);

    formManagedBy.resetFields();
    setShowAddDepartment(false);
    setEditDepartmentManagedBy(false);
  };

  const activeSelectAccountsManagedBy = (departmentId) => {
    setDepartmentManagedBySelected(departmentId);
    setActiveSelectManagedByAccount(true);
    getAccountsByDepartmentId(departmentId, true, false);
  };

  const getSelectAccountsManagedBy = (e) => {
    let listAcc = [];

    for (const acc of accountsManagedBy) {
      let accountSelectedConv = {};
      accountSelectedConv.id = acc.id;
      accountSelectedConv.accountId = acc.accountId;
      accountSelectedConv.name = acc.name;
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
  };

  const allAccountsManagedBy = () => {
    setShowResposibleAccountsManagedBy(true);
    setOpenModalSelectAccountPermissions(true);
  };

  const closeModalAddAccountPermissionManagedBy = () => {
    formManagedBy.setFieldsValue({
      accountsIds: null,
    });
    formAccountPermission.resetFields();
    setOpenModalSelectAccountPermissions(false);
  };

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
        className="new-column"
        centered
        width={800}
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
        maskClosable={false}
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
                >
                  {accountsManagedBy?.map((e) => (
                    <Option key={e?.accountId} value={e?.accountId}>
                      {e?.name}
                    </Option>
                  ))}
                </Select>
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
        maskClosable={false}
        style={{ backgroundColor: "blue" }}
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

export default EditManagedBy;
