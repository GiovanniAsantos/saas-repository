/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Form, Input, Space } from "antd";
import "./style.module.css";

const FieldText = (props) => {
  return (
    <div className="fields">
      {props?.preview && (
        <Card
          style={{ height: "90px", width: "180px" }}
          title={
            props?.field?.notNull ? (
              <span>
                <span style={{ color: "red" }}>*</span> {props?.title}
              </span>
            ) : (
              props?.title
            )
          }
          bordered={false}
          extra={[
            <Space>
              {props?.edit != null ? (
                <EditOutlined onClick={() => props?.edit(props?.index)} />
              ) : null}{" "}
              {props?.remove != null ? (
                <DeleteOutlined onClick={() => props?.remove(props.index)} />
              ) : null}
            </Space>,
          ]}
        >
          <Input maxLength={200} />
          <p className="subText">{props?.field?.description}</p>
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
            <Input maxLength={props?.field?.size} size={props?.field?.size} />

          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default FieldText;
