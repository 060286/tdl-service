import React, { useEffect, useState } from "react";

import { useParams } from "react-router";
import axios from "axios";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";

import clsx from "clsx";
import { makeStyles } from "@mui/styles/";
import Accordition from "../../components/Accordition/Accordition";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
import { Box, Grid, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";

import { createTodo } from "../../adapters/myDayPageAdapter";

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

  useEffect(() => {
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
    };

    fetchData(id);
  }, [id]);

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
  }

  const handleCreateTodo = async (e) => {
    if (e.key === 'Enter') {
      console.log(todoTitle);

      // clear input
      setTodoTitle("");
      e.target.value = "";


      const response = await createTodo({
        title: todoTitle,
        todoDate: new Date().toLocaleString(),
        categoryId: id
      });

      console.log(response);

      if (response.isSuccess && response.statusCode === 200) {
        // Reload page
        getTodoByCategory(id);
      }
    }
  }

  return (
    <Box className={classes.container}>
      <Typography variant="h5">Manage todo by category</Typography>
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
            // handleArchivedTodo={handleArchivedTodo}
            // handleClose={handleClose}
            // onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
            // onSubTaskChange={onSubTaskChange}
            // onTodoTitleChange={onTodoTitleChange}
            // handleCreateSubtask={handleCreateSubtask}
            // onTodoDescriptionChange={onTodoDescriptionChange}
            // onDeleteSubTask={onDeleteSubTask}
            // selectedTag={selectedTag}
            // openTag={openTag}
            // onOpenSelectedTag={onOpenSelectedTag}
            // onCloseSelectedTag={onCloseSelectedTag}
            // onTagItemClick={onTagItemClick}
            // selectedTagDetail={selectedTagDetail}
            // onOpenRemindMe={onOpenRemindMe}
            // openRemindMe={openRemindMe}
            // onUpdateRemindAtHandler={onUpdateRemindAtHandler}
            // onCloseRemindMe={onCloseRemindMe}
            />
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default TodoByCategory;
