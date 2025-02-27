import { DeleteOutlined, EditOutlined, InboxOutlined } from "@ant-design/icons";
import { Card, Form, Space } from "antd";
import Dragger from "antd/es/upload/Dragger";
import React, { useState } from "react";

import { toast } from "react-toastify";
import "./style.module.css";

const FieldAtt = (props) => {
 
  const [fileList, setFileList] = useState([]);

  const accept = (name) => {
    const accepts = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png"];
    return accepts.includes(name.split(".").pop().toLowerCase());
  };

  const propsDragger = {
    onRemove: (file) => {
      setFileList((prevFileList) =>
        prevFileList.filter((f) => f.uid !== file.uid)
      );
    },
    beforeUpload: (file) => {
      if (accept(file.name)) {
        setFileList((prevFileList) => [...prevFileList, file]);
      } else {
        toast.warn(
          "Tipo de arquivo não suportado. Aceitos: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG."
        );
      }
      return false; // Impede o upload automático
    },
    onDrop: (e) => {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter((file) => accept(file.name));
      const invalidFiles = files.filter((file) => !accept(file.name));

      if (invalidFiles.length > 0) {
        toast.warn("Alguns arquivos foram ignorados por não serem suportados.");
      }

      setFileList((prevFileList) => [...prevFileList, ...validFiles]);
    },
    fileList: fileList,
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
          extra={
            <Space key="extra">
              {props?.edit != null ? (
                <EditOutlined onClick={() => props?.edit(props?.index)} />
              ) : null}
              <DeleteOutlined onClick={() => props?.remove(props.index)} />
            </Space>
          }
        >
          <Dragger disabled={true}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Clique ou arraste o arquivo</p>
            <p className="subText">{props?.field?.description}</p>
          </Dragger>
        </Card>
      )}

      {!props?.preview && (
        <Form.Item
          name={props?.field?.id}
          label={props?.field?.name}
          rules={[
            props?.isRequired != null
              ? { required: props?.isRequired }
              : { required: props?.notNull },
          ]}
          extra={<p className="subText">{props?.field?.description}</p>}
        >
          <Dragger
            {...propsDragger}
            name={"file"}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            multiple={true}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Clique ou arraste o(s) arquivo(s)</p>
          </Dragger>
        </Form.Item>
      )}
    </div>
  );
};

export default FieldAtt;
