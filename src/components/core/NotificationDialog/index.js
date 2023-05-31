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
  },
});

function NotificationDialog({
  onCloseNotificationDialog,
  openNotificationPopup,
  notifications,
}) {
  const classes = useStyles();

  const handleClose = () => {
    onCloseNotificationDialog();
  };

  return (
    <Dialog
      classes={{
        paper: classes.dialog,
      }}
      onClose={handleClose}
      open={openNotificationPopup}
    >
      <DialogTitle>Set backup account</DialogTitle>
      <List sx={{ pt: 0 }}>
        {notifications.map((notification) => (
          <ListItem disableGutters>
            <ListItemButton
              //   onClick={() => handleListItemClick(email)}
              key={notification.id}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={notification.content} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export default NotificationDialog;
