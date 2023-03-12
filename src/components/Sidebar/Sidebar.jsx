import { Avatar, Divider, Drawer, IconButton, List, ListItem, ListItemButton, Button, ListItemIcon, ListItemText, Typography } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useState } from "react";
import { makeStyles } from '@mui/styles/';
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
const items = [
  {
    text: "My Day",
    Icon: HomeIcon,
    href: "/myday"
  },
  {
    text: "Next 7 Day",
    Icon: UpcomingIcon,
    href: "/nextsevenday"
  },
  {
    text: "All My Task",
    Icon: ListAltIcon,
    href: "/tasks"
  }
]
const useStyle = makeStyles(() => {
  return {
    sideBar: {
      width: "240px"
    },
    list: {
      padding: "16px 0"
    },
    listItemAvatar: {
      display: "flex",
      alignItems: "center",
      paddingLeft: "16px",
      marginBottom: "8px",
      justifyContent: "space-between"
    },
    displayName: {
      marginLeft: "16px"
    },
    iconButton: {
      margin: "8px"
    },
    icon: {
      fontSize: "32px"
    },
    temp: {
      display: "flex",
      alignItems: "center",

    },
    logoutButton: {
      display: "flex",
      justifyContent: "flex-end"
    }
  }
})
export default function Sidebar() {
  const classes = useStyle();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false)
  const userInfo = useSelector((state) => state.accountReducer.userInfo);
  const img =
    userInfo !== null
      ? "https://www.w3schools.com/howto/img_avatar.png"
      : // ? userInfo.img
        "https://www.w3schools.com/howto/img_avatar.png";

  const onNavigate = ({ href }) => 
    () => {
      navigate(href)
    }
  
  return (
    <Box className={classes.sideBar}>
      <Box disablePadding className={classes.listItemAvatar}>
        <Box className={classes.temp}>
          <Avatar className={{ width: 42, height: 42 }} src={img} />
          <Typography className={classes.displayName}>{userInfo.fullName}</Typography>
        </Box>
        <IconButton color="default" size="large" onClick={() => { setIsOpen(true)}} className={classes.iconButton}>
          <SettingsIcon className={classes.icon } />
        </IconButton>
      </Box>
      <Box disablePadding className={classes.listItemAvatar}>
        <Button
          onClick={() => { }}
          variant="contained"
          color="error"
          size="small"
        >
          Logout
        </Button>
      </Box>
      <Drawer
        SlideProps={{className: classes.sideBar}}
        anchor="left"
        open={isOpen}
        onClose={() => setIsOpen(preIsOpen => !preIsOpen)}
      >
        <List className={classes.list}>
          <ListItem disablePadding className={classes.listItemAvatar}>
            <Box className={classes.temp}>
              <Avatar className={{ width: 42, height: 42 }} src={img} />
              <Typography className={classes.displayName}>{userInfo.fullName}</Typography>
            </Box>
            <IconButton onClick={() => { setIsOpen(false)}} className={classes.closeIcon}>
              <CloseIcon /> 
            </IconButton>
          </ListItem>
          <Divider />
          {items.map(({ text, Icon, href }) => {
            return (
            <ListItem key={text} disablePadding onClick={onNavigate({href})}>
              <ListItemButton>
                <ListItemIcon>
                  <Icon/>
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
            )
          })}
       
        </List>
      </Drawer>
      </Box>
  )
}