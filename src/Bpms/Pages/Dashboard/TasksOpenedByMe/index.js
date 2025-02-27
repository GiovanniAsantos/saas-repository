import { getIcons } from "@/src/Bpms/components/Icons";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";
import {
  CalendarOutlined,
  CarryOutOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  InfoCircleOutlined,
  OrderedListOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Row,
  Skeleton,
  Timeline,
  Tooltip,
} from "antd";
import Meta from "antd/es/card/Meta";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getSecundaryColor } from "../../../../Bpms/Components/Colors";
import NewTask from "../../../../Bpms/Pages/Dashboard/Flows/Components/Task/Components/TaskNew";
import { Container } from "./style";
import "./style.module.css";

export default function MyTasks(props) {
  const [t] = useTranslation("global");

  const router = useRouter();

  const [flowTemplate, setFlowTemplate] = useState([]);

  const flowService = new FlowService();

  const [form] = Form.useForm();

  const [openModal, setOpenModal] = useState(false);

  const [lineByPage, setLineByPage] = useState(10);

  const [page, setPage] = useState(1);

  const [totalElements, setTotalElements] = useState(0);

  const [lineByPageFlows, setLineByPageFlows] = useState(9);

  const [pageFlows, setPageFlows] = useState(1);

  const [totalElementsFlows, setTotalElementsFlows] = useState(0);

  const [tasks, setTasks] = useState([]);

  const [flows, setFlows] = useState([]);

  const [flowsMe, setFlowsMe] = useState([]);

  const [flowSelected, setFlowSelected] = useState();

  const [openNewTask, setOpenNewTask] = useState(false);

  const [newTask, setNewTask] = useState();

  const [loading, setLoading] = useState(false);

  const [isModalOpenFlowInfo, setOpenModalFlowInfo] = useState(false);

  const [isModalOpenStepsWithTasks, setIsModalOpenStepsWithTasks] =
    useState(false);

  const [flowInfo, setFlowInfo] = useState();

  const [dataStep, setDataStep] = useState([]);

  const iCON_WHITE_ORIGINAL_TRANSPARENT =
    process.env.REACT_APP_ICON_WHITE_ORIGINAL_TRANSPARENT;

  const getFlowsWithMyTasks = async () => {
    setLoading(true);
    try {
      const name = form.getFieldValue("name") || "";
      const response = await flowService.getFlowsWithMyTasks(name);
      setFlowsMe(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error("Erro ao carregar as atividades.");
    } finally {
      setLoading(false);
    }
  };

  const getFlowsWithMyTasksSizeChange = async (current, size) => {
    setLoading(true);
    setPage(current);
    setLineByPage(size);

    await flowService
      .getFlowsWithMyTasksSizeChange()
      .then((response) => {
        setFlowsMe(response.data.content);
        setTotalElements(response.data.totalElements);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getFlowsWithMyTasksPaginationChange = async (page) => {
    setLoading(true);
    setPage(page);

    await flowService
      .getFlowsWithMyTasksPaginationChange()
      .then((response) => {
        setFlowsMe(response.data.content);
        setTotalElements(response.data.totalElements);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const pagination =
    {
      disabled: loading,
      current: page,
      defaultPageSize: lineByPage,
      pageSize: lineByPage,
      total: totalElements,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "25", "30"],
      onShowSizeChange: getFlowsWithMyTasksSizeChange,
      onChange: getFlowsWithMyTasksPaginationChange,
    } || false;

  const getFlows = async () => {
    setLoading(true);
    try {
      const name = form.getFieldValue("name") || "";
      const response = await flowService.getFlowsOpenedBy(name);
      setFlowTemplate(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error("Erro ao carregar as atividades.");
    } finally {
      setLoading(false);
    }
  };

  const getFlowsSizeChange = async (current, size) => {
    setLoading(true);
    setPageFlows(current);
    setLineByPageFlows(size);

    await flowService
      .getFlowsSizeChangeOpenedBy()
      .then((response) => {
        setFlows(response.data.content);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getFlowsPaginationChange = async (pageFlows) => {
    setLoading(true);
    setPageFlows(pageFlows);

    await flowService
      .getFlowsPaginationChangeOpenedBy(pageFlows)
      .then((response) => {
        setFlows(response.content);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const paginationFlows =
    {
      disabled: loading,
      current: pageFlows,
      defaultPageSize: lineByPageFlows,
      pageSize: lineByPageFlows,
      total: totalElements,
      showSizeChanger: true,
      pageSizeOptions: ["9", "12", "15", "30"],
      onShowSizeChange: getFlowsSizeChange,
      onChange: getFlowsPaginationChange,
    } || false;

  useEffect(() => {
    getFlows();
    getFlowsWithMyTasks();
  }, []);

  const handleResponsibleChange = (value) => {
    setFlowSelected(value);
    setOpenNewTask(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setFlowSelected(null);
    form.resetFields();
    getFlows();
    getFlowsWithMyTasks();
  };

  const closeModalIgnoreGets = () => {
    setOpenModal(false);
    setFlowSelected(null);
    form.resetFields();
  };

  const showModal = () => {
    getFlows();
    setOpenModal(true);
  };

  const showFlowInfo = (flow) => {
    setFlowInfo(flow);
    setOpenModalFlowInfo(true);
  };

  const showModalStepsWithTasks = (flow) => {
    setFlowInfo(flow);
    createTimelineStepsitems(flow);
    setIsModalOpenStepsWithTasks(true);
  };

  const timelineItems = [
    {
      key: "description",
      icon: <FileDoneOutlined />,
      text: t("bpms.dashboard.myTasks.modalCreateTaskFields1"),
      content: flowInfo?.description,
      condition: flowInfo?.description != null,
      color: "gray",
    },
    {
      key: "createdAt",
      icon: <CalendarOutlined />,
      text: t("bpms.dashboard.myTasks.modalCreateTaskFields2"),
      content: dayjs(flowInfo?.createdAt).format("DD/MM/YYYY HH:mm"),
      color: "gray",
    },
    {
      key: "amountStep",
      icon: <OrderedListOutlined />,
      text: t("bpms.dashboard.myTasks.modalCreateTaskFields3"),
      content: `${flowInfo?.amountStep} Etapas`,
      color: "gray",
    },
    {
      key: "releasedAt",
      icon: <CarryOutOutlined />,
      text: t("bpms.dashboard.myTasks.modalCreateTaskFields4"),
      content: dayjs(flowInfo?.releasedAt).format("DD/MM/YYYY HH:mm"),
      color: "gray",
    },
  ];

  const createTimelineStepsitems = (flow) => {
    let allowSize = flow?.steps.length - 2;
    let newList = [];

    flow?.steps?.reverse()?.map((step) => {
      if (step?.sequence <= allowSize) {
        newList.push({
          key: "stepName",
          text: <Badge color={step?.color} text={step?.name} />,
          content: (
            <div>
              <span style={{ fontWeight: "bold" }}>
                Número de atividade(s):{" "}
              </span>{" "}
              <span>{step?.amountTasks}</span>
            </div>
          ),
          condition: step?.description != null,
          color: step?.color,
          amountTasks: step?.amountTasks,
        });
      }
    });
    setDataStep(newList?.filter((step) => step?.amountTasks > 0));
  };

  return (
    <div>
      <Container>
        <div className="header">
          <h6>
            {t("bpms.dashboard.myTasks.header")} ({totalElements})
          </h6>
          <Button
            onClick={() => showModal()}
            icon={
              <PlusCircleOutlined
                style={{ fontSize: "18px", verticalAlign: "middle" }}
              />
            }
            htmlType="button"
          >
            {t("bpms.dashboard.myTasks.btnNameCreateTask")}
          </Button>
        </div>
      </Container>

      <Divider />
      <Form form={form} layout="vertical">
        <Row gutter={[8, 8]}>
          <Col xs={24} xl={5} md={24} lg={24}>
            <Form.Item name="name">
              <Input
                placeholder={t("bpms.dashboard.myPendingTasks.inputSearch")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} xl={3} md={24} lg={24}>
            <Button
              icon={
                <SearchOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              onClick={() => {
                getFlowsWithMyTasks();
              }}
            >
              {t("bpms.dashboard.myTasks.btnSearch")}
            </Button>
          </Col>
        </Row>
      </Form>

      <List
        bordered
        loading={loading}
        style={{ border: "0px", marginTop: "10px" }}
        dataSource={flowsMe}
        size="small"
        key={"list"}
        grid={{
          gutter: 8,
          column: 5,
          xs: 1, // 1 coluna em telas muito pequenas
          sm: 2, // 2 colunas em telas pequenas
          md: 2, // 3 colunas em telas médias
          lg: 2, // 4 colunas em telas grandes
          xl: 4, // 4 colunas em telas muito grandes
        }}
        pagination={pagination}
        renderItem={(flow, index) => (
          <List.Item>
            <Skeleton avatar title={true} loading={loading} active>
              <div
                style={{
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <Card
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    backgroundColor: `${getSecundaryColor(flow?.color)}`,
                  }}
                  actions={[
                    <Tooltip title="Ver atividades em andamento">
                      <Button
                        style={{
                          boxShadow: "none",
                          backgroundColor: `${flow?.color}`,
                        }}
                        onClick={() => showModalStepsWithTasks(flow)}
                      >
                        <InfoCircleOutlined
                          style={{
                            color: "white",
                            fontSize: "15px",
                            verticalAlign: "middle",
                          }}
                        />
                      </Button>
                    </Tooltip>,
                    <Tooltip title="Abrir Fluxo">
                      <Button
                        style={{
                          boxShadow: "none",
                          backgroundColor: `${flow?.color}`,
                        }}
                        onClick={() =>
                          router.push(
                            `/dashboard/flow/tasks-opened-by-me/${flow.id}`
                          )
                        }
                      >
                        <EyeOutlined
                          style={{
                            color: "white",
                            fontSize: "15px",
                            verticalAlign: "middle",
                          }}
                        />
                      </Button>
                    </Tooltip>,
                  ]}
                >
                  <Tooltip zIndex={2901} title={`${flow?.name}`}>
                    <Meta
                      avatar={
                        <Avatar
                          shape="square"
                          icon={getIcons(flow?.iconEnumTag, flow?.color)}
                          style={{ background: "none" }}
                        />
                      }
                      title={
                        <span
                          style={{
                            fontSize: "13px",
                            merginTop: "10px",
                          }}
                        >
                          {flow?.name}
                        </span>
                      }
                    />
                  </Tooltip>
                </Card>
              </div>
            </Skeleton>
          </List.Item>
        )}
      />

      <Modal
        zIndex={2900}
        className="modal-pequeno"
        centered
        width={1100}
        title={t("bpms.dashboard.myTasks.modalCreateTaskTitle")}
        open={openModal}
        onCancel={() => closeModalIgnoreGets()}
        footer={[
          <Form form={form}>
            <Button
              icon={
                <CloseCircleOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              key="back"
              onClick={() => closeModalIgnoreGets()}
            >
              {t("bpms.dashboard.myTasks.modalBtnClose")}
            </Button>
          </Form>,
        ]}
        closable={false}
        closeIcon={false}
      >
        <div className="modal-select">
          <Form layout="vertical" form={form} name="form">
            <Form.Item
              name={"name"}
              label={t("bpms.dashboard.myTasks.modalCreateTaskSubtitle")}
              rules={[{ required: true }]}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} xl={5} md={24} lg={24}>
                  <Form.Item name="name">
                    <Input
                      placeholder={t(
                        "bpms.dashboard.myPendingTasks.inputSearch"
                      )}
                    />
                  </Form.Item>
                </Col>

                <Col xs={1} xl={3}>
                  <Button
                    icon={
                      <SearchOutlined
                        style={{ fontSize: "18px", verticalAlign: "middle" }}
                      />
                    }
                    onClick={() => {
                      getFlows();
                    }}
                  >
                    {t("bpms.dashboard.myTasks.btnSearch")}
                  </Button>
                </Col>
              </Row>
              <List
                className="cardCriarAtividade"
                bordered
                loading={loading}
                style={{
                  border: "0px",
                  marginTop: "10px",
                  overflowX: "hidden",
                }}
                dataSource={flows}
                pagination={paginationFlows}
                size="small"
                key={"list"}
                grid={{
                  gutter: [24, 24],
                  xs: 1,
                  sm: 1,
                  md: 2,
                  lg: 3,
                  xl: 3,
                  xxl: 3,
                }}
                renderItem={(flow, index) => (
                  <List.Item>
                    <Skeleton avatar title={true} loading={loading} active>
                      <div
                        style={{
                          borderRadius: "10px",
                          overflow: "hidden",
                        }}
                      >
                        <Card
                          style={{
                            width: "100%",
                            cursor: "pointer",
                            backgroundColor: `${getSecundaryColor(
                              flow?.color
                            )}`,
                          }}
                          actions={[
                            <Button
                              style={{
                                boxShadow: "none",
                                backgroundColor: `${flow?.color}`,
                              }}
                              onClick={() => showFlowInfo(flow)}
                            >
                              <InfoCircleOutlined
                                style={{
                                  color: "white",
                                  fontSize: "15px",
                                  verticalAlign: "middle",
                                }}
                              />
                            </Button>,
                            <Button
                              style={{
                                backgroundColor: "transparent",
                                border: "none",
                                boxShadow: "none",
                                backgroundColor: `${flow?.color}`,
                              }}
                              onClick={() => handleResponsibleChange(flow)}
                            >
                              <PlusOutlined
                                style={{
                                  fontSize: "15px",
                                  verticalAlign: "middle",
                                  color: "white",
                                }}
                              />
                            </Button>,
                          ]}
                        >
                          <div></div>
                          <Tooltip zIndex={2901} title={`${flow?.name}`}>
                            <div
                              style={{
                                width: "100%",
                                display: "flex", // Flexbox para alinhar os botões
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Meta
                                avatar={
                                  <Avatar
                                    shape="square"
                                    icon={getIcons(
                                      flow?.iconEnumTag,
                                      flow?.color
                                    )}
                                    style={{ background: "none" }}
                                  />
                                }
                                title={
                                  <span
                                    style={{
                                      fontSize: "13px",
                                      merginTop: "10px",
                                    }}
                                  >
                                    {flow?.name}
                                  </span>
                                }
                              />
                            </div>
                          </Tooltip>
                        </Card>
                      </div>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        style={{
          borderTop: "5px solid",
          borderTopColor: `${flowInfo?.color}`,
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
        }}
        footer={false}
        centered
        zIndex={3000}
        onCancel={() => setOpenModalFlowInfo(false)}
        open={isModalOpenFlowInfo}
      >
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
          {t("bpms.dashboard.myTasks.modalCreateTaskMoreTitle")}
        </h1>
        <Divider dashed />
        <div>
          <div
            style={{
              display: "flex",
              fontSize: "25px",
              fontWeight: "bold",
              alignItems: "center",
              justifyContent: "left",
            }}
          >
            <Meta
              avatar={
                <Avatar
                  shape="square"
                  style={{
                    display: "flex",
                    marginBottom: "10px",
                    fontWeight: "bold",
                  }}
                  src={flowInfo?.icon}
                />
              }
            />
            <p style={{ marginLeft: "15px" }}>{flowInfo?.name}</p>
          </div>
          <br />
          <Timeline mode="left">
            {timelineItems.map(
              (item, index) =>
                item.condition !== false && (
                  <Timeline.Item key={index} color={item.color}>
                    <div>
                      {item.icon && (
                        <div
                          style={{
                            display: "inline-block",
                            marginRight: "5px",
                          }}
                        >
                          {item.icon}
                        </div>
                      )}
                      <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                        {item.text}
                      </span>
                    </div>
                    <p>{item.content}</p>
                  </Timeline.Item>
                )
            )}
          </Timeline>
        </div>
      </Modal>

      <Modal
        style={{
          borderTop: "5px solid",
          borderTopColor: `${flowInfo?.color}`,
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
        }}
        footer={false}
        centered
        zIndex={3000}
        onCancel={() => setIsModalOpenStepsWithTasks(false)}
        open={isModalOpenStepsWithTasks}
      >
        <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
          {t("bpms.dashboard.myTasks.modalCreateTaskMoreTitle")}
        </h1>
        <Divider dashed />
        <div
          style={{
            display: "flex",
            fontSize: "25px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "left",
          }}
        >
          <Meta
            avatar={
              <Avatar
                shape="square"
                style={{
                  display: "flex",
                  marginBottom: "10px",
                  fontWeight: "bold",
                }}
                src={flowInfo?.icon}
              />
            }
          />
          <p style={{ marginLeft: "15px" }}>{flowInfo?.name}</p>
        </div>
        <span>Seguem informações sobre cada Etapa do Fluxo</span>
        <br />
        <br />
        {dataStep.map(
          (item, index) =>
            item.condition !== false && (
              <div>
                {item.icon && (
                  <div style={{ display: "inline-block", marginRight: "5px" }}>
                    {item.icon}
                  </div>
                )}
                <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                  {item.text}
                </span>
                <br />
                <p style={{ marginLeft: "10px" }}>{item.content}</p>
              </div>
            )
        )}
      </Modal>

      <NewTask
        openNewTask={openNewTask}
        setOpenNewTask={setOpenNewTask}
        flow={flowSelected}
        setNewTask={setNewTask}
        closeModal={closeModal}
      />
    </div>
  );
}
