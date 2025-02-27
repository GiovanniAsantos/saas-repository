import { Card, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import "./style.module.css";

const Task = (props) => {
  const [loading, setLoading] = useState(props?.newTask);

  useEffect(() => {
    if (props?.newTask) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [props?.newTask]);

  return (
    <Draggable draggableId={props?.task.id} index={props?.index}>
      {(provided) => (
        <div className="task">
          <Spin spinning={loading}>
            <Card
              style={{
                background: "#F2F2F2",
                fontFamily: "Arial, sans-serif",
                fontSize: "4.5rem",
                borderLeft: `4px solid ${props?.columnSelectColor}`,
                margin: 0,
                padding: 0,
              }}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={(node) => provided.innerRef(node)}
            >
              {props?.task.content}
            </Card>
          </Spin>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
