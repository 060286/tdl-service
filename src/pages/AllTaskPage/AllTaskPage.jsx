import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllTask,
  selectAllTasks,
  updateTodoTitleSlice,
  updateTodoDescriptionSlice,
  updateSubTaskStatus,
  removeSubTask,
  createSubTask,
} from "../../slices/allMyTaskSlice";
import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import { Box, Grid, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";

import clsx from "clsx";
import { makeStyles } from "@mui/styles/";
import Accordition from "../../components/Accordition/Accordition";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
import _ from "lodash";
import {
  removeTodoFromList,
  archiveTodo,
  addNewTodo,
  createSubTodo,
  addSubTaskToDetailTodo,
  updateSubTaskStatusSlice,
  getTagListSlice,
  setDefaultTagList,
  updateTodoTagSlicde,
} from "../../slices/todoSlice";

import {
  createTodoSlice,
  updateTodoTag,
  updateTodoRemind,
} from "../../slices/allMyTaskSlice";

import { removeSubTaskByIdSlice } from "../../slices/subtaskSlice";
import { updateRemindAtAdapter } from "../../adapters/taskAdapter";

const useStyle = makeStyles(() => ({
  listItem: {
    borderRadius: "16px",
    padding: "4px",
  },
  container: {
    marginTop: "16px",
    marginLeft: '50px',
    height: "calc(100% - 100px)"
  },
  gridContainer: {
    marginTop: "16px",
    height: "100%",
  },
  rightContainer: {
    overflow: "scroll",
  },
  item: {
    height: "100%",
    overflow: "scroll",
  },
  todoDetail: {
    border: "1px solid #ccc",
    borderRadius: "16px",
    padding: "16px",
  },
  containerAcc: {
    border: "1px solid #ccc",
    boxShadow: '10px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: "16px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  accordition: {
    marginBottom: "32px",
    maxHeight: "calc(100% - 32px)",
    overflow: "scroll",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  selectedTodoContainer: {
    paddingTop: "0",
  },
}));

const AllTaskPage = () => {
  const dispatch = useDispatch();
  const classes = useStyle();
  const tasks = useSelector(selectAllTasks);
  const [selectedTodo, setSelectedTodo] = useState(undefined);
  const [subtaskText, setSubtaskText] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const tasksStatus = useSelector(
    (state) => state.allTaskReducer.allTasks.status
  );
  const [currentTask, setCurrentTask] = useState(undefined); // Get current open task
  const [openTag, setOpenTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState(undefined);
  const [selectedTagDetail, setSelectedTagDetail] = useState(undefined);
  const [openRemindMe, setOpenRemindMe] = useState(false);

  useEffect(() => {
    if (tasksStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getAllTask(tasks));
    }
  }, [tasksStatus, dispatch, tasks]);

  const onOpenRemindMe = () => {
    setOpenRemindMe(true);
  };

  const onCloseRemindMe = () => {
    setOpenRemindMe(false);
  };

  const debouncedTitle = useRef(
    _.debounce(async ({ id, title }) => {
      await dispatch(updateTodoTitleSlice({ id, title }));
    }, 500)
  ).current;

  const onTodoTitleChange = ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      title: e.target.value,
    }));
    debouncedTitle({ id: todo.id, title: e.target.value });
  };

  const debouncedDescription = useRef(
    _.debounce(async ({ id, description }) => {
      await dispatch(updateTodoDescriptionSlice({ id, description }));
    }, 500)
  ).current;

  const onTodoDescriptionChange = ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      description: e.target.value,
    }));
    debouncedDescription({ id: todo.id, description: e.target.value });
  };

  const handleTodoIsCompletedChange = (todo, e) => {
    // TODO: call api to update todo of this todo
  };
  const handleArchivedTodo = async () => {
    await dispatch(removeTodoFromList(selectedTodo.id));
    await dispatch(archiveTodo(selectedTodo.id));
    dispatch(getAllTask());
    setSelectedTodo(undefined);
  };
  const handleClose = () => {
    setSelectedTodo(undefined);
  };

  const onSubTaskChange = (e, subtask, todoId) => {
    // TODO: send request to BE to update subtask text

    const { id } = subtask;
    const title = e.target.value;

    // dispatch(updateSubTaskTitle({ id, title, todoId }));
  };

  const onSubTaskIsCompletedChange = (subtask, e) => {
    // TODO: send request to BE to update isCompleted subtask
    const { id } = subtask;

    dispatch(updateSubTaskStatus({ id, currentTask }));

    // ? UPDATE API
    dispatch(updateSubTaskStatusSlice(id));
  };

  const onDeleteSubTask = (subTask) => {
    // TODO: send request to be to delete subtask
    const data = { ...subTask, todoId: selectedTodo.id };

    // * Remove from state
    const newSelectedTodo = selectedTodo;
    const newSubTask = newSelectedTodo.subTasks.filter((el) => {
      return el.id !== subTask.id;
    });

    const result = { ...newSelectedTodo, subTasks: newSubTask };

    // * Remove from slice
    dispatch(removeSubTask(data));
    setSelectedTodo(result);
    dispatch(removeSubTaskByIdSlice(subTask.id));
  };

  const onTodoClick = (todo, title) => {
    console.log(todo, title);

    setSelectedTodo(todo);
    setCurrentTask(title);

    setSelectedTagDetail(todo.tag);
  };

  const handleCreateSubtask = async (e, id, tod) => {
    if (e.key === "Enter") {
      const newSubTask = await dispatch(
        createSubTodo({ todoId: id, name: e.target.value })
      );

      const subTaskId = newSubTask.payload.response.data.data.id;
      const subTaskname = newSubTask.payload.response.data.data.title;

      setSubtaskText("");

      const data = {
        ...newSubTask.payload.response.data.data,
        isCompleted: false,
        todoId: selectedTodo.id,
        current: currentTask,
      };

      // * Create subtask in slice
      dispatch(createSubTask(data));

      // * Create subtask in selectedTodo
      let oldSubTasks = selectedTodo.subTasks;
      const st = {
        id: subTaskId,
        name: subTaskname,
        isCompleted: false,
      };

      const result = [...oldSubTasks, st];
      const newSelectedTodo = { ...selectedTodo, subTasks: result };

      setSelectedTodo(newSelectedTodo);

      e.target.value = "";
    }
  };

  const onKeyPressHandler = async (e) => {
    const enterKey = "Enter";
    const cansave =
      addRequestStatus === VARIABLE_STATUS.IDLE &&
      taskTitle.length > 0 &&
      taskTitle !== "Add Task";
    if (e.key === enterKey) {
      try {
        if (!cansave) {
          alert("Please fill the task!");
          return;
        }

        setAddRequestStatus(VARIABLE_STATUS.LOADING);
        const newTodo = await dispatch(addNewTodo({ title: taskTitle }));

        dispatch(createTodoSlice(newTodo.payload));
        setTaskTitle("");
      } catch (err) {
        console.log("Failed to save the post", err);
      } finally {
        setAddRequestStatus(VARIABLE_STATUS.IDLE);
      }
    }
  };

  const onOpenSelectedTag = async () => {
    const { payload } = await dispatch(getTagListSlice());
    setOpenTag(true);
    setSelectedTag(payload?.data?.data);
  };

  const onCloseSelectedTag = () => {
    setOpenTag(false);
    dispatch(setDefaultTagList());
    setSelectedTag(undefined);
  };

  const onTagItemClick = async (tag, todoId) => {
    setOpenTag(false);
    setSelectedTagDetail(tag);

    // ? Update on API

    const res = await dispatch(updateTodoTagSlicde({ tag, todoId }));
    const newSelectedTodo = { ...selectedTodo };

    newSelectedTodo.tag = res.payload?.data?.data;

    setSelectedTodo(newSelectedTodo);
    dispatch(
      updateTodoTag({
        tag: res.payload.data.data,
        todoId,
      })
    );
  };

  const onUpdateRemindAtHandler = async (data) => {
    dispatch(updateTodoRemind(data));

    const response = await updateRemindAtAdapter({
      todoId: data.todoId,
      remindAt: data.remindAt,
    });

    console.log(response);
  };

  return (
    <Box className={classes.container}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>All My Tasks</Typography>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item className={clsx(classes.item, classes.containerAcc)} xs={6}>
          <Box className={classes.accordition}>
            <Accordition
              tasks={tasks?.data?.allTaskToday}
              title={"Today"}
              handleTodoIsCompletedChange={handleTodoIsCompletedChange}
              onClick={onTodoClick}
            />
            <Accordition
              tasks={tasks?.data?.allTaskTomorrow}
              title={"Tomorrow"}
              handleTodoIsCompletedChange={handleTodoIsCompletedChange}
              onClick={onTodoClick}
            />
            <Accordition
              tasks={tasks?.data?.allTaskUpComming}
              title={"Upcoming"}
              onClick={onTodoClick}
              handleTodoIsCompletedChange={handleTodoIsCompletedChange}
            />
          </Box>
          <Box className={classes.input}>
            <TextField
              sx={{ boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)' }}
              label="Enter todo content"
              placeholder="Enter todo content"
              color="primary"
              fullWidth
              focused
              value={taskTitle}
              onKeyUp={(e) => onKeyPressHandler(e)}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </Box>
        </Grid>
        <Grid item spacing={2} xs={6} className={classes.selectedTodoContainer}>
          {selectedTodo && (
            <TodoDetail
              className={classes.todoDetail}
              selectedTodo={selectedTodo}
              handleArchivedTodo={handleArchivedTodo}
              handleClose={handleClose}
              setSelectedTodo={setSelectedTodo}
              onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
              onSubTaskChange={onSubTaskChange}
              onTodoTitleChange={onTodoTitleChange}
              handleCreateSubtask={handleCreateSubtask}
              onTodoDescriptionChange={onTodoDescriptionChange}
              onDeleteSubTask={onDeleteSubTask}
              selectedTag={selectedTag}
              openTag={openTag}
              onOpenSelectedTag={onOpenSelectedTag}
              onCloseSelectedTag={onCloseSelectedTag}
              onTagItemClick={onTagItemClick}
              selectedTagDetail={selectedTagDetail}
              onOpenRemindMe={onOpenRemindMe}
              openRemindMe={openRemindMe}
              onUpdateRemindAtHandler={onUpdateRemindAtHandler}
              onCloseRemindMe={onCloseRemindMe}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllTaskPage;
