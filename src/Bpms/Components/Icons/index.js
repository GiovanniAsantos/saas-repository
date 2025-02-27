import {
    ApartmentOutlined,
    DatabaseOutlined,
    HddOutlined,
    MergeCellsOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
  } from "@ant-design/icons";
  import React from "react";
  
  export const Icons = [
    {
      enumTag: "WORKFLOW",
      icon: <MergeCellsOutlined />,
    },
    {
      enumTag: "PROCESS",
      icon: <SettingOutlined />,
    },
    {
      enumTag: "SERVER_PROCESS",
      icon: <DatabaseOutlined />,
    },
    {
      enumTag: "SHOPPING_CART",
      icon: <ShoppingCartOutlined />,
    },
    {
      enumTag: "FLOW_CHART",
      icon: <ApartmentOutlined />,
    },
    {
      enumTag: "BUILDING",
      icon: <HddOutlined />,
    },
  ];
  
  export const getIcons = (enumTag, color) => {
    if (enumTag === "WORKFLOW") {
      return <MergeCellsOutlined style={{ color:  color  }} />;
    }
    if (enumTag === "PROCESS") {
      return <SettingOutlined style={{ color: color  }} />;
    }
    if (enumTag === "SERVER_PROCESS") {
      return <DatabaseOutlined style={{ color:  color  }} />;
    }
    if (enumTag === "SHOPPING_CART") {
      return <ShoppingCartOutlined style={{ color:  color  }} />;
    }
    if (enumTag === "FLOW_CHART") {
      return <ApartmentOutlined style={{ color:  color  }} />;
    }
    if (enumTag === "BUILDING") {
      return <HddOutlined style={{ color:  color  }} />;
    }
  };
  