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
import { useNavigate, useParams, useLocation } from "react-router-dom";
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
import AddTaskIcon from '@mui/icons-material/AddTask';
// import MessageComponent from "../MessageComponent";
import NotificationDialog from "../core/NotificationDialog";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { HubConnectionBuilder } from "@microsoft/signalr";
import {
  createCategoryByTitleAdapter,
  createWorkspaceAdapter,
  getCategoryAdapter,
  getNotificationsAdapter,
  getWorkspacesAdapter,
  updateNotifyByIdAdapter,
} from "../../adapters/workspaceAdapter";

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
      width: "255px",
      height: '100%',
      borderRight: '1px solid grey',
      backgroundColor: "lightgrey"
    },
    sideBarDrawer: {
      width: "260px",
      height: '100%',
      display: 'flex',
    },
    list: {
      padding: "16px 0",
    },
    listItemAvatar: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "16px",
      marginBottom: "8px",
      justifyContent: "space-between"
    },
    displayName: {
      marginLeft: "16px",
      fontWeight: '600'
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
      backgroundColor: "#0083ff",
      borderRadius: "50%",
      width: "10px",
      height: "35px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: '#FFFFFF',
      margin: '5px',
    },
    wrapItemInfo: {
      display: 'flex',
      flexDirection: 'column',
    }
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
  const [currentUrl, setCurrentUrl] = useState(window.location.href);
  const location = useLocation();

  const getWorkspaceId = (url) => {
    const parts = url.split("/"); // Split the URL string by '/'
    const guid = parts[parts?.length - 1]; // Get the last part of the URL which should be the GUID ID
    return guid;
  };

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

  const onViewNotify = async (notifyId) => {
    const response = await updateNotifyByIdAdapter(notifyId);

    if (response.data.statusCode === 200) {
      await getNotifications();
    }
  };

  const handleCreateWorkspace = async (e) => {
    const response = await createWorkspaceAdapter(
      workspaceTitle,
      workspaceDesc
    );

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
    const response = await getCategoryAdapter();

    setCategories(response.data.data);
    setIsExpanded(true);
  };

  const getNotifications = async () => {
    const response = await getNotificationsAdapter();

    setNotifications(response?.data?.data.notifications);
    setNotificationNumber(response?.data.data.notViewedCount);
  };

  const getWorkspaces = async () => {
    const reponse = await getWorkspacesAdapter();

    setWorkspaces(reponse.data.data);
  };

  const handleSaveCategoryTitle = async () => {
    setOpenCreateCategoryPopup(false);
    const response = createCategoryByTitleAdapter(categoryTitle);

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

    const currentUrl = window.location.pathname;

    if (currentUrl === "/") {
      navigate("/myday");
    }
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

  useEffect(() => {
    if (userInfo.userName) {
      let connectionUrl = `https://localhost:44334/hubs/notifications?userName=${userInfo.userName}`;
      let workspaceId;

      if (currentUrl.includes("workspace")) {
        const newWorkspaceId = getWorkspaceId(currentUrl);
        workspaceId = newWorkspaceId;
      }

      if (workspaceId) {
        const newUrl = `${connectionUrl}&workspaceId=${workspaceId}`;
        connectionUrl = newUrl;
      }

      const connection = new HubConnectionBuilder()
        .withUrl(connectionUrl) // Replace with your API URL
        .withAutomaticReconnect()
        .build();

      connection.start().catch((error) => console.error(error));

      connection.on("SendNotification", (message) => {
        if (message.type === "AddUserWorkspace") {
          setMessage(message.content);
          setOpenAddUserSnackBar(true);
          getWorkspaces();
        }
      });

      // SendNotificationWorkspace
      connection.on("SendNotificationWorkspace", (message) => {
        if (message.type === "AssignNotify") {
          setMessage(message.content);
          getNotifications();
        }
      });

      connection.on("Notify", (message) => { });

      connection.onreconnected(() => {
        console.log("Reconnected to SignalR hub.");
      });

      connection.onclose(() => {
        console.log("SignalR connection closed.");
      });

      return () => {
        connection.stop();
      };
    }
  }, [userInfo, location.pathname]);

  return (
    <Box className={classes.sideBar}>
      {/* <MessageComponent email={userInfo.email} /> */}
      <Box className={classes.wrapItemInfo}>
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
            onClick={() => onOpenArchivedTaskReportDialog()}
            variant="contained"
            color="primary"
            size="small"
          >
            View Report
          </Button>
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
      </Box>

      <Drawer
        SlideProps={{ className: classes.sideBarDrawer }}
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
              sx={{color: '#cc0018', border: '1px solid #cc0018', borderRadius: '50%', padding: '1px', marginRight:'15px'}}
            >
              <CloseIcon />
            </IconButton>
          </ListItem>
          <Divider />
          {items?.map(({ text, Icon, href, number }) => {
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
                  <ListItemText primary={text} sx={{}}/>
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
        <Button variant="outlined" sx={{width:'80%', ml: '20px'}} onClick={handleOpenClick}>
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
            <Typography sx={{fontWeight: 600}}>My Lists</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0, border: 'none'}}>
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
        <Button variant="outlined" sx={{width:'80%', m: '10px 0 0 20px'}} onClick={handleOpenWorkspaceClick}>
          Create Workspace
        </Button>
        <>
          {workspaces?.map((workspace) => {
            return (
              <ListItem
                key={workspace.name}
                disablePadding
                onClick={() => onNavigateWorkspace(workspace.id)}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <AddTaskIcon />
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
        onViewNotify={onViewNotify}
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
