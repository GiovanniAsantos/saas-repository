import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Form, InputNumber, Space } from "antd";
import React from "react";

import "./style.module.css";

const FieldCoin = (props) => {
 

  const formatCurrency = (value) => {
    if (!value) return "R$0,00";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const parseCurrency = (value) => {
    return value.replace(/\D/g, "") / 100;
  };

  const handleKeyPress = (event) => {
    const charCode = event.which ? event.which : event.keyCode;
    if (
      (charCode < 48 || charCode > 57) &&
      charCode !== 44 &&
      charCode !== 46 &&
      charCode !== 8 &&
      !(charCode >= 37 && charCode <= 40)
    ) {
      event.preventDefault();
    }
  };

  const handleBeforeInput = (event) => {
    const invalidChars = /[^0-9,]/g;
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
              ) : null}
              <DeleteOutlined onClick={() => props?.remove(props.index)} />
            </Space>,
          ]}
        >
          <InputNumber
            onKeyPress={handleKeyPress}
            onBeforeInput={handleBeforeInput}
            style={{ width: "100%" }}
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
            formatter={(value) => formatCurrency(value)}
            parser={(value) => parseCurrency(value)}
            style={{ width: "100%" }}
          />
        </Form.Item>
      )}
    </div>
  );
};

export default FieldCoin;
