import React from "react";
import { Input, Card, Space, Form } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

import "./style.module.css";

const FieldTextArea = (props) => {
  const { TextArea } = Input;
 
  const handleTextChange = (e) => {
    const value = e.target.value;
    const newValue = value.replaceAll("<br />", "\n");
    props.form.setFieldsValue({ [props?.field?.id]: newValue });
  };

  return (
    <div className="fields">
      {props?.preview && (
        <Card
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
            <Space key="extra">
              {props?.edit != null ? (
                <EditOutlined onClick={() => props?.edit(props?.index)} />
              ) : null}
              <DeleteOutlined onClick={() => props?.remove(props.index)} />
            </Space>,
          ]}
        >
          <TextArea
            maxLength={244}
            rows={4}
            className="custom-textArea"
            style={{ overflow: "auto" }}
            onChange={handleTextChange} // Adiciona a função de quebras de linha
          />
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
            <TextArea
              rows={3}
              maxLength={255}
              style={{ resize: "none", overflow: "auto" }}
              onChange={handleTextChange} // Adiciona a função de quebras de linha
            />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default FieldTextArea;
