import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
// import TaskModal from "../Action/Task/View/index.js";
import Column from "../../../../../../Bpms/Pages/Dashboard/Flows/Components/Column/index"
import "./style.module.css";
import TaskContent from "../Task/Components/TaskView/index.js";

const Boardn = (props) => {
  const [t] = useTranslation("global");

  const [taskId] = useState(props.taskId);

  const [data, setData] = useState({
    tasks: {},
    columns: {},
    columnOrder: [],
  });

  const [taskSelected, setTaskSelected] = useState(null);
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    if (props?.flow) {
      generateDataDnd();
    }
  }, [props?.flow]);

  useEffect(() => {
    if (props?.taskId) {
      openTaskByEmail();
    }
  }, [props?.taskId, props?.flow]);

  const openTaskByEmail = () => {
    props?.flow?.steps?.forEach((s) => {
      s?.tasks?.forEach((t) => {
        if (t.id.toString() === taskId) {
          props?.setOpenTaskViewDetail(true);
          getContent(t);
        }
      });
    });
  };

  const openTaskModalById = (id) => {
    // Procura a tarefa no fluxo
    const selectedTask = findTaskById(id);
    if (selectedTask) {
      setTaskSelected(selectedTask);
      setIsTaskModalOpen(true); // Abre o modal
    }
  };

  // Função auxiliar para encontrar a tarefa pelo ID
  const findTaskById = (id) => {
    return Object.values(data.tasks).find(
      (task) => task.taskId.toString() === id.toString()
    );
  };

  const generateDataDnd = (f) => {
    let temp = {
      tasks: {},
      columns: {},
      columnOrder: [],
    };

    const last = props?.flow?.steps?.length + 1;
    const tasksTemp = [];

    props?.flow?.steps?.forEach((s) => {
      const tasksIds = [];

      s?.tasks?.forEach((t) => {
        tasksIds.push("task-".concat(t?.id).toString());

        if (!tasksTemp.find((tt) => tt.id == t.id)) {
          tasksTemp.push(t);
        }
      });

      temp.columns[s.sequence] = {
        id: s.sequence,
        flowId: f?.id,
        stepId: s?.id,
        name: s?.name,
        description: s?.description,
        createdAt: s?.createdAt,
        updatedAt: s?.updatedAt,
        sequence: s?.sequence,
        color: s?.color,
        notifyAdmIn: s?.notifyAdmIn,
        admTimeUnity: s?.admTimeUnity,
        time: s?.time,
        timeUnit: s?.timeUnit,
        timeWorkingDays: s?.timeWorkingDays,
        sharedInfo: s?.sharedInfo,
        validatedBy: s?.validatedBy,
        validatedByExternal: s?.validatedByExternal,
        finalStep: s?.finalStep,
        initialStep: s?.initialStep,
        typeFinalStep: s?.typeFinalStep,
        parentStepId: s?.parentStepId,
        isStep: true,
        taskIds: tasksIds,
        onlyTheCreator: s?.onlyTheCreator,
      };

      temp.columnOrder.push(s.sequence);
    });

    tasksTemp.forEach((t) => {
      const taskId = "task-".concat(t?.id).toString();
      const content = getContent(t);

      temp.tasks[taskId] = {
        id: taskId,
        taskId: t?.id,
        content: content,
      };
    });

    temp.columns[last] = {
      id: last,
      name: t("bpms.dashboard.boardn.btnCreateNewStepClumn"),
      color: "#000",
      isStep: false,
      taskIds: [],
    };

    temp.columnOrder.push(last);

    setData(temp);
  };

  const getContent = (t) => {
    return (
      <TaskContent
        taskId={t.id}
        values={t}
        openTaskViewDetail={props?.openTaskViewDetail}
        setOpenTaskViewDetail={props?.setOpenTaskViewDetail}
        viewInit={true}
        steps={props?.flow?.steps}
      />
    );
  };

  const onDragEnd = (result) => {
    return;
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban">
          {data.columnOrder.map((columnId) => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                newTask={props?.newTask}
                flow={props?.flow}
                getFlow={props.getFlow}
                isMyTask={props?.isMyTask}
                isMyPendingWork={props?.isMyPendingWork}
              />
            );
          })}
        </div>
      </DragDropContext>
      <Modal
        open={isTaskModalOpen}
        onCancel={() => setIsTaskModalOpen(false)}
        footer={null}
        title={taskSelected?.name}
      >
        {taskSelected && (
          <TaskContent
            taskId={taskSelected.taskId}
            values={taskSelected}
            openTaskViewDetail={isTaskModalOpen}
            setOpenTaskViewDetail={setIsTaskModalOpen}
            viewInit={true}
            steps={props?.flow?.steps}
          />
        )}
      </Modal>
    </div>
  );
};

export default Boardn;
