import {
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DollarOutlined,
  EditOutlined,
  FieldNumberOutlined,
  FileOutlined,
  FormOutlined,
  InfoCircleOutlined,
  LeftCircleOutlined,
  PaperClipOutlined,
  RightCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Result,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Timeline,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "./style.module.css";
import { useTranslation } from "react-i18next";
import aceite from "../../../../../../../../assets/img/brand/aceite.png";
import ModalViewFile from "../../../../../../../../Bpms/Components/ModalViewFiles";
import FieldAtt from "../../../../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldAtt";
import FieldCoin from "../../../../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldCoin";
import FieldDate from "../../../../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldDate";
import FieldDateTime from "../../../../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldDateTime";
import FieldNumber from "../../../../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldNumber";
import FieldText from "../../../../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldText";
import FieldTextArea from "../../../../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldTextArea";
import FieldTextDinamic from "../../../../../../../../Bpms/Pages/Dashboard/Flows/Components/Field/Components/FieldTextDinamic";
const { Option } = Select;
import { TaskService } from "../../../../../../../../Services/Bpms/TasksServices/TaskServices";
import { CloudService } from "@/src/Services/CloudService";
import { SignatureService } from "@/src/Services/SignatureService";

const TaskContent = ({
  openTaskViewDetail,
  setOpenTaskViewDetail,
  steps,
  taskId,
  values,
  viewInit,
  closeModal,
  props,
}) => {
  const [t] = useTranslation("global");

  const taskService = new TaskService();

  const cloudService = new CloudService();

  const signatureService = new SignatureService();

  const [task, setTask] = useState();

  const [openAccept, setOpenAccept] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [loadingMainModal, setLoadingMainModal] = useState(false);

  const [openReturnModal, setOpenReturnModal] = useState(false);

  const [openCancelModal, setOpenCancelModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [okDisabled, setOkDisabled] = useState(false);

  const [form] = Form.useForm();

  const [formCancel] = Form.useForm();

  const [formReturn] = Form.useForm();

  const [formAccept] = Form.useForm();

  const { TextArea } = Input;

  const [showDescription, setShowDescription] = useState(false);

  const [stepsEnable, setStepsEnable] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedStep, setSelectedStep] = useState(null);

  const [modalAttView, setModalAttView] = useState(false);

  const [allFoundFiles, setAllFoundFiles] = useState([]);

  const [cloudUuid, setCloudUuid] = useState([]);

  const [fileSelected, setFileSelected] = useState();

  const [selectedFiles, setSelectedFiles] = useState([]);

  const [isRequired, setIsRequired] = useState(true);

  const [fieldsUUID, setFieldsUUID] = useState([]);

  const [fileKey, setFileKey] = useState();

  const [listGetProfile, setlistGetProfile] = useState([]);

  const websitePath = process.env.REACT_APP_SITE_PATH;

  const iCON_WHITE_ORIGINAL_TRANSPARENT =
    process.env.REACT_APP_ICON_WHITE_ORIGINAL_TRANSPARENT;

  const [colorCache, setColorCache] = useState({});

  const getSteps = async () => {
    try {
      const response = await taskService.getSteps(values?.stepCurrent.id);
      setStepsEnable(response?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const getAllFoundFiles = async () => {
    try {
      const response = await taskService.getAllFoundFiles();
      setAllFoundFiles(response?.data);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const calcTime = (updatedAt, time, timeUnit) => {
    if (!updatedAt || !time || !timeUnit) {
      return "";
    }

    const vencimento = dayjs(updatedAt);
    let novaData;

    if (timeUnit === "MINUTE") {
      novaData = vencimento.add(time, "minute");
    } else if (timeUnit === "HOUR") {
      novaData = vencimento.add(time, "hour");
    } else if (timeUnit === "DAY") {
      novaData = vencimento.add(time, "day");
    } else {
      return "Unidade de tempo inválida";
    }

    if (!novaData || !novaData.isValid()) {
      return "Erro no cálculo do tempo";
    }

    const dataAtual = dayjs();
    const diff = novaData.diff(dataAtual);

    if (diff <= 0 && values?.emailStatus === "ADM") {
      const tempoVencido = dataAtual.diff(vencimento);
      const diffMinutes = Math.floor(tempoVencido / (1000 * 60));
      const dias = Math.floor(diffMinutes / (60 * 24));
      const horas = Math.floor((diffMinutes % (60 * 24)) / 60);
      const minutos = diffMinutes % 60;

      let tempoPassado = "";
      if (dias > 0) {
        tempoPassado += `${dias} dia${dias > 1 ? "s" : ""} `;
      }
      if (horas > 0) {
        tempoPassado += `${horas} hora${horas > 1 ? "s" : ""} `;
      }
      if (minutos > 0 || tempoPassado === "") {
        tempoPassado += `${minutos} minuto${minutos > 1 ? "s" : ""}`;
      }

      return `há ${tempoPassado.trim()}`;
    }

    const diffMinutes = Math.floor(diff / (1000 * 60));
    const dias = Math.floor(diffMinutes / (60 * 24));
    const horas = Math.floor((diffMinutes % (60 * 24)) / 60);
    const minutos = diffMinutes % 60;

    let tempoRestante = "";
    if (dias > 0) {
      tempoRestante += `${dias} dia${dias > 1 ? "s" : ""} `;
    }
    if (horas > 0) {
      tempoRestante += `${horas} hora${horas > 1 ? "s" : ""} `;
    }
    if (minutos > 0 || tempoRestante === "") {
      tempoRestante += `${minutos} minuto${minutos > 1 ? "s" : ""}`;
    }

    return `em ${tempoRestante.trim()}`;
  };

  const getRandomColor = (name) => {
    if (!name) return "#000";

    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    const intToRGB = (i) => {
      const r = (i >> 16) & 0xff;
      const g = (i >> 8) & 0xff;
      const b = i & 0xff;

      const limitedR = Math.max(64, Math.min(192, r));
      const limitedG = Math.max(64, Math.min(192, g));
      const limitedB = Math.max(64, Math.min(192, b));

      return `#${((1 << 24) + (limitedR << 16) + (limitedG << 8) + limitedB)
        .toString(16)
        .slice(1)}`;
    };

    return intToRGB(hash);
  };

  const getAccountsAvatar = (taskTemp) => {
    const allAccounts =
      taskTemp?.stepCurrent?.validatedBy?.flatMap(
        (department) => department.accounts
      ) || [];

    if (allAccounts.length === 0) {
      return null;
    }

    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Avatar.Group
          maxCount={2}
          size="small"
          maxStyle={{
            color: "white",
            backgroundColor: "gray",
          }}
        >
          {allAccounts.map((account) => {
            const { simplePhotos, name, id } = account;

            if (!colorCache[id]) {
              const color = getRandomColor(name);
              setColorCache((prevCache) => ({
                ...prevCache,
                [id]: color,
              }));
            }

            const avatarColor = colorCache[id] || getRandomColor(name);

            const getAvatarInitials = (fullName) => {
              const nameParts = fullName.split(" ");
              const firstInitial = nameParts[0]?.charAt(0) || "";
              const lastInitial =
                nameParts[nameParts.length - 1]?.charAt(0) || "";
              return firstInitial + lastInitial;
            };

            if (!simplePhotos[0]?.path) {
              return (
                <Tooltip key={id} title={name} placement="top">
                  <Avatar style={{ backgroundColor: avatarColor }}>
                    {getAvatarInitials(name).toUpperCase()}
                  </Avatar>
                </Tooltip>
              );
            } else {
              return (
                <Tooltip key={id} title={name} placement="top">
                  <Avatar src={simplePhotos[0]?.path} alt={name} />
                </Tooltip>
              );
            }
          })}
        </Avatar.Group>
      </div>
    );
  };

  const generate = (taskTemp) => {
    let list = [];

    list.push(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          justifyContent: "space-between",
          maxWidth: "300px",
          maxHeight: "400px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          {taskTemp?.stepCurrent?.onlyTheCreator && (
            <Tooltip title="Criador da atividade" placement="top">
              <Avatar
                src={taskTemp?.creatorPhoto[0]?.path || undefined}
                size="small"
                style={
                  !taskTemp?.creatorPhoto[0]?.path
                    ? { backgroundColor: getRandomColor(taskTemp?.createdBy) }
                    : {}
                }
              >
                {!taskTemp?.creatorPhoto[0]?.path
                  ? (() => {
                      const name = taskTemp?.createdBy || "";
                      const nameParts = name.split(" ");
                      const firstInitial = nameParts[0]?.[0] || "";
                      const lastInitial =
                        nameParts.length > 1
                          ? nameParts[nameParts.length - 1][0]
                          : "";
                      return firstInitial + lastInitial;
                    })()
                  : null}
              </Avatar>
            </Tooltip>
          )}
          {getAccountsAvatar(taskTemp)}
          {values?.emailSentAt != "" && (
            <div>
              {(() => {
                const emailStatusMap = {
                  ADAYUNTILDUE: {
                    color: "#FFCD07",
                    label: "1 dia para vencer",
                  },
                  AHOURUNTILDUE: {
                    color: "#FF6400",
                    label: "1 hora para vencer",
                  },
                  OVERDUE: { color: "#FF0000", label: "Atrasado" },
                  ADM: { color: "#EC1F25", label: "Encaminhado ao Gerente" },
                  SUCCESS: { color: "#64DD17", label: "Concluído" },
                  CLOSED: { color: "#FC5858", label: "Fechado" },
                  INITIAL: { color: "#FFAB00", label: "Pendente" },
                  DEFAULT: { color: "#64DD17", label: "No prazo" },
                };

                const status =
                  taskTemp?.stepCurrent?.initialStep &&
                  (!values?.emailStatus || !emailStatusMap[values?.emailStatus])
                    ? emailStatusMap.INITIAL
                    : emailStatusMap[values?.emailStatus] ||
                      emailStatusMap.DEFAULT;

                return (
                  <Tag
                    style={{ borderRadius: "12px", fontSize: "10px" }}
                    color={status.color}
                  >
                    {status.label}
                  </Tag>
                );
              })()}
            </div>
          )}
        </div>
        <h4 style={{ marginTop: "6px", fontSize: "20px" }}>{values?.name}</h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            fontSize: "11px",
            color: "gray",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", color: "gray" }}>
            <InfoCircleOutlined
              style={{
                marginRight: "8px",
                fontSize: "1.2em",
                color: "#717a87",
              }}
            />
            <span className="backspaceCardsData">
              Protocolo: {values?.protocol}
            </span>
          </div>

          {values?.attAmount > 0 && (
            <div
              style={{ display: "flex", alignItems: "center", color: "gray" }}
            >
              <PaperClipOutlined
                style={{
                  marginRight: "8px",
                  fontSize: "1.2em",
                  color: "#717a87",
                }}
              />
              <span className="backspaceCardsData">
                {values?.attAmount} Anexo(s)
              </span>
            </div>
          )}
          {taskTemp?.stepCurrent &&
            !taskTemp.stepCurrent?.finalStep &&
            ((taskTemp.stepCurrent.notifyAdmIn !== null &&
              values?.emailStatus === "OVERDUE") ||
              (taskTemp.stepCurrent.time !== null &&
                values?.emailStatus !== "OVERDUE")) && (
              <div style={{ display: "flex", alignItems: "center" }}>
                <>
                  {((values?.emailStatus === "OVERDUE" &&
                    taskTemp.stepCurrent.notifyAdmIn !== null) ||
                    taskTemp.stepCurrent.time !== null) && (
                    <>
                      <CalendarOutlined
                        style={{
                          marginRight: "8px",
                          fontSize: "1.2em",
                          color: "#717a87",
                        }}
                      />
                      <Tag
                        style={{
                          borderRadius: "12px",
                          fontSize: "10px",
                          backgroundColor: "#717a87",
                          color: "white",
                          border: "none",
                        }}
                      >
                        {values?.emailStatus === "OVERDUE" &&
                        taskTemp.stepCurrent.notifyAdmIn !== null
                          ? "Notif. gerência"
                          : values?.emailStatus === "ADM"
                          ? "Vencido"
                          : taskTemp.stepCurrent.time !== null
                          ? "Venc."
                          : ""}
                      </Tag>
                    </>
                  )}
                </>
                <span className="backspaceCardsData">
                  {calcTime(
                    values?.updatedAt,
                    values?.emailStatus === "OVERDUE"
                      ? taskTemp?.stepCurrent?.notifyAdmIn
                      : taskTemp?.stepCurrent?.time,
                    values?.emailStatus === "OVERDUE"
                      ? taskTemp?.stepCurrent?.admTimeUnity
                      : taskTemp?.stepCurrent?.timeUnit
                  )}
                </span>
              </div>
            )}
        </div>
      </div>
    );

    setlistGetProfile(list);
  };

  const generateModal = async () => {
    setLoadingMainModal(true);
    setOpenModal(true);

    setTask(values);
    setFieldsUUID(
      values.stepCurrent?.fields
        .filter((field) => field.type === "ATTACHMENT")
        .map((field) => ({ id: field?.id, values: [] }))
    );
    if (viewInit === false) {
      generate(values);
      getAllFoundFiles();
    }

    setLoadingMainModal(false);
    setOpenModal(false);

    if (taskId != undefined) {
      let list = [];

      try {
        const response = await taskServicegenerateModal();
        let taskTemp = response?.data;
        taskTemp.actions = taskTemp?.actions;
        setTask(taskTemp);
        setFieldsUUID(
          taskTemp.stepCurrent.fields
            .filter((field) => field.type === "ATTACHMENT")
            .map((field) => ({ id: field?.id, values: [] }))
        );
        if (viewInit === false) {
          generate(taskTemp);
          //getAllFoundFiles();
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      } finally {
        setLoadingMainModal(false);
      }
    }
  };

  const getGenerateInitTrue = async () => {
    setLoadingMainModal(true);

    setTask(values);
    generate(values);
    setAllFoundFiles(values?.files);

    setLoadingMainModal(false);
  };

  useEffect(() => {
    getGenerateInitTrue();
  }, []);

  const handlerOpenModal = () => {
    generateModal();
  };

  const showCancelModal = () => {
    setOpenCancelModal(true);
  };

  const showReturnModal = () => {
    setOpenReturnModal(true);
  };

  const closeCancelModal = () => {
    setOpenCancelModal(false);
  };

  const closeOneStepModal = () => {
    setIsModalOpen(false);
  };

  const closeReturnModal = () => {
    setOpenReturnModal(false);
  };

  const handleCancelModal = () => {
    setOpenAccept(false);
    setOpenModal(false);
    closeModal();
  };

  const shouldRenderConfirmButton = () => {
    const { stepCurrent } = task || {};
    if (!stepCurrent?.allowValidate || stepCurrent?.finalStep) return false;

    const { attSignature, attSignatureNext, typeFinalStep } = stepCurrent;

    return (
      (attSignature == null && !attSignatureNext) ||
      (attSignature?.allowSignature && attSignatureNext) ||
      (attSignature?.allowSignature &&
        !attSignatureNext &&
        typeFinalStep !== "SIGNATURE") ||
      attSignature?.signatureInvite?.crdInfo?.status === "FINALIZADO" ||
      (attSignature == null && attSignatureNext)
    );
  };

  const shouldRenderCancelButton = () => {
    const { stepCurrent } = task || {};
    if (!stepCurrent?.allowToClose || stepCurrent?.finalStep) return false;

    const { sequence, validatedBy, attSignature, typeFinalStep } = stepCurrent;
    return (
      (sequence === 1 &&
        validatedBy?.accounts?.allowCardClosure &&
        attSignature?.signatureInvite?.crdInfo == null) ||
      (attSignature?.signatureInvite?.crdInfo == null &&
        typeFinalStep !== "SIGNATURE")
    );
  };

  const Footer = () => {
    let elements = [];

    elements.push(
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginLeft: "2vw",
        }}
      >
        <Tooltip title="Fechar">
          <Button
            key="Fechar"
            icon={
              <CloseCircleOutlined
                style={{ fontSize: "18px", verticalAlign: "middle" }}
              />
            }
            onClick={() => {
              setOpenAccept(false);
              setOpenModal(false);
              closeModal();
            }}
            style={{
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("bpms.dashboard.flow.taskView.modalBtnClose")}
          </Button>
        </Tooltip>
        {task?.stepCurrent?.allowValidate &&
          !task?.stepCurrent?.finalStep &&
          task?.stepCurrent?.sequence > 1 && (
            <Tooltip title="Retornar">
              <Button
                key="console3"
                onClick={() => {
                  showReturnModal();
                }}
                icon={
                  <LeftCircleOutlined
                    style={{ fontSize: "18px", verticalAlign: "middle" }}
                  />
                }
              >
                {t("bpms.dashboard.flow.taskView.btnTakeBack")}
              </Button>
            </Tooltip>
          )}

        {shouldRenderConfirmButton() && (
          <Tooltip title="Confirmar">
            <Button
              type="primary"
              key="Fechar"
              icon={
                <CheckCircleOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              onClick={() =>
                stepsEnable?.length > 1
                  ? showModal(stepsEnable[0]?.stepId, 1)
                  : showModal(stepsEnable[0]?.stepId, 2)
              }
              style={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("bpms.dashboard.flow.taskView.btnConfirm")}
            </Button>
          </Tooltip>
        )}

        {/* {task?.stepCurrent.allowValidate &&
            !task?.stepCurrent?.finalStep &&
            task?.stepCurrent?.attSignature?.allowSignature &&
            task?.stepCurrent?.attSignatureNext && (
              <Tooltip title="Confirmar">
                <Button
                  type="primary"
                  key="Fechar"
                  icon={
                    <CheckCircleOutlined
                      style={{ fontSize: "18px", verticalAlign: "middle" }}
                    />
                  }
                  onClick={() =>
                    stepsEnable?.length > 1
                      ? showModal(stepsEnable[0]?.stepId, 1)
                      : showModal(stepsEnable[0]?.stepId, 2)
                  }
                  style={{
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {t("bpms.dashboard.flow.taskView.btnConfirm")}
                </Button>
              </Tooltip>
            )}
  
          {task?.stepCurrent.allowValidate &&
            !task?.stepCurrent?.finalStep &&
            task?.stepCurrent?.attSignature?.allowSignature &&
            !task?.stepCurrent?.attSignatureNext &&
            task?.stepCurrent?.typeFinalStep != "SIGNATURE" && (
              <Tooltip title="Confirmar">
                <Button
                  type="primary"
                  key="Fechar"
                  icon={
                    <CheckCircleOutlined
                      style={{ fontSize: "18px", verticalAlign: "middle" }}
                    />
                  }
                  onClick={() =>
                    stepsEnable?.length > 1
                      ? showModal(stepsEnable[0]?.stepId, 1)
                      : showModal(stepsEnable[0]?.stepId, 2)
                  }
                  style={{
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {t("bpms.dashboard.flow.taskView.btnConfirm")}
                </Button>
              </Tooltip>
            )}
  
          {task?.stepCurrent.allowValidate &&
            !task?.stepCurrent?.finalStep &&
            task?.stepCurrent?.attSignature?.signatureInvite?.crdInfo?.status ==
              "FINALIZADO" && (
              <Tooltip title="Confirmar">
                <Button
                  type="primary"
                  key="Fechar"
                  icon={
                    <CheckCircleOutlined
                      style={{ fontSize: "18px", verticalAlign: "middle" }}
                    />
                  }
                  onClick={() =>
                    stepsEnable?.length > 1
                      ? showModal(stepsEnable[0]?.stepId, 1)
                      : showModal(stepsEnable[0]?.stepId, 2)
                  }
                  style={{
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {t("bpms.dashboard.flow.taskView.btnConfirm")}
                </Button>
              </Tooltip>
            )}
  
          {task?.stepCurrent?.allowValidate &&
            task?.stepCurrent?.attSignature == null &&
            task?.stepCurrent?.attSignatureNext == true && (
              <Tooltip title="Confirmar">
                <Button
                  type="primary"
                  key="Fechar"
                  icon={
                    <CheckCircleOutlined
                      style={{ fontSize: "18px", verticalAlign: "middle" }}
                    />
                  }
                  onClick={() => showModal(stepsEnable[0]?.stepId, 2)}
                  style={{
                    textAlign: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {t("bpms.dashboard.flow.taskView.btnConfirm")}
                </Button>
              </Tooltip>
            )} */}

        {shouldRenderCancelButton() && (
          <Tooltip title="Cancelar">
            <Button
              key="console4"
              icon={
                <DeleteOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              style={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#FF4D4F",
                color: "white",
                border: "none",
              }}
              onClick={() => {
                showCancelModal();
              }}
            >
              {t("bpms.dashboard.flow.taskView.btnCancelModal")}
            </Button>
          </Tooltip>
        )}
      </div>
    );
    return elements;
  };

  const footer = () => {
    let elements = [];

    if (!task?.stepCurrent?.finalStep) {
      if (
        task?.stepCurrent.allowToClose &&
        task?.stepCurrent?.attSignature?.signatureInvite?.crdInfo == null
      ) {
        elements.push(
          <Tooltip title="Cancelar modal">
            <Button
              type="primary"
              key="console4"
              icon={
                <DeleteOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              style={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={() => {
                showCancelModal();
              }}
            >
              {t("bpms.dashboard.flow.taskView.btnCancelModal")}
            </Button>
          </Tooltip>
        );
      }

      if (task?.stepCurrent?.sequence > 1) {
        elements.push(
          <Tooltip title="Retornar modal">
            <Button
              key="console3"
              onClick={() => {
                showReturnModal();
              }}
              icon={
                <LeftCircleOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
            >
              {t("bpms.dashboard.flow.taskView.btnTakeBack")}
            </Button>
          </Tooltip>
        );
      }

      if (
        task?.stepCurrent?.allowValidate &&
        task?.stepCurrent?.attSignature == null &&
        task?.stepCurrent?.attSignatureNext == false
      ) {
        elements.push(
          <Tooltip title="Confirmar modal">
            <Button
              key="Fechar"
              icon={
                <CheckCircleOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              onClick={() =>
                stepsEnable?.length > 1
                  ? showModal(stepsEnable[0]?.stepId, 1)
                  : showModal(stepsEnable[0]?.stepId, 2)
              }
              style={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("bpms.dashboard.flow.taskView.btnConfirm")}
            </Button>
          </Tooltip>
        );
      }

      if (
        task?.stepCurrent?.allowValidate &&
        task?.stepCurrent?.attSignature?.signatureInvite?.crdInfo?.status ==
          "FINALIZADO"
      ) {
        elements.push(
          <Tooltip title="Confirmar modal">
            <Button
              key="Fechar"
              icon={
                <CheckCircleOutlined
                  style={{ fontSize: "18px", verticalAlign: "middle" }}
                />
              }
              onClick={() =>
                stepsEnable?.length > 1
                  ? showModal(stepsEnable[0]?.stepId, 1)
                  : showModal(stepsEnable[0]?.stepId, 2)
              }
              style={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {t("bpms.dashboard.flow.taskView.btnConfirm")}
            </Button>
          </Tooltip>
        );
      }
    }

    if (
      task?.stepCurrent?.allowValidate &&
      task?.stepCurrent?.attSignature == null &&
      task?.stepCurrent?.attSignatureNext == true
    ) {
      elements.push(
        <Tooltip title="Confirmar modal">
          <Button
            key="Fechar"
            icon={
              <CheckCircleOutlined
                style={{ fontSize: "18px", verticalAlign: "middle" }}
              />
            }
            onClick={() => showModal(stepsEnable[0]?.stepId, 2)}
            style={{
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {t("bpms.dashboard.flow.taskView.btnConfirm")}
          </Button>
        </Tooltip>
      );
    }

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
            setOpenAccept(false);
            setOpenModal(false);
            closeModal();
          }}
          style={{
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {t("bpms.dashboard.flow.taskView.modalBtnClose")}
        </Button>
      </Tooltip>
    );

    return elements;
  };

  const footerAction = () => {
    let elements = [];

    elements.push(
      <Button
        key="console4"
        onClick={() => {
          setOpenAccept(false);
          setSelectedStep(null);
          setShowDescription(false);
          formAccept.resetFields();
        }}
      >
        {t("bpms.dashboard.flow.taskView.modalBtnClose")}
      </Button>
    );

    elements.push(
      <Button
        type="primary"
        key="console4"
        disabled={okDisabled}
        onClick={() => {
          handleConfirmClick();
        }}
      >
        {t("bpms.dashboard.flow.taskView.btnConfirm")}
      </Button>
    );

    return elements;
  };

  const footerOneStepConfirm = () => {
    let elements = [];

    elements.push(
      <Button
        key="console4"
        onClick={() => {
          closeOneStepModal();
        }}
      >
        {t("bpms.dashboard.flow.taskView.modalBtnClose")}
      </Button>
    );

    elements.push(
      <Button
        type="primary"
        key="console4"
        disabled={okDisabled}
        onClick={() => {
          handleConfirmClick();
        }}
      >
        {t("bpms.dashboard.flow.taskView.btnConfirm")}
      </Button>
    );

    return elements;
  };

  const generateFieldsStep = (form, fields) => {
    let list = [];

    let newList = fields?.sort((a, b) => a.sequence - b.sequence);

    list.push(<Divider />);

    newList.map((v, index) => {
      if (v?.type === "TEXT") {
        list.push(
          <FieldText title={v?.name} index={index} field={v} form={form} />
        );
      }

      if (v?.type === "TEXT_AREA") {
        list.push(
          <FieldTextArea
            maxLength={300}
            title={v?.name}
            index={index}
            field={v}
            form={form}
          />
        );
      }

      if (v?.type === "TEXT_DESCRIPTION") {
        list.push(
          <FieldTextDinamic
            title={v?.name}
            index={index}
            field={v}
            form={form}
          />
        );
      }

      if (v?.type === "LONG") {
        list.push(
          <FieldNumber title={v?.name} index={index} field={v} form={form} />
        );
      }

      if (v?.type === "DATE") {
        list.push(
          <FieldDate title={v?.name} index={index} field={v} form={form} />
        );
      }

      if (v?.type === "DATE_TIME") {
        list.push(
          <FieldDateTime title={v?.name} index={index} field={v} form={form} />
        );
      }

      if (v?.type === "ATTACHMENT") {
        list.push(
          <div>
            <FieldAtt
              title={v?.name}
              index={index}
              field={v}
              form={form}
              isRequired={checkValuesRequired(v.id, v.notNull)}
            />
            {task?.stepCurrent && allFoundFiles?.length > 0 && (
              <div className="containerAttHistorico">
                <Divider />
                <h5>Anexos previamente utilizados</h5>
                <br />
                <div className="cardAttHistorico">
                  <Checkbox.Group
                    style={{ width: "100%" }}
                    onChange={(e) => onChangeCheckboxFiles(e, v.id)}
                  >
                    <Row gutter={[0, 8]} style={{ width: "100%" }}>
                      {allFoundFiles?.map((att) => (
                        <Col span={24}>
                          <Checkbox value={att?.cloudUuid} key={att?.cloudUuid}>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  textAlign: "center",
                                  height: "100%",
                                  lineHeight: "normal",
                                }}
                              >
                                <PaperClipOutlined style={{ marginRight: 8 }} />
                                <span
                                  className="title"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  {att?.name}
                                </span>
                              </div>
                            </div>
                          </Checkbox>
                          <div
                            style={{
                              display: "flex",
                              marginLeft: "22px",
                              marginTop: "4px",
                            }}
                          >
                            <a onClick={() => openModalAttView(att?.cloudUuid)}>
                              <FileOutlined />{" "}
                              <span className="backspace">
                                Clique aqui para visualizar anexo
                              </span>
                            </a>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Checkbox.Group>
                </div>
              </div>
            )}
          </div>
        );
      }

      if (v?.type === "BIG_DECIMAL") {
        list.push(
          <FieldCoin title={v?.name} index={index} field={v} form={form} />
        );
      }

      if (v?.type === "MULTIPLE_CHOISE") {
        list.push(
          <FieldText title={v?.name} index={index} field={v} form={form} />
        );
      }

      if (v?.type === "ONLY_CHOISE") {
        list.push(
          <FieldText title={v?.name} index={index} field={v} form={form} />
        );
      }

      if (v?.type === "LINK") {
        list.push(
          <FieldText title={v?.name} index={index} field={v} form={form} />
        );
      }
    });

    return list;
  };

  const execAction = async (typeAction) => {
    try {
      console.log("Validando campos do formulário...");
      if (typeAction !== "TASK_CLOSED" && typeAction !== "TASK_RETURNED") {
        await form?.validateFields();
      }
      console.log("Validação concluída.");
    } catch (e) {
      console.error("Erro na validação do formulário", e);
      return;
    }

    setLoading(true);

    let fieldsTemp = Object.entries(form.getFieldsValue());
    let fields = fieldsTemp.filter((f) => f[1] !== undefined);
    console.log("Valores dos campos extraídos:", fieldsTemp);

    const reqsWithId = [];
    const filesMap = {};

    for (const ff of fieldsTemp) {
      let fieldFound = task?.stepCurrent?.fields.find((f) => f?.id == ff[0]);
      if (fieldFound && fieldFound.type === "ATTACHMENT") {
        if (cloudUuid.length > 0 && ff[1] == undefined) {
          fields.push([fieldFound.id.toString(), []]);
        }
      }
    }

    if (selectedFiles.length > 0 && selectedFiles[0]) {
      const fieldId = Number(selectedFiles[0]);
      if (!isNaN(fieldId)) {
        reqsWithId.push({
          fieldId,
          values: selectedFiles,
        });
      }
    }

    for (const f of task?.stepCurrent?.fields) {
      for (const v of fields) {
        if (f?.id != null && f?.id?.toString() === v[0]) {
          if (f?.type === "DATE") {
            reqsWithId.push({
              fieldId: parseInt(v[0]),
              values: [dayjs(v[1]).format("DD/MM/YYYY")],
            });
          } else if (f?.type === "ATTACHMENT") {
            const fileList = v[1]?.fileList;
            if (fileList && fileList.length > 0) {
              const fileNamesForField = fileList
                .map((file) => file?.name)
                .filter((name) => name != null);

              reqsWithId.push({
                fieldId: parseInt(v[0]),
                values: fileNamesForField,
              });

              if (!filesMap[v[0]]) {
                filesMap[v[0]] = [];
              }
              filesMap[v[0]] = [
                ...filesMap[v[0]],
                ...fileList
                  .map((file) => file.originFileObj || file)
                  .filter((file) => file),
              ];
            } else {
              reqsWithId.push({
                fieldId: parseInt(v[0]),
                values: [],
              });
            }
          } else {
            reqsWithId.push({
              fieldId: parseInt(v[0]),
              values: [v[1]],
            });
          }
        }
      }
    }

    let description = "";
    if (typeAction === "TASK_CLOSED") {
      description = formCancel.getFieldValue("description");
    }
    if (typeAction === "TASK_RETURNED") {
      description = formReturn.getFieldValue("description");
    }

    try {
      const response = await taskService.execAction(
        taskId,
        typeAction,
        description,
        stepsEnable.length === 1 ? stepsEnable[0]?.stepId : selectedStep,
        reqsWithId,
        filesMap
      );

      console.log("Resposta recebida:", response);
      if (
        response?.content?.typeFinalStep === "SIGNATURE" &&
        response?.content?.signature
      ) {
        openPageSignature(response.content.signature.code);
      }

      toast.success("Atividade confirmada com sucesso.");
      setOpenModal(false);
      setOpenAccept(false);
    } catch (error) {
      console.error("Erro ao executar a ação:", error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
      setIsModalOpen(false);
    }
  };

  const getNameValidatedBy = () => {
    let text = t("bpms.dashboard.flow.taskView.modalCardFormVerifyInformText2");

    let departmentNames =
      task?.stepCurrent?.validatedBy?.map((v) => v.departmentName).join(", ") ||
      "N/A";

    text += `<br/>Departamento(s): ${departmentNames}<br/>`;

    // Obter nomes das contas
    let accountNames =
      task?.stepCurrent?.validatedBy
        ?.flatMap((v) => v.accounts?.map((a) => a?.name))
        .join(", ") || "N/A";

    text += `Conta(s): ${accountNames}`;

    return (
      <div
        style={{ display: "block", textIndent: 0, paddingLeft: 0, margin: 0 }}
        className="dadosVerificador"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  const getNameConcludedBy = () => {
    let text = t("bpms.dashboard.flow.taskView.modalCardFormVerifyInformText4");

    let concluir = task?.actions[task?.actions.length - 1];

    text += `<br/>Nome: ${concluir?.createdBy || "N/A"}<br/>`;
    text += `Data: ${
      dayjs(concluir?.createdAt).format("DD/MM/YYYY HH:mm") || "N/A"
    }`;

    return (
      <div
        style={{ display: "block", textIndent: 0, paddingLeft: 0, margin: 0 }}
        className="verificador"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  const getNameClosedBy = () => {
    let text = t("bpms.dashboard.flow.taskView.modalCardFormVerifyInformText6");

    let concluir = task?.actions[task?.actions.length - 1];

    text += `<br/>Nome: ${concluir?.createdBy || "N/A"}<br/>`;
    text += `Data: ${
      dayjs(concluir?.createdAt).format("DD/MM/YYYY HH:mm") || "N/A"
    }`;

    return (
      <div
        style={{ display: "block", textIndent: 0, paddingLeft: 0, margin: 0 }}
        className="verificador"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  };

  const titleLatesteStep = () => {
    if (selectedStep !== null) {
      let step = steps?.filter((s) => s.id == selectedStep)[0];
      return (
        <div className="stepTitleModal">
          <div>
            <Tag color={task?.stepCurrent?.color}>
              {task?.stepCurrent?.name}
            </Tag>
          </div>
          <div>
            <ArrowRightOutlined />
          </div>
          <div>
            <Tag color={step?.color}>{step?.name}</Tag>
          </div>
        </div>
      );
    }
  };

  const openModalAttView = async (key, id) => {
    await cloudService.openModalAttView(key).then((response) => {
      const modifiedData = {
        ...response.data,
        format: response.data.type,
        type: "file",
      };
      setFileSelected(modifiedData);
      setFileKey(response.data?.id);
      setModalAttView(true);
    });
  };

  const openModalAttSignature = async (key, documentId) => {
    setLoading(true); // Ativa o loading antes da chamada API
    try {
      const response = await signatureService.openModalAttSignature(
        key,
        documentId
      );

      const { id, name, extension, description, base64 } = response.data;

      // Cria um objeto compatível com Base64Response
      const modifiedData = {
        id: id || null,
        name: name || null,
        format: extension || null,
        description: description || null,
        type: "file",
        folder: null,
        documentSignature: null,
        base64: base64 || null,
      };

      setFileSelected(modifiedData); // Seta o objeto modificado
      setFileKey(id); // Define o ID como chave
      setModalAttView(true); // Abre o modal
    } catch (error) {
      console.error("Erro ao abrir o modal de assinatura:", error);
      toast.error("Erro ao carregar a assinatura"); // Exibe mensagem de erro
    } finally {
      setLoading(false); // Desativa o loading após a chamada
    }
  };

  const getFieldsDataAssProcesso = () => {
    return (
      <div>
        {task?.stepCurrent?.attSignature?.signatureInvite?.crdInfo != null && (
          <div>
            <RightCircleOutlined />
            <span className="title">Código Blockchain (Linear ID)</span>
            <br />
            <span className="backspace">
              {
                task?.stepCurrent?.attSignature?.signatureInvite?.crdInfo
                  ?.linearId
              }
            </span>
            <br />

            <RightCircleOutlined />
            <span className="title">Status</span>
            <br />
            <span className="backspace">
              <Tag
                color={corTimeLine(
                  task?.stepCurrent?.attSignature?.signatureInvite?.crdInfo
                    ?.status
                )}
              >
                {descritptionTimeline(
                  task?.stepCurrent?.attSignature?.signatureInvite?.crdInfo
                    ?.status
                )}
              </Tag>
            </span>
            <br />

            <RightCircleOutlined />
            <span className="title">Data Registrado</span>
            <br />
            <span className="backspace">
              {dayjs(
                task?.stepCurrent?.attSignature?.signatureInvite?.crdInfo
                  ?.shippingCreatedAt
              ).format("DD/MM/YYYY HH:mm:ss")}
            </span>
            <br />
          </div>
        )}
      </div>
    );
  };

  const getFieldsData = (f) => {
    return (
      <Row style={{ flexDirection: "column", width: "100%" }}>
        {f?.type === "ATTACHMENT" && (
          <Col span={24}>
            <div>
              <PaperClipOutlined />
              <span className="title">{f?.name}</span>
              <br />
              {f?.atts?.map((att, index) => (
                <div key={`${att?.cloudUuid}-${index}`}>
                  {!task?.stepCurrent?.finalStep}
                  <a onClick={() => openModalAttView(att?.cloudUuid)}>
                    <span className="backspace">
                      <FileOutlined />
                    </span>
                    <span style={{ cursor: "pointer" }} className="backspace">
                      {att?.name}
                      {" - " + formatFileSize(att?.size)}
                    </span>
                  </a>
                  <br />
                </div>
              ))}
              <br />
            </div>
          </Col>
        )}

        {f?.type === "TEXT" && (
          <Col span={24}>
            <div>
              <EditOutlined />
              <span className="title">{f?.name}</span>
              <br />
              <span className="backspace">{f?.value}</span>
              <br />
            </div>
          </Col>
        )}

        {f?.type === "TEXT_AREA" && (
          <Col span={24}>
            <div>
              <FormOutlined />
              <span className="title">{f?.name}</span>
              <br />
              <span
                className="backspace"
                dangerouslySetInnerHTML={{
                  __html: f?.value?.replaceAll("\n", "<br />"),
                }}
              />
              <br />
            </div>
          </Col>
        )}

        {f?.type === "DATE" && (
          <Col span={24}>
            <div>
              <CalendarOutlined />
              <span className="title">{f?.name}</span>
              <br />
              <span className="backspace">{f?.value}</span>
              <br />
            </div>
          </Col>
        )}

        {f?.type === "BIG_DECIMAL" && (
          <Col span={24}>
            <div>
              <DollarOutlined />
              <span className="title">{f?.name}</span>
              <br />
              <span className="backspace">{f?.value}</span>
              <br />
            </div>
          </Col>
        )}

        {f?.type === "LONG" && (
          <Col span={24}>
            <div>
              <FieldNumberOutlined />
              <span className="title">{f?.name}</span>
              <br />
              <span className="backspace">{f?.value}</span>
              <br />
            </div>
          </Col>
        )}
      </Row>
    );
  };

  const getDocsData = (attSignature) => {
    // Função para abrir o modal e ativar o loading
    const handleOpenModal = async (cloudUuid, docId) => {
      try {
        setLoading(true); // Inicia o loading
        await openModalAttSignature(cloudUuid, docId); // Executa a função de abertura do modal
      } catch (error) {
        console.error("Erro ao abrir modal:", error);
      } finally {
        setLoading(false); // Finaliza o loading
      }
    };

    return (
      <Row style={{ flexDirection: "column", width: "100%" }}>
        <Col span={24}>
          <div>
            <PaperClipOutlined />
            <span className="title">Anexo (Assinado)</span>
            <br />
            {/* Exibe loading enquanto documentos estão carregando */}
            {loading ? (
              <Spin
                tip="Carregando documento..."
                style={{ paddingTop: "15px" }}
              /> // Spinner do Ant Design
            ) : (
              attSignature?.signatureInvite?.signDocs?.map((doc) => (
                <div key={doc?.cloudUuid}>
                  <a onClick={() => handleOpenModal(doc?.cloudUuid, doc?.id)}>
                    <span className="backspace">
                      <FileOutlined />
                    </span>
                    <span style={{ cursor: "pointer" }} className="backspace">
                      {attSignature?.files?.[0]?.name}
                    </span>
                  </a>
                  <br />
                </div>
              ))
            )}
            <br />
          </div>
        </Col>
      </Row>
    );
  };

  const showModal = (selectedStepId, type) => {
    if (selectedStepId == null && selectedStep === null) {
      return toast.warn("Selecione uma Etapa");
    }

    if (selectedStepId != null && selectedStep === null) {
      setSelectedStep(selectedStep);
    }
    evolueSteps(task?.stepCurrent?.fields, type);
  };

  const handleTakeBackClick = async () => {
    setOkDisabled(true);
    setLoading(true);

    try {
      await execAction("TASK_RETURNED");
    } finally {
      setLoading(false);
      setOkDisabled(false);
      closeReturnModal();
    }
  };

  const handleCancelClick = async () => {
    setOkDisabled(true);
    setLoading(true);

    try {
      await execAction("TASK_CLOSED");
    } finally {
      setLoading(false);
      setOkDisabled(false);
      closeCancelModal();
    }
  };

  const handleConfirmClick = async () => {
    setOkDisabled(true);
    setLoading(true);

    try {
      await execAction("TASK_ACCEPTED");
    } finally {
      setLoading(false);
      setOkDisabled(false);
      closeOneStepModal();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleStepChange = (value) => {
    setSelectedStep(value);
    setShowDescription(true);
  };

  const evolueSteps = async (fields, type) => {
    validateFields(fields, type);
  };

  const validateFields = (fields, type) => {
    let fieldsTemp = Object.entries(form.getFieldsValue());
    let fieldsTempTemp = [];

    if (fieldsTemp?.length > 0) {
      for (const f of fieldsTemp) {
        if (f[1] === undefined) {
          f[1] = null;
          fieldsTempTemp.push(f);
        } else {
          fieldsTempTemp.push(f);
        }
      }
    }

    let listFieldsMandatory = [];

    fieldsTempTemp.map((ft) => {
      let field = fields.filter((f) => f.id == ft[0])[0];
      if (field.notNull && ft[1] == null) {
        listFieldsMandatory.push(field);
      }
    });
    if (listFieldsMandatory.length > 0 && !isRequired) {
      return toast.warn(
        "Para Evoluir etapa o(s) campo(s) obrigatório(s) precisa(m) ser completado(s)."
      );
    } else {
      if (type === 1) {
        //getAllFoundFiles();
        getSteps();
        setOpenAccept(true);
      } else {
        setIsModalOpen(true);
      }
    }
  };

  const openPageSignature = (code) => {
    const url = `${websitePath}assinaturas/minhas-assinaturas/criar/${code}`;
    const popup = window.open(url, "_blank");

    // Verifica se o pop-up foi bloqueado
    if (popup === null || typeof popup === "undefined") {
      message.warning(
        "Parece que o bloqueador de pop-ups do seu navegador está ativado. Desative-o para sert redirecionado."
      );
    }
  };

  const corTimeLine = (status) => {
    if (status === "CADASTRADO_AGUARDADNDO_PARTES") {
      return "#C59B6B";
    } else if (status === "CADASTRADO_AGUARDADNDO_ATIVACAO") {
      return "#E8671C";
    } else if (status === "ATIVADO_AGUARDANDO_ASSINATURAS") {
      return "#EDC328";
    } else if (status === "DESATIVADO_AGUARDANDO_ATIVACAO") {
      return "#FFF";
    } else if (status === "ASSINADO_PARCIALMENTE") {
      return "#206DBA";
    } else if (status === "ASSINADO_POR_TODOS") {
      return "#20BAAB";
    } else if (status === "FINALIZADO") {
      return "#76CD7A";
    } else if (status === "CANCELADO") {
      return "#BA2020";
    }
  };

  const descritptionTimeline = (status) => {
    if (status === "CADASTRADO_AGUARDADNDO_PARTES") {
      return t("documentToSign.registerWaintingParts");
    } else if (status === "CADASTRADO_AGUARDADNDO_ATIVACAO") {
      return t("documentToSign.registerWaintingActivation");
    } else if (status === "ATIVADO_AGUARDANDO_ASSINATURAS") {
      return t("documentToSign.activeWaintingSignature");
    } else if (status === "DESATIVADO_AGUARDANDO_ATIVACAO") {
      return t("documentToSign.disableWaitingActivation");
    } else if (status === "ASSINADO_PARCIALMENTE") {
      return t("documentToSign.parcialSigned");
    } else if (status === "ASSINADO_POR_TODOS") {
      return t("documentToSign.signByEveryone");
    } else if (status === "FINALIZADO") {
      return t("documentToSign.finished");
    } else if (status === "CANCELADO") {
      return t("documentToSign.cancel");
    }
  };

  const descriptionStatusSignature = (status) => {
    if (status === "EM_ANDAMENTO") {
      return "Em andamento";
    }

    if (status === "EM_ESPERA") {
      return "Em espera";
    }
    if (status === "CANCELADO") {
      return "Cancelado";
    }
    if (status === "CONCLUIDO") {
      return "Concluído";
    }
  };

  const formatFileSize = (sizeInBytes) => {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let size = sizeInBytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units?.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size?.toFixed(2)} ${units[unitIndex]}`;
  };

  const onChangeCheckboxFiles = (sFiles, id) => {
    setSelectedFiles(sFiles);
    let list = [];

    for (const field of fieldsUUID) {
      if (id === field.id) {
        field.values = sFiles;
      }
      list.push(field);
    }

    setFieldsUUID(list);

    const isRequired = sFiles.length > 0;
    setIsRequired(isRequired);
  };

  const checkValuesRequired = (id, notNull) => {
    for (const field of fieldsUUID) {
      if (id === field.id) {
        if (field.values.length > 0) {
          return false;
        } else {
          return notNull;
        }
      } else {
        return notNull;
      }
    }
  };

  const getAtts = (att, f) => {
    return (
      <Col span={24}>
        <div>
          <PaperClipOutlined />
          <span className="title">{att?.name} </span>
          <br />
          <div>
            <Checkbox />
            <a onClick={() => openModalAttView(att?.cloudUuid)}>
              <span className="backspace">
                <FileOutlined />
              </span>
              <span className="backspace">{att?.name}</span>
            </a>
            <br />
          </div>
          <br />
        </div>
      </Col>
    );
  };

  return (
    <div className="content-dnd">
      {viewInit === true && (
        <div
          onClick={() => {
            handlerOpenModal();
            getSteps();
            //getAllFoundFiles();
          }}
        >
          {listGetProfile}
        </div>
      )}
      
      <Modal
        zIndex={1020}
        centered
        width={1200}
        title={values?.protocol + " - " + values?.name}
        open={openModal}
        footer={Footer()}
        onCancel={handleCancelModal}
        className="modalPrincipal"
        style={{
          borderTop: `10px solid ${task?.stepCurrent?.color}`,
          borderTopRightRadius: "15px",
          borderTopLeftRadius: "15px",
          boxSizing: "border-box",
        }}
      >
        <Spin spinning={loadingMainModal}>
          <Divider />
          <div className="content">
            <div className="leftCard">
              <Card
                className="cardFormVerificador"
                title={
                  <span
                    style={{
                      color: `${task?.stepCurrent?.color}`,
                      fontSize: "25px",
                    }}
                  >
                    {task?.stepCurrent?.name}
                  </span>
                }
              >
                {task?.stepCurrent?.allowValidate && (
                  <div>
                    <Form
                      layout="vertical"
                      form={form}
                      onFinish={() => execAction("TASK_ACCEPTED")}
                      name="form"
                    >
                      {task?.stepCurrent?.attSignature != null &&
                        task?.stepCurrent?.typeFinalStep === "SIGNATURE" && (
                          <div>
                            <br />
                            <p style={{ textAlignLast: "center" }}>
                              Processo de Assinatura
                            </p>
                            <Divider />

                            {task?.stepCurrent?.attSignature?.signatureInvite
                              ?.crdInfo == null && (
                              <div style={{ textAlignLast: "center" }}>
                                <span style={{ textAlignLast: "center" }}>
                                  <a
                                    style={{
                                      color: "black",
                                      fontWeight: "bold",
                                    }}
                                    onClick={() =>
                                      openPageSignature(
                                        task?.stepCurrent?.attSignature
                                          ?.signatureInvite?.code
                                      )
                                    }
                                  >
                                    Clique aqui
                                  </a>{" "}
                                  para gerar uma assinatura
                                </span>
                              </div>
                            )}
                            <Row gutter={[8, 8]}>
                              {getFieldsDataAssProcesso()}
                            </Row>
                            <br />
                            <br />

                            <p style={{ textAlignLast: "center" }}>
                              Participante(s)
                            </p>
                            <Divider />

                            {task?.stepCurrent?.attSignature?.signatureInvite
                              ?.participants?.length > 0 && (
                              <div>
                                {task?.stepCurrent?.attSignature?.signatureInvite?.participants?.map(
                                  (f) => (
                                    <div>
                                      <RightCircleOutlined />
                                      <span className="title">Nome</span>
                                      <br />
                                      <span className="backspace">
                                        {f?.name}
                                      </span>
                                      <br />

                                      <RightCircleOutlined />
                                      <span className="title">Documento</span>
                                      <br />
                                      <span className="backspace">
                                        {f?.numberDocument}
                                      </span>
                                      <br />

                                      <RightCircleOutlined />
                                      <span className="title">Status</span>
                                      <br />
                                      <span className="backspace">
                                        {descriptionStatusSignature(
                                          f?.signatureParticipantStatus
                                        )}
                                      </span>
                                      <br />

                                      <RightCircleOutlined />
                                      <span className="title">Tipo</span>
                                      <br />
                                      <span className="backspace">
                                        {f?.typeParticipant}
                                      </span>
                                      <br />

                                      <Divider dashed />
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                            {task?.stepCurrent?.attSignature?.signatureInvite
                              ?.participants?.length == 0 && (
                              <div>
                                <Empty
                                  description={
                                    <div style={{ textAlignLast: "center" }}>
                                      <p style={{ fontWeight: "bold" }}>
                                        Nenhum participante
                                      </p>
                                    </div>
                                  }
                                />
                              </div>
                            )}

                            <br />

                            <p style={{ textAlignLast: "center" }}>Anexo(s)</p>
                            <Divider />

                            {task?.stepCurrent?.attSignature?.files?.length >
                              0 && (
                              <div>
                                {task?.stepCurrent?.attSignature?.files?.map(
                                  (f) => (
                                    <div>
                                      <RightCircleOutlined />
                                      <span className="title">
                                        Anexo (Original)
                                      </span>
                                      <br />
                                      <span className="backspace">
                                        <FileOutlined />
                                      </span>
                                      <span
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                          openModalAttView(f?.cloudUuid)
                                        }
                                        className="backspace"
                                      >
                                        {f?.name}
                                      </span>
                                      <br />
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                            {loading ? (
                              <Spin
                                tip="Carregando documentos..."
                                style={{ paddingTop: "15px" }}
                              />
                            ) : (
                              task?.stepCurrent?.attSignature?.signatureInvite
                                ?.signDocs?.length > 0 && (
                                <div>
                                  {task?.stepCurrent?.attSignature?.signatureInvite?.signDocs?.map(
                                    (f) => (
                                      <div key={f?.cloudUuid}>
                                        <PaperClipOutlined />
                                        <span className="title">
                                          Anexo (ASSINADO)
                                        </span>
                                        <br />
                                        <span className="backspace">
                                          <FileOutlined />
                                        </span>
                                        <span
                                          onClick={() =>
                                            openModalAttSignature(
                                              f?.cloudUuid,
                                              f?.id
                                            )
                                          }
                                          style={{ cursor: "pointer" }}
                                          className="backspace"
                                        >
                                          {
                                            task?.stepCurrent?.attSignature
                                              ?.files[0]?.name
                                          }
                                        </span>
                                        <br />
                                      </div>
                                    )
                                  )}
                                </div>
                              )
                            )}
                            <br />
                          </div>
                        )}

                      {task?.stepCurrent?.fields?.length == 0 &&
                        task?.stepCurrent?.attSignature == null && (
                          <div>
                            <br></br>
                            <Result
                              icon={
                                <img
                                  src={iCON_WHITE_ORIGINAL_TRANSPARENT}
                                  style={{ width: "25%" }}
                                />
                              }
                              title={
                                <span
                                  style={{ fontSize: "20px", color: "#8c8c8c" }}
                                >
                                  ABA Blockchain
                                </span>
                              }
                              subTitle={
                                <span style={{ color: "black" }}>
                                  Escolha a ação que deseja realizar nos botões
                                  abaixo
                                </span>
                              }
                            />
                          </div>
                        )}

                      {task?.stepCurrent?.fields?.length > 0 &&
                        generateFieldsStep(form, task?.stepCurrent?.fields)}
                    </Form>
                  </div>
                )}

                {!task?.stepCurrent?.allowValidate &&
                  !task?.stepCurrent?.finalStep &&
                  (task?.stepCurrent?.typeFinalStep == "NO_EFFECT" ||
                    task?.stepCurrent?.typeFinalStep == "SIGNATURE") && (
                    <Result subTitle={getNameValidatedBy()} />
                  )}
                {task?.stepCurrent?.finalStep &&
                  task?.stepCurrent?.typeFinalStep == "SUCCESS" && (
                    <Result
                      status="success"
                      title={"Atividade Concluida."}
                      subTitle={getNameConcludedBy()}
                    />
                  )}
                {task?.stepCurrent?.finalStep &&
                  task?.stepCurrent?.typeFinalStep == "CLOSED" && (
                    <Result
                      status="error"
                      title={"Atividade Cancelada."}
                      subTitle={getNameClosedBy()}
                    />
                  )}
              </Card>
            </div>

            <div className="rigthCards">
              <Card
                className="cardDataFormInit"
                title={t("bpms.dashboard.flow.taskView.modalCardFormInitTitle")}
              >
                <h5>
                  {t(
                    "bpms.dashboard.flow.taskView.modalCardFormInitCreatorData"
                  )}
                </h5>
                <span>
                  {t("bpms.dashboard.flow.taskView.cardTaskInfoName")}{" "}
                  {task?.createdBy}
                </span>
                <br />
                <span>
                  {t("bpms.dashboard.flow.taskView.cardTaskInfoCreationDate")}{" "}
                  {dayjs(task?.createdAt).format("DD/MM/YYYY")}
                </span>
                <Divider dashed />
                <Row gutter={[16, 16]}>
                  {task?.formInitialFieldsValues
                    ?.sort((a, b) => a.sequence - b.sequence)
                    ?.map((f) => getFieldsData(f))}
                </Row>
              </Card>

              <Card
                className="cardHistorico"
                title={t(
                  "bpms.dashboard.flow.taskView.modalCardStepsHistoryTitle"
                )}
              >
                <div>
                  <Timeline>
                    {task?.actions
                      ?.sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                      )
                      ?.sort((a, b) => a.sequence - b.sequence)
                      ?.map((a, index, arr) => (
                        <Timeline.Item
                          key={a?.id}
                          dot={
                            <Tag
                              style={{
                                borderTopLeftRadius: "50%",
                                borderTopRightRadius: "50%",
                                borderBottomLeftRadius: "50%",
                                borderBottomRightRadius: "50%",
                              }}
                              color={a?.stepOld?.color}
                            >
                              {arr.length - index}
                            </Tag>
                          }
                          color={a?.stepOld?.color}
                        >
                          <div>
                            <span>
                              <Tag color={a?.stepOld?.color}>
                                {a?.stepOld?.name}
                              </Tag>
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: "12px" }}>
                              <span style={{ fontWeight: "bold" }}>
                                {a?.createdBy}
                              </span>
                            </span>
                          </div>
                          <div>
                            <span style={{ fontSize: "11px" }}>
                              {dayjs(a?.createdAt).format("DD/MM/YYYY HH:mm")}
                            </span>
                          </div>
                          <Divider
                            dashed
                            style={{
                              marginTop: "5px",
                              marginBottom: "5px",
                            }}
                          />
                          {a?.description && (
                            <div>
                              <FormOutlined />
                              <span className="title">
                                Descrição do{" "}
                                {a?.action === "TASK_RETURNED"
                                  ? "Retorno"
                                  : a?.action === "TASK_CLOSED"
                                  ? "Cancelamento"
                                  : "Ação"}
                              </span>
                              <br />
                              <span style={{ fontSize: "11px" }}>
                                <Row gutter={[8, 8]}>{a?.description}</Row>
                              </span>
                            </div>
                          )}
                          {a?.stepCurrent?.fields?.length > 0 && (
                            <div style={{ fontSize: "11px" }}>
                              <Row gutter={[8, 8]}>
                                {a?.stepCurrent?.fields.map((f) => (
                                  <Col span={24} key={f?.id}>
                                    {getFieldsData(f)}
                                  </Col>
                                ))}
                              </Row>
                            </div>
                          )}
                          {(!Array.isArray(a.stepOld?.fields) ||
                            a.stepOld?.fields.length === 0) && // Verifica se fields não tem elementos
                            a?.stepOld?.attSignature?.signatureInvite?.signDocs
                              ?.length > 0 && ( // Verifica se signDocs tem itens
                              <div style={{ fontSize: "11px" }}>
                                <Row gutter={[8, 8]}>
                                  <Col
                                    span={24}
                                    key={a?.stepOld.attSignature.id}
                                  >
                                    {getDocsData(a?.stepOld.attSignature)}
                                  </Col>
                                </Row>
                              </div>
                            )}
                        </Timeline.Item>
                      ))}
                  </Timeline>
                </div>
              </Card>
            </div>
          </div>
        </Spin>
      </Modal>

      <Modal
        zIndex={2900}
        centered
        open={openAccept}
        footer={footerAction()}
        closable={false}
        closeIcon={false}
      >
        <Spin spinning={loading}>
          <Result
            title="Confirmar atividade"
            icon={<Avatar src={aceite} size={150} />}
            subTitle={
              <div>
                <Form layout="vertical" form={formAccept} name="formAccept">
                  <Form.Item
                    label="Selecione Etapa"
                    name="step"
                    rules={[
                      { required: true, message: "Please select a step!" },
                    ]}
                    extra={"selecione a etapa que irá receber essa atividade"}
                  >
                    <Select onChange={handleStepChange}>
                      {stepsEnable?.map((step) => (
                        <Option key={step.stepId} value={step.stepId}>
                          <Badge color={step.stepColor} text={step.stepName} />
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </div>
            }
          />
        </Spin>
      </Modal>

      <Modal
        centered
        open={isModalOpen}
        onOk={() => execAction("TASK_ACCEPTED")}
        onCancel={handleCancel}
        zIndex={3000}
        footer={footerOneStepConfirm()}
      >
        <Spin spinning={loading}>
          <Result
            title={t("bpms.dashboard.flow.taskView.modalAlertMoveStep")}
            extra={titleLatesteStep()}
          />
        </Spin>
      </Modal>

      <Modal centered open={openCancelModal} zIndex={3000} footer={false}>
        <Spin spinning={loading}>
          <Result
            title={t("bpms.dashboard.flow.taskView.modalAlertMoveStep")}
            extra={
              <div>
                <span style={{ fontWeight: "bold" }}>
                  {t("bpms.dashboard.flow.taskView.modalAlertCancelTask")}
                </span>
                <span style={{ color: "red", fontWeight: "bold" }}>
                  {t(
                    "bpms.dashboard.flow.taskView.modalAlertCancelTaskFinalWord"
                  )}
                </span>

                <br />
                <br />
                <Form
                  form={formCancel}
                  layout="vertical"
                  onFinish={handleCancelClick}
                >
                  <Form.Item
                    label="Descrição pelo motivo de cancelamento."
                    name="description"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <TextArea
                      maxLength={244}
                      style={{ height: 100, resize: "none" }}
                    />
                  </Form.Item>
                  <Space>
                    <Button
                      key="console4"
                      onClick={() => {
                        closeCancelModal();
                      }}
                    >
                      {t("bpms.dashboard.flow.taskView.modalBtnClose")}
                    </Button>

                    <Button
                      type="primary"
                      key="console4"
                      disabled={okDisabled}
                      htmlType="submit"
                    >
                      {t("bpms.dashboard.flow.taskView.btnCancelModal")}
                    </Button>
                  </Space>
                </Form>
              </div>
            }
          />
        </Spin>
      </Modal>

      <Modal centered open={openReturnModal} zIndex={3000} footer={false}>
        <Spin spinning={loading}>
          <Result
            status="warning"
            title={t("bpms.dashboard.flow.taskView.modalAlertMoveStep")}
            extra={
              <div>
                <span style={{ fontWeight: "bold" }}>
                  {t("bpms.dashboard.flow.taskView.modalAlertReturnStep")}
                </span>
                <span style={{ color: "#faad14", fontWeight: "bold" }}>
                  {t(
                    "bpms.dashboard.flow.taskView.modalAlertReturnTaskFinalWord"
                  )}
                </span>
                <span style={{ fontWeight: "bold" }}>
                  {t(
                    "bpms.dashboard.flow.taskView.modalAlertReturnStepFinalWords"
                  )}
                </span>
                <br />
                <br />
                <Form
                  form={formReturn}
                  layout="vertical"
                  onFinish={handleTakeBackClick}
                >
                  <Form.Item
                    name="description"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                    label="Descrição pelo motivo de Retorno."
                  >
                    <TextArea
                      maxLength={244}
                      style={{ height: 100, resize: "none" }}
                    />
                  </Form.Item>
                  <Space>
                    <Button
                      key="console4"
                      onClick={() => {
                        closeReturnModal();
                      }}
                    >
                      {t("bpms.dashboard.flow.taskView.modalBtnClose")}
                    </Button>

                    <Button
                      type="primary"
                      key="console4"
                      disabled={okDisabled}
                      htmlType="submit"
                    >
                      {t("bpms.dashboard.flow.taskView.btnTakeBack")}
                    </Button>
                  </Space>
                </Form>
              </div>
            }
          />
        </Spin>
      </Modal>

      <ModalViewFile
        zIndex={3000}
        open={modalAttView}
        filesIdToView={fileSelected?.id}
        filesNameToView={fileSelected?.name}
        filesTypeToView={fileSelected?.format}
        filesParentToView={fileSelected?.folder}
        fileSelect={fileSelected}
        showCreateSignature={false}
        onCancel={() => setModalAttView(false)}
      />
    </div>
  );
};

export default TaskContent;
