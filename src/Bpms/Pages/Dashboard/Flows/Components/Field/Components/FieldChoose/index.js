/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
  Card,
  Form,
  Input,
  Space,
} from "antd";

import "./style.module.css";

const FieldChoose = (props) => {

 


  return (
    <div className="fields">
      {props?.preview &&  (
        <Card title={ props?.field?.notNull ? <span><span style={{color:"red"}}>*</span> {props?.title}</span> : props?.title} bordered={false} extra={props?.remove != null ? [<Space>{props?.edit != null ? <EditOutlined onClick={() => props?.edit(props?.index)} /> : null } <DeleteOutlined onClick={() => props?.remove(props.index)} /></Space>] : null}>
          <Input />
          <p className="subText">{props?.field?.description}</p>
        </Card >
      )}

      {!props?.preview && (
        <Form
          layout="vertical"
          form={props?.form}
          name="form"
        >
          <Form.Item
            name={props?.field?.id}
            label={props?.field?.name}
            rules={[{ required: props?.field?.notNull }]}
            extra={
              <p className="subText">
                {props?.field?.description}
              </p>
            }
          >
            <Input maxLength={props?.field?.size} size={props?.field?.size} />

          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default FieldChoose;