import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getAllTask,
  selectAllTasks,
  selectTaskDetail,
  updateTodoTitleSlice,
} from "../../slices/allMyTaskSlice";
import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import AllMyTask from "../../components/core/AllMyTask";
import {
  Box,
  Grid,
  Item,
  List,
  ListItem,
  ListItemButton,
  Radio,
  TextField,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import clsx from "clsx";
import { makeStyles } from "@mui/styles/";
import Accordition from "../../components/Accordition/Accordition";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
import _ from 'lodash';
import {
  getCurrentTodoList,
  selectAllTodos,
  removeTodoFromList,
  archiveTodo,
  getSuggestionTodo,
  selectAllSuggestionTodo,
  addNewTodo,
  createSubTodo,
  removeSuggestion,
  addSubTaskToDetailTodo,
  removeDetailTodo,
  selectTodoById,
  getTodoById,
  updateSubTaskStatusSlice,
} from "../../slices/todoSlice";
const useStyle = makeStyles(() => ({
  listItem: {
    borderRadius: "16px",
    padding: "4px",
  },
  container: {
    marginTop: "16px",
    height: "calc(100vh - 64px)",
  },
  gridContainer: {
    marginTop: "16px",
    height: "100%",
  },
  rightContainer: {
    overflow: "scroll",
  },
  item: {
    height: "calc(100% - 32px)",
    overflow: "scroll",
  },
  todoDetail: {
    border: "1px solid #ccc",
    borderRadius: "16px",
    padding: "16px",
  },
  containerAcc: {
    border: "1px solid #ccc",
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
    justifyContent: "flex-start"
  },
  selectedTodoContainer: {
    paddingTop: "0"
  }
}))
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
  const { data } = useSelector(selectTaskDetail);
  const tasksError = useSelector(
    (state) => state.allTaskReducer.allTasks.error
  );
  useEffect(() => {
    if (tasksStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getAllTask(tasks));
    }
  }, [tasksStatus, dispatch, tasks]);
  const onTodoTitleChange = ({ todo, e }) => {
    console.log({todo, e})
    setSelectedTodo((preSelectedTodo => ({...preSelectedTodo, title: e.target.value})))
    _.debounce(dispatch(updateTodoTitleSlice({id: todo.id, title: e.target.value})), 500);
  }
  const handleTodoIsCompletedChange = (todo, e) => {
    // TODO: call api to update todo of this todo

  };
  
  const handleArchivedTodo = async () => {
    await dispatch(removeTodoFromList(selectedTodo.id));
    await dispatch(archiveTodo(selectedTodo.id));
    dispatch(getAllTask())
    setSelectedTodo(undefined)
  };
  const handleClose = () => {
    setSelectedTodo(undefined);
  };

  // ? Function này dùng để cập nhật lại isCompleted của subtask
  const handleUpdateSubTaskStatus = async (data) => {
    await dispatch(updateSubTaskStatusSlice(data));

    const newTodo = dispatch(getTodoById(data.id));
    setSelectedTodo(newTodo);
  };

  const onSubTaskChange = (todo, e) => {
    // TODO: send request to BE to update subtask text
  };
  const onSubTaskIsCompletedChange = (todo, e) => {
    // TODO: send request to BE to update isCompleted subtask
  };
  const onSubTaskDelete = (todo) => {
    // TODO: send request to be to delete subtask
  };
  // ? Click mở popup sẽ call api lấy detail todo.
  const onTodoClick = async (todo) => {
    const response = await dispatch(getTodoById(todo.id));

    console.log({ response });

    setSelectedTodo(response.payload);
  };
  const handleCreateSubtask = async (e, id, tod) => {
    if (e.key === "Enter") {
      await dispatch(
        createSubTodo({ todoId: id, name: e.target.value })
      ).unwrap();

      setSubtaskText("");
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
        await dispatch(addNewTodo({ title: taskTitle })).unwrap();

        setTaskTitle("");
      } catch (err) {
        console.log("Failed to save the post", err);
      } finally {
        setAddRequestStatus(VARIABLE_STATUS.IDLE);
      }
    }
  };
  return (
    <Box className={classes.container}>
      <Typography variant="h5">All My Tasks</Typography>
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
          {
            selectedTodo && (
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
              />
            )
          }
        </Grid>
      </Grid>
    </Box>
  );
};

export default AllTaskPage;
