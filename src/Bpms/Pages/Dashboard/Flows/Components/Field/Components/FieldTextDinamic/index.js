/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";

import {
  Input,
  Card,
  Space,
} from "antd";
import "./style.module.css";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";


const FieldTextDinamic = (props) => {

 


  return (
    <div className="fields">
      {props?.preview && (
        <Card title={ props?.field?.notNull ? <span><span style={{color:"red"}}>*</span> {props?.title}</span> : props?.title} extra={props?.remove != null ? [<Space>{props?.edit != null ? <EditOutlined onClick={() => props?.edit(props?.index)} /> : null }<DeleteOutlined onClick={() => props?.remove(props.index)} /></Space>] : null}>
         <p className="subText">{props?.field?.description}</p>
        </Card >
      )}

      {!props?.preview && (
        <p></p>
      )}
    </div>
  );
}

export default FieldTextDinamic;