import {
  Avatar,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Button,
  ListItemIcon,
  ListItemText,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Icon,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Badge,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import UpcomingIcon from "@mui/icons-material/Upcoming";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles/";
import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import { getUserInfo } from "../../slices/accountSlice";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";

import axios from "axios";
import { ExpandMoreSharp } from "@mui/icons-material";
import ClassIcon from "@mui/icons-material/Class";
import ArchivedTaskReport from "../core/ArchivedTaskReport";
import AddWorkSpaceDialog from "../core/AddWorkSpaceDialog";
import {
  CREATE_WORKSPACE_URL,
  PATH_API,
} from "../../constants/pathApiConstant";

import NotificationsIcon from "@mui/icons-material/Notifications";
// import MessageComponent from "../MessageComponent";
import NotificationDialog from "../core/NotificationDialog";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { HubConnectionBuilder } from "@microsoft/signalr";

const items = [
  {
    text: "My Day",
    Icon: HomeIcon,
    href: "/myday",
    number: 0,
  },
  {
    text: "Next 7 Day",
    Icon: UpcomingIcon,
    href: "/nextsevenday",
    number: 0,
  },
  {
    text: "All My Task",
    Icon: ListAltIcon,
    href: "/tasks",
    number: 0,
  },
];
const useStyle = makeStyles(() => {
  return {
    sideBar: {
      width: "240px",
    },
    list: {
      padding: "16px 0",
    },
    listItemAvatar: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "16px",
      marginBottom: "8px",
      justifyContent: "space-between",
    },
    displayName: {
      marginLeft: "16px",
    },
    iconButton: {
      margin: "8px",
    },
    icon: {
      fontSize: "32px",
    },
    temp: {
      display: "flex",
      alignItems: "center",
    },
    logoutButton: {
      display: "flex",
      justifyContent: "flex-end",
    },
    numberAnalytic: {
      backgroundColor: "#D3D3D3",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "black",
      fontSize: "24px",
      fontWeight: "bold",
    },
  };
});

const loginHref = "/login";

