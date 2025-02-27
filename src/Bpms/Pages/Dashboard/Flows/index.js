"use client";
import {
  AppstoreOutlined,
  FileDoneOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  SettingOutlined,
  createFromIconfontCN,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  FloatButton,
  Form,
  Input,
  Result,
  Segmented,
  Skeleton,
  Space,
  Tooltip,
} from "antd";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useWebSocket from "react-use-websocket";
import { getToken } from "../../../../auth/keycloakConfig";
import FormInit from "../../../../Bpms/Pages/Dashboard/Components/FormInit";
import Config from "../../../../Bpms/Pages/Dashboard/Flows/Components/Column/ColumnConfig/ConfigOpenedBy";
import NewTask from "../../../../Bpms/Pages/Dashboard/Flows/Components/Task/Components/TaskNew";
import { FlowService } from "../../../../Services/Bpms/FlowServices/FlowService";
import "./style.module.css";
import Board from "../../../../Bpms/Pages/Dashboard/Flows/Components/Board";
import { getIcons } from "@/src/Bpms/components/Icons";
import { Row } from "antd/lib";

const FlowCreation = (props) => {
  const flowService = new FlowService();

  const router = useRouter();

  const params = useParams();

  const [t] = useTranslation("global");

  const [form] = Form.useForm();

  const [data, setData] = useState({
    tasks: {},
    columns: {},
    columnOrder: [],
  });

  const [loading, setLoading] = useState(false);

  const [permissions, setPermissions] = useState();

  const [isMyTask] = useState(() => {
    const queryString = router.asPath?.split("?")[1];
    if (queryString) {
      return new URLSearchParams(queryString).get("my-tasks");
    }
    return null;
  });

  const [taskId] = useState(() => {
    const queryString = router.asPath?.split("?")[1];
    if (queryString) {
      return new URLSearchParams(queryString).get("taskId");
    }
    return null;
  });

  const [isMyPendingWork] = useState(() => {
    const queryString = router.asPath?.split("?")[1];
    if (queryString) {
      return new URLSearchParams(queryString).get("my-pending-work");
    }
    return null;
  });

  const [activeSkeleton, setActiveSkeleton] = useState(true);

  const [hasFlowUpdate, setHasFlowUpdate] = useState(false);

  const [openNewTask, setOpenNewTask] = useState(false);

  const [openInitForm, setOpenInitForm] = useState(false);

  const [openTaskViewDetail, setOpenTaskViewDetail] = useState(false);

  const [openConfig, setOpenConfig] = useState(false);

  const [newTask, setNewTask] = useState(false);

  const [showMessageError, setShowMessageError] = useState(false);

  const [messageError, setMessageError] = useState();

  const [flow, setFlow] = useState();

  const [creatorName, setCreatorName] = useState("");

  const [token, setToken] = useState();

  const getTk = async () => {
    const tk = await getToken();
    setToken(tk);
  };

  useWebSocket(`${process.env.NEXT_PUBLIC_API_BPMS_URL_WS}/flows`, {
    queryParams: {
      "number-document": props?.account?.numberDocument,
      "custom-id": router?.query,
      schema: props?.account?.selectedInstance?.key,
      token: token,
      event: "FLOW_UPDATE",
      "type-view":
        isMyPendingWork == "true"
          ? "VALIDATOR"
          : isMyTask == "true"
          ? "MY_TASKS"
          : "ALL",
    },
    onOpen: () => {},
    onMessage: (e) => {
      const data = JSON.parse(e.data);
      let typeViewFront =
        isMyPendingWork == "true"
          ? "VALIDATOR"
          : isMyTask == "true"
          ? "MY_TASKS"
          : "ALL";
      if (data.typeView === typeViewFront) {
        setFlow(data);
      }
    },
    onError: () => {},
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000,
  });

  const getFlow = async () => {
    setLoading(true);

    let value =
      isMyPendingWork == "true"
        ? "VALIDATOR"
        : isMyTask == "true"
        ? "MY_TASKS"
        : "ALL";

    await flowService
      .getFlow(params.id, value)
      .then((response) => {
         setFlow(response);
      })
      .catch((error) => {
        setShowMessageError(true);
        setMessageError(error?.response?.data?.message);
      })
      .finally(() => {
        setHasFlowUpdate(false);
        setActiveSkeleton(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("Router:", router);
    if (params?.id != undefined) {
      getFlow()
    }
  }, [params?.id]);

  const getFlowSearch = async () => {
    setLoading(true);

    let value = null;

    await flowService
      .getFlowSearch({
        params: {
          "flow-id": null,
          name: null,
        },
      })
      .then((response) => {
        let steps = [];

        for (let step of flow?.steps) {
          let tasks = [];

          for (let task of response?.content) {
            if (step?.id === task?.stepCurrent?.id) {
              tasks.push(task);
            }
          }

          step.tasks = tasks;
          steps.push(step);
        }

        flow.steps = steps;
        setFlow(flow);
      })
      .catch((error) => {
        setShowMessageError(true);
        setMessageError(error?.response?.data?.message);
      })
      .finally(() => {
        setHasFlowUpdate(false);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (null) {
      getTk();
      getFlow();
      getPermissions();
    }
  }, []);

  const goToDashboard = () => {
    history.push(`/bpms`);
  };

  const GenerateIcon = (pathAws) => {
    return createFromIconfontCN({ scriptUrl: pathAws });
  };

  const reload = () => {
    setHasFlowUpdate(true);
    setActiveSkeleton(false);
    getFlow();
  };

  const getPermissions = async () => {
    await flowService
      .getPermissions()
      .then((response) => setPermissions(response))
      .catch((error) => {
        setShowMessageError(true);
        setMessageError(error?.response?.data?.message);
      });
  };

  return (
    <div>
      {!showMessageError && (
        <div className="content-dnd">
          <Skeleton avatar title={true} loading={loading}>
            <div
              className="menu-01"
              style={{
                borderTop: `3px solid ${flow?.config?.color}`,
                borderTopLeftRadius:
                  isMyTask == null && isMyPendingWork == null ? "8px" : "8px",
                borderTopRightRadius:
                  isMyTask == null && isMyPendingWork == null ? "8px" : "8px",
                borderBottomLeftRadius:
                  isMyTask == null && isMyPendingWork == null ? "0px" : "8px",
                borderBottomRightRadius:
                  isMyTask == null && isMyPendingWork == null ? "0px" : "8px",
                borderBottom:
                  isMyTask == null && isMyPendingWork == null
                    ? undefined
                    : "1px solid silver",
              }}
            >
              <div className="menu-01-left">
                <Avatar
                  shape="square"
                  size={50}
                  icon={getIcons(flow?.config?.iconName, flow?.config?.color)}
                  style={{ background: "none" }}
                />
              </div>
              <div className="menu-01-right">
                <Space>
                  <span className="menu-01-right-btn">{flow?.name}</span>
                </Space>
              </div>
            </div>
            {isMyTask == null && isMyPendingWork == null && (
              <div>
                <Row
                  className="menu-02"
                  style={{
                    position: "relative",
                    height: "50px",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between", // Garante que os elementos fiquem nas extremidades
                  }}
                >
                  <Col
                    xs={24}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{ paddingRight: "10px" }} // Adiciona um espaçamento à direita para responsividade
                  >
                    <Segmented
                      defaultValue="Kanban"
                      options={[
                        {
                          label: "Kanban",
                          value: "Kanban",
                          icon: <AppstoreOutlined />,
                        },
                      ]}
                      style={{ width: "100%", marginBottom: "12px" }}
                    />
                  </Col>
                  <Col
                    xs={24}
                    md={12}
                    lg={12}
                    xl={12}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end", // Alinha o conteúdo à direita
                      alignItems: "center",
                    }}
                  >
                    {isMyTask == null && isMyPendingWork == null && (
                      <Space style={{ display: "flex", alignItems: "center" }}>
                        <Input
                          placeholder={t("bpms.dashboard.flow.inputSearch")}
                          onChange={(e) => setCreatorName(e?.target?.value)}
                          value={creatorName}
                          style={{ width: "200px" }}
                        />
                        <Button
                          icon={
                            <SearchOutlined
                              style={{
                                fontSize: "12px",
                                verticalAlign: "middle",
                              }}
                            />
                          }
                          type="primary"
                          // onClick={() => getFlowSearch()}
                          onClick={() => getFlow()}
                          style={{ width: "32px", height: "32px", padding: 0 }}
                          disabled={!creatorName.trim()}
                        />
                        <Divider type="vertical" />
                        <Tooltip title="Formulário Inicial">
                          <Button
                            icon={
                              <FileDoneOutlined
                                style={{
                                  fontSize: "18px",
                                  verticalAlign: "middle",
                                }}
                              />
                            }
                            type="primary"
                            onClick={() => setOpenInitForm(true)}
                            style={{ minWidth: "100px" }}
                          >
                            {t("bpms.dashboard.flow.btnFormInit")}
                          </Button>
                        </Tooltip>
                        <Tooltip title="Configurações do Fluxo">
                          <Button
                            icon={
                              <SettingOutlined
                                style={{
                                  fontSize: "18px",
                                  verticalAlign: "middle",
                                }}
                              />
                            }
                            type="primary"
                            onClick={() => setOpenConfig(true)}
                            style={{ minWidth: "100px" }}
                          >
                            {t("bpms.dashboard.flow.btnFormConfig")}
                          </Button>
                        </Tooltip>
                      </Space>
                    )}
                  </Col>
                </Row>
              </div>
            )}
            {hasFlowUpdate && (
              <div>
                <br />
                <Alert
                  message="Há novas atualizações neste Fluxo."
                  description="Aguarde enquanto ocorre a atualização automática. caso não ocorra a atualização, tente atualizar a página utilizando a tecla F5 do seu teclado."
                  type="info"
                  showIcon
                />
                <br />
              </div>
            )}
            <Board
              flow={flow}
              data={data}
              setData={setData}
              getFlow={() => getFlow()}
              newTask={newTask}
              setOpenTaskViewDetail={setOpenTaskViewDetail}
              openTaskViewDetail={
                taskId != undefined ? true : openTaskViewDetail
              }
              isMyTask={isMyTask}
              isMyPendingWork={isMyPendingWork}
              taskId={taskId}
            />
            <FloatButton
              shape="square"
              icon={<PlusCircleOutlined />}
              type="primary"
              style={{
                maxWidth: "160px",
                minWidth: "130px",
                borderRadius: "8px",
                height: "40px",
              }}
              description={
                flow?.config?.nameButtonCreateTask == null
                  ? t("bpms.dashboard.flow.btnNameCreateTask")
                  : flow?.config?.nameButtonCreateTask
              }
              onClick={() => setOpenNewTask(true)}
              className="btnCriarAtividade"
            />
          </Skeleton>
        </div>
      )}

      <NewTask
        openNewTask={openNewTask}
        setOpenNewTask={setOpenNewTask}
        flow={flow}
        setNewTask={setNewTask}
        getFlow={() => getFlow()}
      />
      <FormInit
        openInitForm={openInitForm}
        setOpenInitForm={setOpenInitForm}
        flow={flow}
      />
      <Config
        setOpenConfig={setOpenConfig}
        openConfig={openConfig}
        flow={flow}
        getFlow={() => getFlow()}
        permissions={permissions}
      />

      {showMessageError && (
        <Card>
          <Result
            status="404"
            title="404"
            subTitle={messageError}
            extra={
              <Button type="primary" onClick={() => goToDashboard()}>
                Retornar
              </Button>
            }
          />
        </Card>
      )}
    </div>
  );
};

export default FlowCreation;
