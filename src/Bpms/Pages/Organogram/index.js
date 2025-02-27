"use client";
import { Card, Spin } from "antd";

import React, { useEffect } from "react";
import "./style.module.css";
import { useState } from "react";
import ReactFlow, { Controls, Background, MiniMap } from "reactflow";
import "reactflow/dist/style.css";
import DepartmentNode from "./Components";
import { OrganogramService } from "../../../Services/Bpms/OrganogramService/OrganogramService";

const nodeTypes = {
  departmentNode: DepartmentNode,
};

const calculatePosition = (index, level, totalNodesAtLevel) => {
  const baseX = 250;
  const baseY = 100;
  const offsetX = 400;
  const offsetY = 300;

  const totalWidth = (totalNodesAtLevel - 1) * offsetX;
  const x = baseX - totalWidth / 2 + index * offsetX;
  const y = baseY + level * offsetY;

  return { x, y };
};

const getLevel = (nodeId, data) => {
  let level = 0;
  let currentNode = data.find((item) => item.id === nodeId);
  while (currentNode?.parentId) {
    level += 1;
    currentNode = data.find((item) => item.id === currentNode.parentId);
  }
  return level;
};

const Organogram = () => {
  const organogramService = new OrganogramService();

  const [loading, setLoading] = useState(false);

  const [nodes, setNodes] = useState([]);

  const [edges, setEdges] = useState([]);

  const getDepartmentsV2 = () => {
    setLoading(true);
    organogramService
      .getDepartmentsV2()
      .then((response) => {
        const { nodes, edges } = generateNodesAndEdges(response.data);
        setNodes(nodes);
        setEdges(edges);
      })
      .catch((error) => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getDepartmentsV2();
  }, []);

  const generateNodesAndEdges = (data) => {
    const nodes = [];
    const edges = [];
    const levels = {};

    data.forEach((item) => {
      const level = getLevel(item.id, data);
      if (!levels[level]) {
        levels[level] = [];
      }
      levels[level].push(item);
    });

    Object.keys(levels).forEach((level) => {
      levels[level].forEach((item, index) => {
        const position = calculatePosition(
          index,
          parseInt(level),
          levels[level].length
        );

        nodes.push({
          id: item.id.toString(),
          type: "departmentNode",
          data: {
            id: item?.id,
            label: item?.name,
            description: item?.description,
            color: item?.color,
            icon: item?.icon,
            updateDepartments: () => getDepartmentsV2(),
          },
          position: position,
        });

        if (item.parentId) {
          edges.push({
            id: `e${item.parentId}-${item.id}`,
            source: item.parentId.toString(),
            target: item.id.toString(),
            animated: true,
          });
        }
      });
    });

    return { nodes, edges };
  };

  return (
    <Spin spinning={loading} text="Processando...">
      <Card>
        <div style={{ height: "100vh", width: "100%" }}>
          <ReactFlow nodes={nodes} edges={edges} fitView nodeTypes={nodeTypes}>
            <MiniMap />
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </Card>
    </Spin>
  );
};

export default Organogram;