export default function Sidebar() {
  const classes = useStyle();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const userInfo = useSelector((state) => state.accountReducer.userInfo);
  const img =
    userInfo !== null
      ? userInfo.img
      : // ? userInfo.img
        "https://www.w3schools.com/howto/img_avatar.png";
  const [categories, setCategories] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [openCreateCategoryPopup, setOpenCreateCategoryPopup] = useState(false);
  const [categoryTitle, setCategoryTitle] = useState("");
  const [openArchivedTaskReport, setOpenArchivedTaskReport] = useState(false);
  const [openWorkspaceDialog, setOpenWorkspaceDialog] = useState(false);
  const [workspaceTitle, setWorkspaceTitle] = useState("");
  const [workspaceDesc, setWorkspaceDesc] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationNumber, setNotificationNumber] = useState(0);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [openAddUserSnackBar, setOpenAddUserSnackBar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userInfo.userName) {
      const connection = new HubConnectionBuilder()
        .withUrl(
          `https://localhost:44334/hubs/notifications?userName=${userInfo.userName}`
        ) // Replace with your API URL
        .withAutomaticReconnect()
        .build();

      connection.start().catch((error) => console.error(error));

      connection.on("SendNotification", (message) => {
        console.log({ message });

        if (message.type === "AddUserWorkspace") {
          setMessage(message.content);
          setOpenAddUserSnackBar(true);

          getWorkspaces();
        }
      });

      connection.on("Notify", (message) => {
        console.log({ message, method: "Notify" });
      });

      connection.onreconnected(() => {
        console.log("Reconnected to SignalR hub.");

        // setConnectionId(connection.connectionId);
      });

      connection.onclose(() => {
        console.log("SignalR connection closed.");
      });

      return () => {
        connection.stop();
      };
    }
  }, [userInfo]);

  const handleCloseSnackBar = () => {
    setOpenAddUserSnackBar(false);
  };

  const onOpenNotificationDialog = () => {
    setOpenNotificationDialog(true);
  };

  const onCloseNotificationDialog = () => {
    setOpenNotificationDialog(false);
  };

  const handleOpenClick = () => {
    setOpenCreateCategoryPopup(true);
  };

  const handleOpenWorkspaceClick = () => {
    setOpenWorkspaceDialog(true);
  };

  const handleWorkspaceTitleChange = (title) => {
    setWorkspaceTitle(title);
  };

  const handleWorkspaceDescChange = (desc) => {
    setWorkspaceDesc(desc);
  };

  const handleCreateWorkspace = async (e) => {
    // TODO Create Workspace
    const url = `${PATH_API}${CREATE_WORKSPACE_URL}`;
    const token = getTokenFromLocalStorage();

    const response = await axios({
      method: "POST",
      url: url,
      data: {
        name: workspaceTitle,
        description: workspaceDesc,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Update Workspaces
    const newWorkspaces = [...workspaces, response.data.data];

    setWorkspaces(newWorkspaces);

    handleCloseWorkspaceDialog();
  };

  const handleCloseWorkspaceDialog = () => {
    setOpenWorkspaceDialog(false);
  };

  const onOpenArchivedTaskReportDialog = () => {
    setOpenArchivedTaskReport(true);
  };

  const onCloseArchivedTaskReportDialog = () => {
    setOpenArchivedTaskReport(false);
  };

  const handleCloseClick = () => {
    setOpenCreateCategoryPopup(false);
  };

  const dispatch = useDispatch();

  const onNavigate =
    ({ href }) =>
    () => {
      navigate(href);
    };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate(loginHref);
  };

  const onNavigateCategory = (id) => {
    navigate(`/category/${id}`);
  };

  const onNavigateWorkspace = (id) => {
    navigate(`/workspace/${id}`);
  };

  const getCategories = async () => {
    const url = "https://localhost:44334/api/v1/todos/todo-categories";
    const token = getTokenFromLocalStorage();

    axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res?.data?.data != null) {
          setCategories(res.data.data);
          setIsExpanded(true);
        }
      })
      .catch((err) => console.log(err));
  };

  const getNotifications = async () => {
    const token = getTokenFromLocalStorage();
    const url = "https://localhost:44334/api/v1/user/notifications";

    const response = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setNotifications(response?.data?.data);
    setNotificationNumber(response?.data.data.length);
  };

  const getWorkspaces = () => {
    const token = getTokenFromLocalStorage();
    const url = "https://localhost:44334/api/v1/workspace-page/workspaces";

    axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res?.data?.data != null) {
          setWorkspaces(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSaveCategoryTitle = async () => {
    // Close popup
    setOpenCreateCategoryPopup(false);

    const token = getTokenFromLocalStorage();
    const url = `https://localhost:44334/api/v1/all-list-page/create-todo-category`;

    const response = await axios({
      url: url,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        title: categoryTitle,
        description: `description of ${categoryTitle}`,
      },
    });

    if (response?.status === 200) {
      // Reload page
      getCategories();
    }
  };

  useEffect(() => {
    const url = "https://localhost:44334/api/v1/user/analytic-todo";
    const token = getTokenFromLocalStorage();

    const getDataAnalytic = async () => {
      const response = await axios({
        method: "get",
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      items[0].number = null;
      items[1].number = response.data.data.sevenDayAnalytic.percentage;
      items[2].number = response.data.data.oneMonthAnalytic.percentage;
    };

    getDataAnalytic();
  }, []);

  useEffect(() => {
    if (userInfo.status === VARIABLE_STATUS.IDLE) {
      const token = getTokenFromLocalStorage();

      // getCategory();
      dispatch(getUserInfo(token));
    }
  }, [userInfo.status]);

  useEffect(() => {
    getCategories();
    getWorkspaces();
    getNotifications();
  }, []);

  return (
    <Box className={classes.sideBar}>
      {/* <MessageComponent email={userInfo.email} /> */}
      <Box disablePadding className={classes.listItemAvatar}>
        <Box className={classes.temp}>
          <Avatar className={{ width: 42, height: 42 }} src={img} />
          <Typography className={classes.displayName}>
            {userInfo.fullName}
          </Typography>
          <Badge badgeContent={notificationNumber} color="primary">
            <NotificationsIcon
              onClick={() => onOpenNotificationDialog()}
              sx={{ marginLeft: "10px", cursor: "pointer" }}
            />
          </Badge>
        </Box>
        <IconButton
          color="default"
          size="large"
          onClick={() => {
            setIsOpen(true);
          }}
          className={classes.iconButton}
        >
          <SettingsIcon className={classes.icon} />
        </IconButton>
      </Box>
      <Box disablePadding className={classes.listItemAvatar}>
        <Button
          onClick={() => handleLogout()}
          variant="contained"
          color="error"
          size="small"
        >
          Logout
        </Button>
      </Box>
      <Box disablePadding className={classes.listItemAvatar}>
        <Button
          onClick={() => onOpenArchivedTaskReportDialog()}
          variant="contained"
          color="primary"
          size="small"
        >
          View Report
        </Button>
      </Box>
      <Drawer
        SlideProps={{ className: classes.sideBar }}
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen((preIsOpen) => !preIsOpen)}
      >
        <List className={classes.list}>
          <ListItem disablePadding className={classes.listItemAvatar}>
            <Box className={classes.temp}>
              <Avatar className={{ width: 42, height: 42 }} src={img} />
              <Typography className={classes.displayName}>
                {userInfo.fullName}
              </Typography>
            </Box>
            <IconButton
              onClick={() => {
                setIsOpen(false);
              }}
              className={classes.closeIcon}
            >
              <CloseIcon />
            </IconButton>
          </ListItem>
          <Divider />
          {items.map(({ text, Icon, href, number }) => {
            return (
              <ListItem
                key={text}
                disablePadding
                onClick={onNavigate({ href })}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={text} />
                  {text !== "My Day" && (
                    <ListItemText
                      className={classes.numberAnalytic}
                      primary={number}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Button outlined="true" onClick={handleOpenClick}>
          Create Category
        </Button>
        <Accordion expanded={isExpanded}>
          <AccordionSummary
            id="panel-categorie"
            aria-controls="panel-categories"
            expandIcon={
              <ExpandMoreSharp onClick={() => setIsExpanded(!isExpanded)} />
            }
          >
            <Typography>My Lists</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {categories?.map(({ id, title }) => {
              return (
                <List>
                  <ListItem
                    key={id}
                    disablePadding
                    onClick={() => onNavigateCategory(id)}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <ClassIcon />
                      </ListItemIcon>
                      <ListItemText primary={title}></ListItemText>
                    </ListItemButton>
                  </ListItem>
                </List>
              );
            })}
          </AccordionDetails>
        </Accordion>
        <Button outlined="true" onClick={handleOpenWorkspaceClick}>
          Create Workspace
        </Button>
        <>
          {workspaces.map((workspace) => {
            return (
              <ListItem
                key={workspace.name}
                disablePadding
                onClick={() => onNavigateWorkspace(workspace.id)}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={workspace.name} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </>
      </Drawer>

      {/* Create Category Title  */}
      <Dialog
        PaperProps={{ style: { width: "500px" } }}
        open={openCreateCategoryPopup}
        onClose={handleCloseClick}
      >
        <DialogTitle>Create Category Title</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Category Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => {
              setCategoryTitle(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClick}>Cancel</Button>
          <Button onClick={handleSaveCategoryTitle}>Save</Button>
        </DialogActions>
      </Dialog>

      <ArchivedTaskReport
        open={openArchivedTaskReport}
        onCloseArchivedTaskReportDialog={onCloseArchivedTaskReportDialog}
      />
      {openWorkspaceDialog && (
        <AddWorkSpaceDialog
          openWorkspaceDialog={openWorkspaceDialog}
          handleCloseWorkspaceDialog={handleCloseWorkspaceDialog}
          handleCreateWorkspace={handleCreateWorkspace}
          handleWorkspaceDescChange={handleWorkspaceDescChange}
          handleWorkspaceTitleChange={handleWorkspaceTitleChange}
        />
      )}

      <NotificationDialog
        openNotificationPopup={openNotificationDialog}
        onCloseNotificationDialog={onCloseNotificationDialog}
        notifications={notifications}
      />

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={openAddUserSnackBar}
        onClose={handleCloseSnackBar}
        key={"bottomright"}
        // autoHideDuration={3000}
      >
        <MuiAlert elevation={6} variant="filled" severity="success">
          {message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
