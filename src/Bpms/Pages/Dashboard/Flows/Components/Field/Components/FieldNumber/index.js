/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Form, InputNumber, Space } from "antd";
import "./style.module.css";

const FieldNumber = (props) => {
  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;

    // Permitir apenas números (48-57) e teclas de navegação (delete, backspace, setas)
    if (
      (charCode < 48 || charCode > 57) &&
      charCode !== 8 && // Backspace
      charCode !== 46 && // Delete
      !(charCode >= 37 && charCode <= 40) // Setas de navegação
    ) {
      event.preventDefault();
    }
  };

  const handleBeforeInput = (event) => {
    const invalidChars = /[^0-9]/g;
    if (invalidChars.test(event.data)) {
      event.preventDefault();
    }
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
          <InputNumber
            onKeyPress={handleKeyPress}
            onBeforeInput={handleBeforeInput}
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
          <InputNumber 
            onKeyPress={handleKeyPress}
            onBeforeInput={handleBeforeInput}
            maxLength={props?.field?.size} 
            size={props?.field?.size} 
          />
        </Form.Item>
      )}
    </div>
  );
};

export default FieldNumber;
