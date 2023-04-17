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
  Tooltip,
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

const items = [
  {
    text: "My Day",
    Icon: HomeIcon,
    href: "/myday",
  },
  {
    text: "Next 7 Day",
    Icon: UpcomingIcon,
    href: "/nextsevenday",
  },
  {
    text: "All My Task",
    Icon: ListAltIcon,
    href: "/tasks",
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
  const [categories, setCategories] = useState(undefined);
  const [isExpanded, setIsExpanded] = useState(false);
  const dispatch = useDispatch();

  const onNavigate =
    ({ href }) =>
    () => {
      navigate(href);
    };

  const handleLogout = () => {
    // Remove token
    localStorage.removeItem("token");

    navigate(loginHref);
  };

  const onNavigateCategory = (id) => {
    navigate(`/category/${id}`);
  };

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (userInfo.status === VARIABLE_STATUS.IDLE) {
      const token = getTokenFromLocalStorage();

      // getCategory();
      dispatch(getUserInfo(token));
    }
  }, [dispatch, userInfo.status]);

  return (
    <Box className={classes.sideBar}>
      <Box disablePadding className={classes.listItemAvatar}>
        <Box className={classes.temp}>
          <Avatar className={{ width: 42, height: 42 }} src={img} />
          <Typography className={classes.displayName}>
            {userInfo.fullName}
          </Typography>
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
          {items.map(({ text, Icon, href }) => {
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
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Accordion expanded={isExpanded}>
          <AccordionSummary
            id="panel-categorie"
            aria-controls="panel-categories"
            expandIcon={<ExpandMoreSharp />}
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
      </Drawer>
    </Box>
  );
}
