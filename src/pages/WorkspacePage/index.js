import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useParams } from "react-router";
import { makeStyles } from "@mui/styles/";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
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

import axios from "axios";
import "./style.css";
import WorkspaceContainerItem from "../../components/core/WorkspaceContainerItem";
import { DragDropContext } from "react-beautiful-dnd";

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

  const handleCloseSearchDialog = () => {
    setOpenSearchUser(false);
  };

  const searchUsers = async (keyword) => {
    const url = `https://localhost:44334/api/v1/user/search-user?keyword=${keyword}`;
    const token = getTokenFromLocalStorage();

    const users = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userData = users.data.data;
    const mapptedSuggestionUser = userData.map((user) => ({
      label: user.email,
      value: user.id,
    }));

    setSuggestionUser(mapptedSuggestionUser);
  };

  const getUserList = async () => {
    const url = `https://localhost:44334/api/v1/workspace-page/${id}/user-in-workspace`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setGroupName(response.data.data.name);
    setUsers(response.data.data.users);
  };

  const handleAddUserToWorkspace = async (e) => {
    if (e.key === "Enter") {
      const email = e.target.value;
      const url = `https://localhost:44334/api/v1/workspace-page/add-user-workspace`;
      const token = getTokenFromLocalStorage();

      const response = await axios({
        url: url,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          email: email,
          workspaceId: id,
        },
      });

      console.log("handleAddUserToWorkspace", response);

      setOpenSearchUser(false);
    }
  };

  const getTodoInWorkspace = async () => {
    const token = getTokenFromLocalStorage();
    const url = `https://localhost:44334/api/v1/workspace-page/${id}/todos`;

    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const newState = [
      response.data.data.todoList || [],
      response.data.data.inProgressList || [],
      response.data.data.inReviewList || [],
      response.data.data.completedList || [],
    ];

    console.log({ newState });

    setState(newState);
  };

  useEffect(() => {
    getUserList();
    getTodoInWorkspace();
  }, [id]);

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
      },
    });
    setState((prevState) => {
      const updatedArray = [...prevState];

      updatedArray[position] = [...updatedArray[position], response.data.data];
      return updatedArray;
    });
  };

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
        <DragDropContext>
          {state?.map((el, ind) => (
            <WorkspaceContainerItem
              ind={ind}
              el={el}
              // handleClickOpen={handleClickOpen}
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
    </Box>
  );
}

export default WorkspacePage;
