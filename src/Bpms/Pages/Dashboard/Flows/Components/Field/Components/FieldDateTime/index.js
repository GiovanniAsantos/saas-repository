/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, DatePicker, Form, Space } from "antd";
import dayjs from "dayjs";
import "./style.module.css";

const FieldDateTime = (props) => {
  const dateFormatTime = "DD/MM/YYYY HH:mm";

  // Adiciona restrição de números no campo
  const handleInputChange = (event) => {
    const { value } = event.target;
    // Remover caracteres não numéricos, exceto barras e espaços
    event.target.value = value.replace(/[^0-9/ ]/g, "");
  };

  return (
    <div className="fields">
      {props?.preview && (
        <Card
          style={{ height: "90px" }}
          title={
            props?.field?.notNull ? (
              <span>
                <span style={{ color: "red" }}>*</span> {props?.title}
              </span>
            ) : (
              props?.title
            )
          }
          extra={[
            <Space>
              {props?.edit != null ? (
                <EditOutlined onClick={() => props?.edit(props?.index)} />
              ) : null}{" "}
              <DeleteOutlined onClick={() => props?.remove(props.index)} />
            </Space>,
          ]}
        >
          <DatePicker
            format={dateFormatTime}
            showTime
            onChange={props?.onChange}
            onInput={handleInputChange}
            defaultValue={dayjs()}
          />
          <p className="subText">{props?.field?.description}</p>
        </Card>
      )}

      {!props?.preview && (
        <Form.Item
          name={props?.field?.id}
          label={props?.field?.name}
          rules={[{ required: props?.field?.notNull }]}
          extra={<p className="subText">{props?.field?.description}</p>}
        >
          <DatePicker
            format={dateFormatTime}
            showTime
            onChange={props?.onChange}
            onInput={handleInputChange}
            defaultValue={dayjs()}
          />
        </Form.Item>
      )}
    </div>
  );
};

export default FieldDateTime;
