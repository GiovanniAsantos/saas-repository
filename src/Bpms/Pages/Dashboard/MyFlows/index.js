"use client";
import { useEffect, useState } from "react";
import { Container } from "./style";
import { FlowService } from "@/src/Services/Bpms/FlowServices/FlowService";
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons";
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
  Progress,
  Row,
  Skeleton,
  Tooltip,
} from "antd";
import Meta from "antd/es/card/Meta";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getSecundaryColor } from "../../../../Bpms/Components/Colors";
import { getIcons } from "../../../../Bpms/components/Icons";
import CreateOrUpdate from "../../../../Bpms/Pages/Dashboard/MyFlows/FlowConfig";
import { verifyPermissionByService } from "../../../../Services/PermissionService";
import { useKeycloak } from "@/src/auth/keycloakProvider";
import { useRouter } from "next/navigation";

export default function MyFlowsTemplates(props) {
  const [t] = useTranslation("global");

  const router = useRouter();

  const { account } = useKeycloak();

  const flowService = new FlowService();

  const [form] = Form.useForm();

  const [lineByPage, setLineByPage] = useState(10);

  const [page, setPage] = useState(1);

  const [totalElements, setTotalElements] = useState(0);

  const [openModal, setOpenModal] = useState(false);

  const [flows, setFlows] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFlows();
  }, []);

  const getFlows = async () => {
    setLoading(true);
    try {
      const name = form.getFieldValue("name") || "";
      const response = await flowService.getFlowsMenagedBy(name);
      setFlows(response.content);
      setTotalElements(response.totalElements);
    } catch (error) {
      toast.error("Erro ao carregar as atividades.");
    } finally {
      setLoading(false);
    }
  };

  const getFlowsSizeChange = async (current, size) => {
    setLoading(true);
    setPage(current);
    setLineByPage(size);

    await flowService
      .getFlowsSizeChange()
      .then((response) => {
        setFlows(response.content);
        setTotalElements(response.totalElements);
      })
      .catch((error) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const getFlowsPaginationChange = async (page) => {
    setLoading(true);
    setPage(page);

    await flowService
      .getFlowsPaginationChange()
      .then((response) => {
        setFlows(response.content);
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
      showTitle: t("bpms.dashboard.myFlows.btnSearch"),
      current: page,
      defaultPageSize: lineByPage,
      pageSize: lineByPage,
      total: totalElements,
      showSizeChanger: true,
      pageSizeOptions: ["8", "10", "20", "25", "30"],
      onShowSizeChange: getFlowsSizeChange,
      onChange: getFlowsPaginationChange,
    } || false;

  return (
    <div>
      <Container>
        <div className="header" style={{ height: "3.5vh" }}>
          <h6>
            {t("bpms.dashboard.myFlows.header")} ({flows?.length})
          </h6>
          {verifyPermissionByService(
            account,
            "ALLOW_MODULE_BPMS",
            "FLOW_CREATE"
          ) && (
            <Button
              onClick={() => setOpenModal(!openModal)}
              icon={
                <PlusCircleOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              htmlType="button"
              type="primary"
            >
              {t("bpms.dashboard.myFlows.btnNameCreateNewFlow")}
            </Button>
          )}
        </div>
      </Container>

      <Divider />

      <Form form={form} layout="vertical">
        <Row gutter={[8, 16]}>
          <Col xs={24} xl={5}>
            <Form.Item name="name">
              <Input placeholder={t("bpms.dashboard.myFlows.inputSearch")} />
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
                getFlows();
              }}
            >
              {t("bpms.dashboard.myFlows.btnSearch")}
            </Button>
          </Col>
        </Row>
      </Form>

      <List
        bordered
        loading={loading}
        style={{ border: "0px", marginTop: "10px" }}
        dataSource={flows}
        pagination={pagination}
        size="small"
        key={"list"}
        grid={{
          gutter: 8,
          column: 5,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 4,
        }}
        renderItem={(flow, index) => {
          return (
            <List.Item>
              <Skeleton avatar title={true} loading={loading} active>
                <div
                  style={{
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  {flow && (
                    <Card
                      onClick={() => {
                        router.push(`/dashboard/flow/my-flows/${flow.id}`);
                      }}
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        minHeight: "100px",
                        borderTop: "none",
                        cursor: "pointer",
                        backgroundColor: `${getSecundaryColor(flow?.color)}`,
                      }}
                      className="cardMyFlows"
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
                            <span style={{ fontSize: "13px" }}>
                              {flow?.name}
                            </span>
                          }
                        />
                      </Tooltip>
                      <Divider />
                      <Tooltip
                        zIndex={2901}
                        title={
                          <div>
                            <span>
                              <Badge
                                color={
                                  flow?.existsFormInitial ? "green" : "red"
                                }
                              />
                              {t(
                                "bpms.dashboard.myFlows.cardInfoMyFlowsFormInit"
                              )}
                            </span>
                            <br />
                            <span>
                              <Badge
                                color={flow?.wasReleased ? "green" : "red"}
                              />
                              {t(
                                "bpms.dashboard.myFlows.cardInfoMyFlowsLaunched"
                              )}
                            </span>
                          </div>
                        }
                      >
                        <Row
                          vertical
                          gap="small"
                          style={{
                            width: 180,
                          }}
                        >
                          {flow?.existsFormInitial && flow?.wasReleased ? (
                            <Progress
                              strokeColor={flow?.color}
                              percent={100}
                              size="small"
                              status="active"
                            />
                          ) : flow?.existsFormInitial ? (
                            <Progress
                              strokeColor={flow?.color}
                              percent={50}
                              size="small"
                              status="active"
                            />
                          ) : (
                            <Progress percent={0} size="small" />
                          )}
                        </Row>
                      </Tooltip>
                    </Card>
                  )}
                </div>
              </Skeleton>
            </List.Item>
          );
        }}
      />
      <CreateOrUpdate openModal={openModal} setOpenModal={setOpenModal} />
    </div>
  );
}
