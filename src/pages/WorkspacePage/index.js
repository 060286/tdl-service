import React, { useEffect, useState, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router";
import { makeStyles } from "@mui/styles/";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
import { HubConnectionBuilder } from "@microsoft/signalr";

import {
  Avatar,
  Tooltip,
  Divider,
  Dialog,
  Slide,
  DialogTitle,
  DialogContent,
  TextField,
  Autocomplete,
} from "@mui/material";
import { format, addDays } from "date-fns";
import _ from "lodash";
import axios from "axios";
import "./style.css";
import WorkspaceContainerItem from "../../components/core/WorkspaceContainerItem";
import { DragDropContext } from "react-beautiful-dnd";

import {
  updateTodoDescription,
  updateTodoTitle,
} from "../../adapters/allMyTaskAdapter";

import {
  archiveTodoById,
  getTagListAdapter,
  updateRemindAtAdapter,
} from "../../adapters/taskAdapter";
import { getTaskById, createSubTaskInTodo } from "../../adapters/taskAdapter";
import {
  addUserIntoWorkspaceAdapter,
  getTodoInWorkspaceById,
  getUserListAdapter,
  searchUserAdapter,
} from "../../adapters/workspaceAdapter";

import {
  updateSubTaskStatusAdapter,
  removeSubTaskByIdAdapter,
} from "../../adapters/myDayPageAdapter";
import { updateTodoTagAdapter } from "../../adapters/tagAdapter";

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
  navagateContainer: {
    width: "500px",
    height: "60px",
    background: "#cec9c9",
    border: "1px gray",
    borderRadius: "20px",
    marginTop: "10px",
    display: "flex",
    justifyContent: "space-between",
  },
  calendar: {
    width: "40",
    height: "100%",
    marginLeft: "15px",
    alignItems: "center",
    display: "flex",
  },
  calendarContent: {
    fontWeight: "700",
  },
  userList: {
    width: "60%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
  },
  addUserIcon: {
    cursor: "pointer",
  },
  searchUserDialog: {
    width: "600px",
    height: "100px",
  },
  searchUserTitle: {
    maxWidth: "600px",
    maxHeight: "100px",
    width: "100%",
    height: "100%",
  },
  workspaceContainer: {
    display: "flex",
    marginTop: "48px",
    // width: "175%",
    height: "calc(100% - 88px)",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

function WorkspacePage() {
  const { id } = useParams();
  const classes = useStyle();
  const [users, setUsers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [suggestionUser, setSuggestionUser] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionId, setConnectionId] = useState(null);
  const [state, setState] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(undefined);
  const [openTodoDialog, setOpenTodoDialog] = useState(false);
  const [openTag, setOpenTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState(undefined);
  const [selectedTagDetail, setSelectedTagDetail] = useState(undefined);
  const [openRemindMe, setOpenRemindMe] = useState(false);

  const handleCloseSearchDialog = () => {
    setOpenSearchUser(false);
  };

  const onOpenRemindMe = () => {
    setOpenRemindMe(true);
  };

  const onCloseRemindMe = () => {
    setOpenRemindMe(false);
  };

  const onUpdateRemindAtHandler = async (data) => {
    console.log(data);

    await updateRemindAtAdapter({
      todoId: data.todoId,
      remindAt: data.remindAt,
    });
  };

  const searchUsers = async (keyword) => {
    const users = await searchUserAdapter(keyword);

    const userData = users.data.data;
    const mapptedSuggestionUser = userData.map((user) => ({
      label: user.email,
      value: user.id,
    }));

    setSuggestionUser(mapptedSuggestionUser);
  };

  const getUserList = async () => {
    const response = await getUserListAdapter(id);

    setGroupName(response.data.data.name);
    setUsers(response.data.data.users);
  };

  const handleAddUserToWorkspace = async (e) => {
    if (e.key === "Enter") {
      const response = addUserIntoWorkspaceAdapter(e.target.value, id);

      if (response) {
        setOpenSearchUser(false);
      }
    }
  };

  const getTodoInWorkspace = async () => {
    const response = await getTodoInWorkspaceById(id);

    if (response) {
      const newState = [
        response.data.data.todoList || [],
        response.data.data.inProgressList || [],
        response.data.data.inReviewList || [],
        response.data.data.completedList || [],
      ];

      setState(newState);
    }
  };

  const handleClose = () => {
    setSelectedTodo(undefined);
    setOpenTodoDialog(false);
  };

  const handleClickOpen = async ({ todo }) => {
    const response = await getTaskById(todo.id);

    if (response) {
      setSelectedTodo(response.data);
      setOpenTodoDialog(true);
      setSelectedTagDetail(response.data.tag);
    }
  };

  const onTagItemClick = async (tag, todoId) => {
    setOpenTag(false);
    setSelectedTagDetail(tag);

    const data = { ...tag, todoId };
    await updateTodoTagAdapter(data);
  };

  const handleArchivedTodo = async ({ id }) => {
    const response = await archiveTodoById(id);

    if (response) {
      const newState = state.map((array) => {
        return array.filter((item) => item.id !== id);
      });

      setState(newState);

      setOpenTodoDialog(false);
      setSelectedTodo(undefined);
    }
  };

  // const debouncedTitle = useRef(
  //   _.debounce(({ id, title, state }) => {
  //     // Do not do any things.
  //   }, 500)
  // ).current;

  const onTodoTitleChange = async ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      title: e.target.value,
    }));

    // debouncedTitle({ id: todo.id, title: e.target.value });
    const response = await updateTodoTitle({
      id: todo.id,
      title: e.target.value,
    });

    if (response) {
      const updatedArray = state.map((array) => {
        return array.map((item) => {
          if (item.id === todo.id) {
            return { ...item, title: e.target.value };
          }
          return item;
        });
      });

      setState(updatedArray);
    }
  };

  // ? Update todo description

  const onTodoDescriptionChange = async ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      description: e.target.value,
    }));

    const response = await updateTodoDescription({
      id: todo.id,
      description: e.target.value,
    });

    if (response.statusCode === 200) {
      const updatedArray = state.map((array) => {
        return array.map((item) => {
          if (item.id === id) {
            return { ...item, description: e.target.value };
          }
          return item;
        });
      });

      setState(updatedArray);
    }
  };

  const onDeleteSubTask = async (subTask) => {
    // TODO: send request to be to delete subtask
    const response = await removeSubTaskByIdAdapter(subTask.id);

    if (response) {
      // * Remove from state
      const newSelectedTodo = selectedTodo;
      const newSubTask = newSelectedTodo.subTasks.filter((el) => {
        return el.id !== subTask.id;
      });

      const result = { ...newSelectedTodo, subTasks: newSubTask };
      setSelectedTodo(result);
    }

    //const data = { ...subTask, todoId: selectedTodo.id };
  };

  const handleCreateSubtask = async (e, id, subtask) => {
    if (e.key === "Enter") {
      const name = e.target.value;

      console.log({ name, id });
      const response = await createSubTaskInTodo({ name, todoId: id });

      console.log({ response });

      // update selectedTodo
      let oldSubTasks = selectedTodo.subTasks;
      const st = {
        id: response.data.data.id,
        name: response.data.data.title,
        isCompleted: false,
      };

      const result = [...oldSubTasks, st];
      const newSelectedTodo = { ...selectedTodo, subTasks: result };

      setSelectedTodo(newSelectedTodo);
      e.target.value = "";
    }
  };

  // ? Drag Drop Container

  const getListStyle = (isDraggingOver) => ({
    width: "100%",
    margin: "0 16px",
    border: "1px solid #CCC",
    padding: "16px",
    paddingRight: "4px",
    borderRadius: "8px",
    backgroundColor: "#fafbfc",
    display: "flex",
    flexDirection: "column",
  });

  const getItemStyle = (isDragging, draggableStyle) => {
    return {
      with: "25%",
      border: "1px solid #ccc",
      padding: "8px",
      margin: "8px 0",
      borderRadius: "8px",
      backgroundColor: "#FFF",
      ...draggableStyle,
    };
  };

  const onSubTaskChange = async (e, subtask, todoId) => {
    const title = e.target.value;
    const { id } = subtask;
  };

  const onOpenSelectedTag = async () => {
    const response = await getTagListAdapter();

    setSelectedTag(response?.data?.data);
    setOpenTag(true);
  };

  const onCloseSelectedTag = () => {
    setSelectedTag(undefined);
    setOpenTag(false);
  };

  const onSubTaskIsCompletedChange = async (subtask, e) => {
    await updateSubTaskStatusAdapter(subtask.id);
  };

  const onCreateTodo = async ({
    title,
    description,
    sectionName,
    position,
  }) => {
    const token = getTokenFromLocalStorage();
    const url =
      "https://localhost:44334/api/v1/workspace-page/add-todo-workspace";

    const response = await axios({
      url: url,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        sectionName: sectionName,
        title: title,
        workspaceId: id,
        position,
      },
    });
    setState((prevState) => {
      const updatedArray = [...prevState];

      updatedArray[position] = [...updatedArray[position], response.data.data];
      return updatedArray;
    });
  };

  async function onDragEnd(result) {
    const { source, destination, draggableId } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    const isNotRequest =
      source.index === destination.index &&
      source.droppableId === destination.droppableId;

    if (!isNotRequest) {
      axios({
        method: "put",
        url: "https://localhost:44334/api/v1/workspace-page/drag-drop-todo-workspace",
        data: {
          todoId: draggableId,
          priority: destination.index,
          droppableId: destination.droppableId,
        },
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      });
    }

    if (sInd === dInd) {
      // TODO: send request to be to update priority of todo from source.index to destination.index
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      // TODO: send request to be to update column and priority of todo
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    // const sourceClone = Array.from(source);
    // const destClone = Array.from(destination);
    // const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  useEffect(() => {
    getUserList();
    getTodoInWorkspace();
  }, [id]);

  return (
    <Box className={classes.container}>
      <Typography variant="h5">
        Manage todo by <b>{groupName}</b>
      </Typography>
      <Box className={classes.navagateContainer}>
        <Box className={classes.calendar}>
          {/* <CalendarMonthIcon/> */}
          <Typography className={classes.calendarContent}>
            <CalendarMonthIcon sx={{ marginRight: "5px" }}>
              add_circle
            </CalendarMonthIcon>
            Content Calendar
          </Typography>
        </Box>
        <Divider
          orientation="vertical"
          flexItem
          style={{ height: "50px", width: "2px" }}
        />
        <Box className={classes.userList}>
          {users.map((user) => {
            return (
              <Box>
                <Tooltip title={user.userName} placement="bottom">
                  <Avatar alt="Remy Sharp" src={user.img} />
                </Tooltip>
              </Box>
            );
          })}
          <PersonAddIcon
            className={classes.addUserIcon}
            onClick={() => setOpenSearchUser(true)}
          />
        </Box>
      </Box>

      <Box className={classes.workspaceContainer}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state?.map((el, ind) => (
            <WorkspaceContainerItem
              ind={ind}
              el={el}
              handleClickOpen={handleClickOpen}
              getItemStyle={getItemStyle}
              getListStyle={getListStyle}
              onCreateTodo={onCreateTodo}
            />
          ))}
        </DragDropContext>
      </Box>

      {/* Search User Dialog */}
      <Dialog
        open={openSearchUser}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseSearchDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent style={{ height: "100px", width: "600px" }}>
          <Autocomplete
            options={suggestionUser}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search input"
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
                onChange={(e) => searchUsers(e.target.value)}
                onKeyDown={(e) => handleAddUserToWorkspace(e)}
              />
            )}
          ></Autocomplete>
        </DialogContent>
      </Dialog>

      {selectedTodo && (
        <Dialog
          onClose={handleClose}
          open={openTodoDialog}
          fullWidth={true}
          maxWidth="md"
          className={classes.dialogTodo}
        >
          <TodoDetail
            selectedTodo={selectedTodo}
            handleClose={handleClose}
            setSelectedTodo={setSelectedTodo}
            handleArchivedTodo={handleArchivedTodo}
            onTodoTitleChange={onTodoTitleChange}
            onTodoDescriptionChange={onTodoDescriptionChange}
            handleCreateSubtask={handleCreateSubtask}
            onDeleteSubTask={onDeleteSubTask}
            onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
            onSubTaskChange={onSubTaskChange}
            onOpenSelectedTag={onOpenSelectedTag}
            openTag={openTag}
            onCloseSelectedTag={onCloseSelectedTag}
            selectedTag={selectedTag}
            selectedTagDetail={selectedTagDetail}
            onTagItemClick={onTagItemClick}
            onOpenRemindMe={onOpenRemindMe}
            openRemindMe={openRemindMe}
            onCloseRemindMe={onCloseRemindMe}
            onUpdateRemindAtHandler={onUpdateRemindAtHandler}
          />
        </Dialog>
      )}
    </Box>
  );
}

export default WorkspacePage;
