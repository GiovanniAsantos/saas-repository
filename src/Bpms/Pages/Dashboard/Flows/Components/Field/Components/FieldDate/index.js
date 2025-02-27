/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { DatePicker, Card, Space, Form, Alert } from "antd";
import "./style.module.css";
import dayjs from "dayjs";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const FieldDate = (props) => {
  const dateFormat = "DD/MM/YYYY";
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;
    const sanitizedValue = value.replace(/[^0-9/]/g, "");

    if (value !== sanitizedValue) {
      setError(true);
    } else {
      setError(false);
    }

    event.target.value = sanitizedValue;
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
              {" "}
              {props?.edit != null ? (
                <EditOutlined onClick={() => props?.edit(props?.index)} />
              ) : null}
              <DeleteOutlined onClick={() => props?.remove(props.index)} />
            </Space>,
          ]}
        >
          <DatePicker
            defaultValue={dayjs(
              new Date(Date.now()).toLocaleDateString(),
              dateFormat
            )}
            format={dateFormat}
            onInput={handleInputChange}
          />
          <p className="subText">{props?.field?.description}</p>
          {error && (
            <Alert
              message="Apenas números são permitidos."
              type="error"
              showIcon
            />
          )}
        </Card>
      )}

      {!props?.preview && (
        <Form layout="vertical" form={props?.form} name="form">
          <Form.Item
            name={props?.field?.id}
            label={props?.field?.name}
            rules={[{ required: props?.field?.notNull }]}
            extra={<p className="subText">{props?.field?.description}</p>}
          >
            <DatePicker
              defaultValue={dayjs(new Date(Date.now()).toLocaleDateString(), dateFormat)}
              format={dateFormat}
              onInput={handleInputChange}
            />
          </Form.Item>
          {error && (
            <Alert
              message="Apenas números são permitidos."
              type="error"
              showIcon
            />
          )}
        </Form>
      )}
    </div>
  );
};

export default FieldDate;
