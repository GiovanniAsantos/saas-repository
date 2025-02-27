"use client";
import { Card } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import MyFlows from "../../../Bpms/Pages/Dashboard/MyFlows";
import MyTasks from "../../../Bpms/Pages/Dashboard/MyPendingTask";
import MyValidation from "../../../Bpms/Pages/Dashboard/TasksOpenedByMe";
import { useKeycloak } from "@/src/auth/keycloakProvider";

export default function KanbanDashboard() {
  const { account } = useKeycloak();
  const [horaAtual, setHoraAtual] = useState(0);
  const [saudacao, setSaudacao] = useState("");
  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    if (horaAtual >= 0 && horaAtual < 12) {
      const saudation = t("home.saudationMorning");
      setSaudacao(saudation);
    } else if (horaAtual >= 12 && horaAtual < 18) {
      const saudation = t("home.saudationAfternoon");
      setSaudacao(saudation);
    } else {
      const saudation = t("home.saudationEvening");
      setSaudacao(saudation);
    }
  }, [horaAtual, t]);

  useEffect(() => {
    const dataAtual = dayjs();
    setHoraAtual(parseInt(dataAtual.format("HH")));
  }, []);

  return (
    <div>
      <Card>
        <MyValidation account={account} />
      </Card>

      <br />

      <Card>
        <MyTasks />
      </Card>

      <br />

      <Card style={{ marginBottom: "20px" }}>
        <MyFlows account={account} />
      </Card>
    </div>
  );
}
