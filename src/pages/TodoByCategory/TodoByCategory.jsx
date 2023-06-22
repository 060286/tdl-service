import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";
import _ from "lodash";
import clsx from "clsx";
import { makeStyles } from "@mui/styles/";
import Accordition from "../../components/Accordition/Accordition";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
import { Box, Grid, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { createTodo } from "../../adapters/myDayPageAdapter";
import { archiveTodoById } from "../../adapters/taskAdapter";
import { updateTodoTitle } from "../../adapters/allMyTaskAdapter";
import { updateRemindAtAdapter } from "../../adapters/taskAdapter";
import {
  updateSubTaskStatusAdapter,
  removeSubTaskByIdAdapter,
} from "../../adapters/myDayPageAdapter";
import { createSubTaskInTodo } from "../../adapters/taskAdapter";
import { updateTodoDescription } from "../../adapters/allMyTaskAdapter";
import { getTagListAdapter } from "../../adapters/taskAdapter";
import { useDispatch, useSelector } from "react-redux";
import {
  removeSelectedTodoId,
  setDefaultTagList,
} from "../../slices/todoSlice";

const useStyle = makeStyles(() => ({
  listItem: {
    borderRadius: "16px",
    padding: "4px",
  },
  container: {
    marginTop: "16px",
    marginLeft: '50px',
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
    justifyContent: "flex-start",
  },
  selectedTodoContainer: {
    paddingTop: "0",
  },
}));

const TodoByCategory = () => {
  const { id } = useParams();
  const classes = useStyle();
  const [selectedTodo, setSelectedTodo] = useState(undefined);
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState(null);
  const [todoTitle, setTodoTitle] = useState("");
  const [openRemindMe, setOpenRemindMe] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState(undefined);
  const [selectedTagDetail, setSelectedTagDetail] = useState(undefined);
  const dispatch = useDispatch();
  const selectedId = useSelector(
    (state) => state.todoReducer.selectedTodoId.id
  );

  useEffect(() => {
    if (!id.includes("isSearch=true")) {
      dispatch(removeSelectedTodoId());
    }

    const fetchData = async (todoCategoryId) => {
      const url = `https://localhost:44334/api/v1/all-list-page/task-by-category?categoryId=${todoCategoryId}`;
      const token = getTokenFromLocalStorage();

      const response = await axios({
        method: "get",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos(response.data?.data?.todos);
      setTitle(response?.data?.data.categoryName);

      if (selectedId) {
        const todo = response.data?.data?.todos.find(
          (todo) => todo.id === selectedId
        );

        setSelectedTodo(todo);
      }
    };

    fetchData(id);
  }, [id, dispatch, selectedId]);

  const onTodoClick = (todo, title) => {
    setSelectedTodo(todo);
  };

  const getTodoByCategory = async (id) => {
    const url = `https://localhost:44334/api/v1/all-list-page/task-by-category?categoryId=${id}`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTodos(response.data?.data?.todos);
    setTitle(response?.data?.data.categoryName);
  };

  const handleCreateTodo = async (e) => {
    if (e.key === "Enter") {
      // clear input
      setTodoTitle("");
      e.target.value = "";

      const response = await createTodo({
        title: todoTitle,
        todoDate: new Date().toLocaleString(),
        categoryId: id,
      });

      if (response.isSuccess && response.statusCode === 200) {
        // Reload page
        getTodoByCategory(id);
      }
    }
  };

  const handleArchivedTodo = async () => {
    const response = await archiveTodoById(selectedTodo.id);

    setSelectedTodo(undefined);

    if (response.status === 200) {
      getTodoByCategory(id);
    }
  };

  const debouncedTitle = useRef(
    _.debounce(({ todoId, title, currentTodos }) => {
      const newTodos = currentTodos.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, title: title };
        }

        return todo;
      });

      setTodos(newTodos);

      // Call api
      updateTodoTitle({ id: todoId, title });
    }, 500)
  ).current;

  const onTodoTitleChange = async ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      title: e.target.value,
    }));
    debouncedTitle({
      todoId: todo.id,
      title: e.target.value,
      currentTodos: todos,
    });
  };

  const onOpenRemindMe = () => {
    setOpenRemindMe(true);
  };

  const onCloseRemindMe = () => {
    setOpenRemindMe(false);
  };

  const onUpdateRemindAtHandler = async (data) => {
    const { todoId, remindAt } = data;

    const newTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, remindedAt: remindAt.toLocaleString() };
      }

      return todo;
    });

    await updateRemindAtAdapter(data);
    setTodos(newTodos);
  };

  const onSubTaskIsCompletedChange = async (subTask, e) => {
    const status = !subTask.isCompleted;

    await updateSubTaskStatusAdapter(subTask.id);

    const newTodos = todos.map((todo) => {
      if (todo.id === selectedTodo.id) {
        const newSubTasks = todo?.subTasks?.map((st) => {
          if (st.id === subTask.id) {
            return { ...st, isCompleted: status };
          }

          return st;
        });

        return { ...todo, subTasks: newSubTasks };
      }

      return todo;
    });

    setTodos(newTodos);
  };

  const onDeleteSubTask = async (subTask) => {
    const subTaskId = subTask.id;

    await removeSubTaskByIdAdapter(subTask.id);

    const newsTodo = todos.map((todo) => {
      if (todo.id === selectedTodo.id) {
        const newSubTasks = todo?.subTasks?.filter(
          (obj) => obj.id !== subTaskId
        );

        setSelectedTodo({ ...todo, subTasks: newSubTasks });

        return { ...todo, subTasks: newSubTasks };
      }

      return todo;
    });

    setTodos(newsTodo);
  };

  const handleCreateSubtask = async (e, id) => {
    if (e.key === "Enter") {
      const response = await createSubTaskInTodo({
        name: e.target.value,
        todoId: selectedTodo.id,
      });

      if (response.status === 200) {
        const data = response.data.data;

        const newSubTask = {
          id: data.id,
          name: data.title,
          isCompleted: data.isCompleted,
        };

        const newSelectedTodo = {
          ...selectedTodo,
          subTasks: [...selectedTodo.subTasks, newSubTask],
        };

        setSelectedTodo(newSelectedTodo);
      }

      e.target.value = "";
    }
  };

  const debouncedDescription = useRef(
    _.debounce(async ({ id, description, todos }) => {
      updateTodoDescription({ id, description });

      const newTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, description: description };
        }

        return todo;
      });

      setTodos(newTodos);
    }, 500)
  ).current;

  const onTodoDescriptionChange = async ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      description: e.target.value,
    }));
    debouncedDescription({ id: todo.id, description: e.target.value, todos });
  };

  const onTagItemClick = async (tag, todoId) => {
    setOpenTag(false);
    const newSelectedTodo = { ...selectedTodo, tag };

    setSelectedTodo(newSelectedTodo);
    setSelectedTagDetail(tag);
  };

  const onOpenSelectedTag = async () => {
    const response = await getTagListAdapter();

    setSelectedTag(response?.data?.data);
    setOpenTag(true);
  };

  const onSubTaskChange = async (e, subTask, todoId) => {
    console.log(e.target.value, subTask, todoId);
  };

  const onCloseSelectedTag = async () => {
    setOpenTag(false);
    setSelectedTag(undefined);

    dispatch(setDefaultTagList());
  };

  return (
    <Box className={classes.container}>
      <Typography variant="h5" sx={{ fontWeight: 800 }}>Manage todo by category</Typography>
      <Grid container spacing={2} className={classes.gridContainer}>
        <Grid item className={clsx(classes.item, classes.containerAcc)} xs={6}>
          <Box className={classes.accordition}>
            <Accordition
              tasks={todos}
              title={title ? `Todo of ${title}` : "Loading..."}
              // handleTodoIsCompletedChange={handleTodoIsCompletedChange}
              onClick={onTodoClick}
            />
          </Box>
          <Box className={classes.input}>
            <TextField
              label="Enter todo content"
              placeholder="Click to quickly add a todo"
              color="primary"
              fullWidth
              focused
              // value={todoTitle}
              onKeyUp={(e) => handleCreateTodo(e)}
              onChange={(e) => setTodoTitle(e.target.value)}
            />
          </Box>
        </Grid>
        <Grid item spacing={2} xs={6} className={classes.selectedTodoContainer}>
          {selectedTodo && (
            <TodoDetail
              className={classes.todoDetail}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
              handleArchivedTodo={handleArchivedTodo}
              onDeleteSubTask={onDeleteSubTask}
              onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
              onTodoTitleChange={onTodoTitleChange}
              openTag={openTag}
              onOpenRemindMe={onOpenRemindMe}
              openRemindMe={openRemindMe}
              onUpdateRemindAtHandler={onUpdateRemindAtHandler}
              onCloseRemindMe={onCloseRemindMe}
              handleCreateSubtask={handleCreateSubtask}
              onTodoDescriptionChange={onTodoDescriptionChange}
              onTagItemClick={onTagItemClick}
              selectedTag={selectedTag}
              onOpenSelectedTag={onOpenSelectedTag}
              selectedTagDetail={selectedTagDetail}
              onSubTaskChange={onSubTaskChange}
              onCloseSelectedTag={onCloseSelectedTag}
              // handleClose={handleClose}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TodoByCategory;
