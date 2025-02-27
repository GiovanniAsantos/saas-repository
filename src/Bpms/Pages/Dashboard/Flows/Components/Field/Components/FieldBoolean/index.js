/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

import {
  Radio,
  Card,
  Space,
  Form,
} from "antd";
import "./style.module.css";

import {
  MdOutlinePostAdd,
} from "react-icons/md";


import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const FieldBoolean = (props) => {

 

  return (
    <div className="fields">
      {props?.preview && (
        <Card title={ props?.field?.notNull ? <span><span style={{color:"red"}}>*</span> {props?.title}</span> : props?.title} extra={[<Space>{props?.edit != null ? <EditOutlined onClick={() => props?.edit(props?.index)} /> : null }<DeleteOutlined onClick={() => props?.remove(props.index)} /></Space>]}>
          <Radio.Group>
            <Radio value={1}>{props?.not}</Radio>
            <Radio value={2}>{props?.yes}</Radio>
          </Radio.Group>
          <p className="subText">{props?.field?.description}</p>
        </Card >
      )}

      {!props?.preview && (
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
          <Radio.Group>
            <Radio value={1}>{props?.not}</Radio>
            <Radio value={2}>{props?.yes}</Radio>
          </Radio.Group>
        </Form.Item>
      )}

    </div>
  );
}

export default FieldBoolean;