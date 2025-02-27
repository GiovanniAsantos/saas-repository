"use client";
import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  List,
  Row,
  Skeleton,
  Tooltip,
} from "antd";
import Meta from "antd/es/card/Meta";
import { toast } from "react-toastify";
import TaskContent from "../../../../Bpms/Pages/Dashboard/Flows/Components/Task/Components/TaskView";
import { Container } from "./style";
import "./style.module.css";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import useWebSocket from "react-use-websocket";
import { getSecundaryColor } from "../../../../Bpms/Components/Colors";
import { getIcons } from "../../../../Bpms/components/Icons";
import { getToken } from "../../../../auth/keycloakConfig";
import { FlowService } from "../../../../Services/Bpms/FlowServices/FlowService";
import { useRouter } from "next/navigation";

export default function MyValidation(props) {
  const [t] = useTranslation("global");

  const flowService = new FlowService();

  const router = useRouter();

  const [form] = Form.useForm();

  const [openModal, setOpenModal] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [taskSelected, setTaskSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const [lineByPage, setLineByPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [flowsMe, setFlowsMe] = useState([]);

  const [token, setToken] = useState();

  const getTk = async () => {
    const tk = await getToken();
    setToken(tk);
  };

  useWebSocket(`${process.env.REACT_APP_API_KANBAN_URL_WS}/flows`, {
    queryParams: {
      "number-document": props?.account?.numberDocument,
      //"custom-id": null,
      schema: props?.account?.selectedInstance?.key,
      token: token,
      event: "FLOW_UPDATE_VALIDATED",
      "type-view": "VALIDATOR",
    },
    onOpen: () => {},
    onMessage: (e) => {
      getFlowsWithPendingWork();
    },
    onError: () => {},
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000,
  });

  const getFlowsWithPendingWork = async () => {
    setLoading(true);
    await flowService
      .getFlowsWithPendingWork()
      .then((response) => {
        setFlowsMe(response.content);
        setTotalElements(response.totalElements);
      })
      .catch(() => {
        toast.error("Erro ao carregar as atividades.");
      })
      .finally(() => {
        setLoading(false);
      });
      
  };

  const getFlowsWithPendingWorkSizeChange = async (current, size) => {
    setLoading(true);
    setPage(current);
    setLineByPage(size);

    await flowService
      .getFlowsWithPendingWorkSizeChange(current, size)
      .then((response) => {
        setFlowsMe(response.content);
        setTotalElements(response.totalElements);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getFlowsWithPendingWorkPaginationChange = async (page) => {
    setLoading(true);
    setPage(page);

    await flowService
      .getFlowsWithPendingWorkPaginationChange(page)
      .then((response) => {
        setFlowsMe(response.content);
        setTotalElements(response.totalElements);
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
      onShowSizeChange: getFlowsWithPendingWorkSizeChange,
      onChange: getFlowsWithPendingWorkPaginationChange,
    } || false;

  useEffect(() => {
    getTk();
    getFlowsWithPendingWork();
  }, []);

  const handleResponsibleChange = (value) => {
    setTaskSelected(value);
    setOpenModal(true);
  };

  const closeModal = () => {
    setTaskSelected(null);
    setOpenModal(false);
  };

  return (
    <div>
      <Container>
        <div className="header" style={{ height: "3.5vh" }}>
          <h6>
            {t("bpms.dashboard.myPendingTasks.header")} ({totalElements})
          </h6>
        </div>
      </Container>

      <Divider />

      {/* <div>
        <Divider type="vertical" />
        <a href="#">Todos</a>
        <Divider type="vertical" />
        <a href="#">Preste a vencer</a>
        <Divider type="vertical" />
        <a href="#">Vencidos</a>
        <Divider type="vertical" />
        <a href="#">Atrasados</a>
        <Divider type="vertical" />
        <a href="#">Expirados</a>
        <Divider type="vertical" />
        <a href="#">Concluídos</a>
        <Divider type="vertical" />
      </div> */}

      <Form form={form} layout="vertical">
        <Row gutter={[8, 16]}>
          <Col xs={24} xl={5}>
            <Form.Item name="name">
              <Input
                placeholder={t("bpms.dashboard.myPendingTasks.inputSearch")}
              />
            </Form.Item>
          </Col>

          <Col xs={24} xl={3}>
            <Button
              icon={
                <SearchOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              onClick={() => {
                getFlowsWithPendingWork();
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
        pagination={pagination}
        grid={{
          gutter: 8,
          column: 5,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 4,
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
                  hoverable
                  onClick={() =>
                    router.push(`/dashboard/flow/my-pending-tasks/${flow.id}`)
                  }
                  style={{
                    backgroundColor: `${getSecundaryColor(flow?.color)}`,
                    width: "100%",
                    maxHeight: "150px",
                    minHeight: "100px",
                    cursor: "pointer",
                  }}
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
                  <Divider />
                  <Row>
                    <Col>
                      <span style={{ fontSize: "12px" }}>
                        {flow?.amountTasks +
                          " " +
                          t("bpms.dashboard.myPendingTasks.cardInfo")}
                      </span>
                      <br />
                    </Col>
                  </Row>
                </Card>
              </div>
            </Skeleton>
          </List.Item>
        )}
      />

      <TaskContent
        taskId={taskSelected?.id}
        values={taskSelected}
        openTaskViewDetail={openModal}
        setOpenTaskViewDetail={setOpenModal}
        closeModal={closeModal}
        reloadTasks={getFlowsWithPendingWork}
        viewInit={false}
      />
    </div>
  );
}
