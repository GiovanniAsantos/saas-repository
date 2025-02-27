import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Input,
  Space,
  Spin,
  Table,
  Tooltip,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { MdEdit, MdOutlinePersonRemoveAlt1, MdPersonAdd } from "react-icons/md";
import { toast } from "react-toastify";
import {
  ModalAddUserToDepartment,
  ModalConfirmDelete,
  ModalCreateDepartment,
  ModalDepartmentInfo,
  ModalUpdateDepartment,
} from "./style";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";

const DepartmentNode = ({ data }) => {
  const [formCreateDepartment] = useForm();
  const [formAddUser] = useForm();
  const [formUpdateDepartment] = useForm();
  const flowService = new FlowService();
  const [loading, setLoading] = useState(false);
  const [loadingCreation, setLoadingCreation] = useState(false);
  const [loadingDepartmentAccounts, setLoadingDepartmentAccounts] =
    useState(false);
  const [organIdSelected, setDepartmentIdSelected] = useState(null);
  const [organSelected, setDepartmentSelected] = useState();
  const [organSelectedUsers, setDepartmentSelectedUsers] = useState([]);
  const [columnsDepartments, setColumnsDepartments] = useState([]);
  const [createDepartmentModalVisible, setCreateDepartmentModalVisible] =
    useState(false);
  const [organModalInfoVisible, setDepartmentModalInfoVisible] =
    useState(false);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false);
  const [updateDepartmentModalVisible, setUpdateDepartmentModalVisible] =
    useState(false);
  const [confirmDeleteDepartment, setConfirmDeleteDepartment] = useState(false);
  const [userAvailableList, setUserAvailableList] = useState([]);
  const [userAvailableSelected, setUserAvailableSelected] = useState([]);
  const closeUpdateDepartmentModal = () => {
    setUpdateDepartmentModalVisible(false);
    formUpdateDepartment.resetFields();
  };
  const closeDepartmentModalInfo = () => {
    setDepartmentModalInfoVisible(false);
    setDepartmentSelectedUsers([]);
  };
  const openAddUserModal = () => {
    getUsersAvailable();
    setAddUserModalVisible(true);
  };
  const openUpdateDepartmentModal = () => {
    formUpdateDepartment.setFieldValue("name", organSelected?.name);
    formUpdateDepartment.setFieldValue(
      "description",
      organSelected?.description
    );
    setUpdateDepartmentModalVisible(true);
  };
  const openCreateDepartmentModal = (id) => {
    setCreateDepartmentModalVisible(true);
    setDepartmentIdSelected(id);
  };
  const openDeleteDepartmentModal = (id) => {
    setConfirmDeleteDepartment(true);
    setDepartmentIdSelected(id);
  };
  const closeCreateDepartmentModal = () => {
    setDepartmentIdSelected(null);
    setCreateDepartmentModalVisible(false);
    formCreateDepartment.resetFields();
  };
  const openDepartmentModalInfo = (id) => {
    getDepartmentInfo(id);
  };
  
  const columnsUsers = [
    {
      title: "Foto",
      dataIndex: "photo",
      key: "photo",
      width: 65,
      render: (_, record) => (
        <>
          {record?.instancePhotos && record?.instancePhotos.length > 0 ? (
            <Avatar src={record?.instancePhotos[0].path} size={40} />
          ) : record?.workflowPhoto && record?.workflowPhoto.length > 0 ? (
            <Avatar src={record?.workflowPhoto[0].path} size={40} />
          ) : (
            <Avatar size={40}>
              {record?.name.split(" ")?.length > 1
                ? record?.name.split(" ")[0].substring(0, 2).toUpperCase()
                : record?.name.substring(0, 2).toUpperCase()}
            </Avatar>
          )}
        </>
      ),
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Documento",
      dataIndex: "numberDocument",
      key: "numberDocument",
    },
    {
      title: "Ação",
      dataIndex: "action",
      width: 100,
      render: (_, record) => (
        <>
          <Tooltip title={"Remover Usuário"}>
            <button
              type="button"
              className="removeUser"
              onClick={() => removeUserFromDepartmentSelected(record?.id)}
            >
              <MdOutlinePersonRemoveAlt1 size={20} />
            </button>
          </Tooltip>
        </>
      ),
    },
  ];

  const columnsUserAvailable = [
    {
      title: "",
      width: 40,
      render: (_, record) => {
        return (
          <Form.Item name={`checkbox-${record?.id}`}>
            <Checkbox
              onChange={(v) =>
                handleChangeUserCheckbox(v.target.checked, record?.id)
              }
            />
          </Form.Item>
        );
      },
    },
    {
      title: "Foto",
      key: "id",
      render: (_, record) => (
        <>
          {record?.instancePhotos && record?.instancePhotos.length > 0 ? (
            <Avatar src={record?.instancePhotos[0].typePhoto} size={40} />
          ) : record?.workflowPhoto && record?.workflowPhoto.length > 0 ? (
            <Avatar src={record?.workflowPhoto[0].typePhoto} size={40} />
          ) : (
            <Avatar size={40}>
              {record?.name.split(" ")?.length > 1
                ? record?.name.split(" ")[0].substring(0, 2).toUpperCase()
                : record?.name.substring(0, 2).toUpperCase()}
            </Avatar>
          )}
        </>
      ),
    },
    {
      title: "Nome",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Nº Documento",
      key: "numberDocument",
      dataIndex: "numberDocument",
    },
  ];

  const updateDepartment = async () => {
    setLoadingCreation(true);

    await flowService
      .updateDepartment({
        id: organSelected?.id,
        name: formUpdateDepartment.getFieldValue("name"),
        description: formUpdateDepartment.getFieldValue("description"),
        parentDepartmentId: organSelected?.parentDepartment?.id,
      })
      .then(() => {
        toast.success("Departamento Criado com sucesso");
        organSelected?.id && getDepartmentInfo(organSelected?.id);
        closeUpdateDepartmentModal();
        data?.updateDepartments();
      })
      .catch((error) => {
        console.error(error.response.data);
      })
      .finally(() => {
        setLoadingCreation(false);
      });
  };

  const getDepartmentInfo = async (id) => {
    setLoading(true);
    await flowService
      .getDepartmentInfo(id)
      .then((response) => {
        setDepartmentSelected(response);

        const departamentoAccountsSemAccount = response?.departmentAccounts.map(
          (item) => item.account
        );

        setDepartmentSelectedUsers(
          departamentoAccountsSemAccount ? departamentoAccountsSemAccount : []
        );
        setDepartmentModalInfoVisible(true);
      })
      .catch(() => {
        toast.error("Erro ao buscar informações do Departamento");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddUserToDepartment = async () => {
    setLoadingDepartmentAccounts(true);
    const request = {
      accountIds: {
        idsToChange: userAvailableSelected ? userAvailableSelected : [],
      },
      departmentId: organSelected?.id,
    };

    if (userAvailableSelected.length === 0) {
      setLoadingDepartmentAccounts(false);
      toast.info("Nenhum usuário selecionado");
    } else {
      closeAddUserModal();
      await flowService
        .addUserToDepartment(request)
        .then(() => {
          toast.success("Usuários adicionado com sucesso");
          organSelected?.id && getDepartmentInfo(organSelected?.id);
          setDepartmentSelectedUsers([]);
          data?.updateDepartments();
        })
        .catch(() => {
          toast.error("Erro ao Adicionar usuários");
        })
        .finally(() => {
          setLoadingDepartmentAccounts(false);
        });
    }
  };

  const getUsersAvailable = async () => {
    await flowService
      .getUsersAvailable()
      .then((response) => {
        setUserAvailableList(response);
      })
      .catch(() => {
        toast.error("Erro ao buscar usuários");
      });
  };

  const createDepartment = async () => {
    setLoadingCreation(true);

    await flowService
      .createDepartment({
        name: formCreateDepartment.getFieldValue("name"),
        description: formCreateDepartment.getFieldValue("description"),
        parentDepartmentId: organIdSelected,
      })
      .then(() => {
        toast.success("Departamento Criado com sucesso");
        closeCreateDepartmentModal();
        data?.updateDepartments();
      })
      .catch((error) => {
        console.error(error.response.data);
      })
      .finally(() => {
        setLoadingCreation(false);
      });
  };

  const removeUserFromDepartmentSelected = async (userId) => {
    setLoadingDepartmentAccounts(true);

    const request = {
      accountIds: {
        idsToChange: [userId],
      },
      departmentId: organSelected?.id,
    };

    if (organSelected?.id !== undefined && userId !== undefined) {
      await flowService
        .removeUserFromDepartment(request)
        .then(() => {
          toast.success("Usuário removido com sucesso");
          organSelected?.id && getDepartmentInfo(organSelected?.id);
          data?.updateDepartments();
        })
        .catch(() => {
          toast.error("Erro ao remover usuário");
        })
        .finally(() => {
          setLoadingDepartmentAccounts(false);
        });
    } else {
      toast.error("Erro ao remover usuário");
      setLoadingDepartmentAccounts(false);
    }
  };

  const deleteDepartment = async () => {
    setLoadingDepartmentAccounts(true);
    setConfirmDeleteDepartment(false);

    await flowService
      .deleteDepartment(organIdSelected)
      .then(() => {
        toast.success("Departamento removido com sucesso");
        closeDepartmentModalInfo();
        data?.updateDepartments();
      })
      .catch(() => {
        toast.error("Erro ao remover Departamento");
      })
      .finally(() => {
        setLoadingDepartmentAccounts(false);
      });
  };

  const closeAddUserModal = () => {
    setAddUserModalVisible(false);
    setUserAvailableSelected([]);
    formAddUser.resetFields();
  };

  const handleChangeUserCheckbox = (value, id) => {
    if (value) {
      if (!userAvailableSelected.includes(id)) {
        setUserAvailableSelected([...userAvailableSelected, id]);
      }
    } else {
      setUserAvailableSelected(
        userAvailableSelected.filter((userId) => userId !== id)
      );
    }
  };

  return (
    <div className="department-node">
      <Card
        title={data.label}
        style={{ borderTop: `5px solid ${data?.color}` }}
      >
        <p className="custom-node-title">{data.description}</p>
        <Divider dashed />
        <Space>
          <Tooltip title={"Atualizar Departamento"}>
            <Button
              onClick={() => openDepartmentModalInfo(data?.id)}
              icon={<EditOutlined />}
            />
          </Tooltip>
          <Tooltip title={"Adicionar um SubDepartamento"}>
            <Button
              onClick={() => openCreateDepartmentModal(data?.id)}
              icon={<PlusOutlined />}
            />
          </Tooltip>
          <Tooltip
            title={
              "Remover departamento - Ao remover, todos os departamentos ligados ao mesmo será removido também."
            }
          >
            <Button
              onClick={() => openDeleteDepartmentModal(data?.id)}
              icon={<DeleteOutlined />}
            />
          </Tooltip>
        </Space>
      </Card>

      <ModalCreateDepartment
        open={createDepartmentModalVisible}
        onCancel={() => closeCreateDepartmentModal()}
        title={<h2>Criar Departamento</h2>}
        onOk={() => formCreateDepartment.submit()}
      >
        <Spin spinning={loadingCreation}>
          <Form
            form={formCreateDepartment}
            layout="vertical"
            onFinish={createDepartment}
          >
            <Form.Item
              label="Nome do Departamento"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Insira o nome do departamento",
                },
              ]}
            >
              <Input
                className="inputMod"
                placeholder="Insira o nome departamento"
                maxLength={30}
              />
            </Form.Item>

            <Form.Item label="Descrição" name="description">
              <Input
                className="inputMod"
                placeholder="Insira a descrição do departamento"
                maxLength={50}
              />
            </Form.Item>
          </Form>
        </Spin>
      </ModalCreateDepartment>

      <ModalDepartmentInfo
        open={organModalInfoVisible}
        footer={""}
        onCancel={() => closeDepartmentModalInfo()}
        width={600}
        title={<h4>Informações do Departamento: {organSelected?.name}</h4>}
      >
        <Spin spinning={loadingDepartmentAccounts}>
          <p className="description">{organSelected?.description}</p>
          <div className="buttonGroup">
            <button type="button" onClick={() => openAddUserModal()}>
              <MdPersonAdd size={20} /> Usuário
            </button>
            <div className="organOptions">
              <button type="button" onClick={() => openUpdateDepartmentModal()}>
                <MdEdit size={20} />
                Departamento
              </button>
              {/* <button
                className="removeBtn"
                type="button"
                onClick={() => setConfirmDeleteDepartment(true)}
              >
                <MdOutlineRemoveCircle size={20} />
                Excluir
              </button> */}
            </div>
          </div>
          <Table
            dataSource={organSelectedUsers}
            columns={columnsUsers}
            scroll={{ y: 240 }}
            pagination={{ pageSize: 50 }}
          />
        </Spin>
      </ModalDepartmentInfo>

      <ModalAddUserToDepartment
        open={addUserModalVisible}
        onOk={() => handleAddUserToDepartment()}
        onCancel={() => closeAddUserModal()}
        title={<h4>Adicionar Usuários ao Departamento</h4>}
      >
        <div className="checkboxContainer">
          <Form form={formAddUser}>
            <Table
              className="tableUsers"
              scroll={{ y: 240 }}
              columns={columnsUserAvailable}
              dataSource={userAvailableList}
            />
          </Form>
        </div>
      </ModalAddUserToDepartment>

      <ModalConfirmDelete
        open={confirmDeleteDepartment}
        onOk={() => deleteDepartment()}
        onCancel={() => setConfirmDeleteDepartment(false)}
      >
        <h4>
          Tem certeza que deseja remover o Departamento {organSelected?.name}?
        </h4>
        <p>
          Todos os departamentos que estão abaixo dele e seus usuários vão ser
          removidos também!
        </p>
      </ModalConfirmDelete>

      <ModalUpdateDepartment
        open={updateDepartmentModalVisible}
        onOk={() => formUpdateDepartment.submit()}
        onCancel={() => closeUpdateDepartmentModal()}
        title={<h4>Atualizar informações do Departamento</h4>}
      >
        <Spin spinning={loadingCreation}>
          <Form
            form={formUpdateDepartment}
            layout="vertical"
            onFinish={() => updateDepartment()}
          >
            <Form.Item
              label="Nome do Departamento"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Insira o nome do departamento",
                },
              ]}
            >
              <Input
                className="inputMod"
                placeholder="Insira o nome departamento"
                maxLength={30}
              />
            </Form.Item>

            <Form.Item label="Descrição" name="description">
              <Input
                className="inputMod"
                placeholder="Insira a descrição do departamento"
                maxLength={50}
              />
            </Form.Item>
          </Form>
        </Spin>
      </ModalUpdateDepartment>
    </div>
  );
};

export default DepartmentNode;
