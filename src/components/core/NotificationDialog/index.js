import React from "react";

import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { blue } from "@mui/material/colors";

import { makeStyles } from "@mui/styles/";

const useStyles = makeStyles({
  dialog: {
    position: "absolute",
    left: 131,
    top: 16,
    width: "350px",
    heigth: "500px",
  },
  dialogTitle: {
    width: "100%",
    height: "50px",
  },
  itemBlock: {
    width: "100%",
    height: "75px",
  },
  itemText: {
    fontSize: "13px",
  },
  notViewedBtn: {
    background: "#e6e7e8",
  },
});

function NotificationDialog({
  onCloseNotificationDialog,
  openNotificationPopup,
  notifications,
  onViewNotify,
}) {
  const classes = useStyles();

  const handleClose = () => {
    onCloseNotificationDialog();
  };

  const handleViewedNotify = (id) => {
    onViewNotify(id);
  };

  const renderNotFoundNotifications = () => {
    if (notifications?.length === 0) {
      return (
        <h5 style={{ margin: "auto", overflow: "hidden" }}>No notifications</h5>
      );
    }
  };

  return (
    <Dialog
      classes={{
        paper: classes.dialog,
      }}
      onClose={handleClose}
      open={openNotificationPopup}
    >
      <DialogTitle className={classes.dialogTitle}>Notifications</DialogTitle>
      <List sx={{ pt: 0 }}>
        {notifications?.map((notification) => (
          <ListItem disableGutters className={classes.itemBlock}>
            <ListItemButton
              key={notification.id}
              className={!notification.isRead ? classes.notViewedBtn : ""}
              onClick={() => handleViewedNotify(notification.id)}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: blue[100],
                    color: blue[600],
                    width: "25px",
                    height: "25px",
                  }}
                >
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              {/* <ListItemText
                className={classes.itemText}
                primary={notification.content}
              /> */}
              <Typography variant="body1" className={classes.itemText}>
                {notification?.content}
              </Typography>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {renderNotFoundNotifications()}
    </Dialog>
  );
}

export default NotificationDialog;
