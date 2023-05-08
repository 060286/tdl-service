import React from "react";

import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";

import { makeStyles } from "@mui/styles/";
import { Radio } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  dialogContainer: {
    minWidth: "400px",
    minHeight: "300px",
  },
  taskItemContainer: {
    minWidth: "400px",
    height: "auto",
    display: "flex",

    "& ul": {
      listStyle: "none",
      color: "black",
    },
  },
});

function SearchResultDialog({
  openSearchResult,
  handleCloseSearchResultDialog,
  tasks,
  subTasks,
  onSearchResultClick,
}) {
  const classes = useStyles();

  return (
    <Dialog
      open={openSearchResult}
      TransitionComponent={Transition}
      // keepMounted
      onClose={handleCloseSearchResultDialog}
      aria-describedby="alert-dialog-slide-description"
      className={classes.dialogContainer}
    >
      <DialogTitle>Search Results</DialogTitle>
      <hr></hr>
      <DialogContent>
        Tasks
        {tasks.map((task) => {
          return (
            <DialogContentText id="alert-dialog-slide-description">
              <Button variant="text" onClick={() => onSearchResultClick(task)}>
                <div className={classes.taskItemContainer}>
                  <Radio disabled={true} />
                  <ul>
                    <li>
                      <Typography
                        variant="button"
                        component="span"
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        {task.title}
                      </Typography>
                    </li>
                    <li style={{ fontSize: "12px", fontWeight: "400" }}>
                      <LockIcon style={{ width: "12px" }} />
                      {" My Lists > "} {task.categoryName}
                    </li>
                  </ul>
                </div>
              </Button>
            </DialogContentText>
          );
        })}
        {/* SubTasks */}
        Sub Tasks
        {subTasks.map((subTask) => {
          return (
            <DialogContentText id="alert-dialog-slide-description">
              <Button
                variant="text"
                onClick={() => onSearchResultClick(subTask)}
              >
                <div className={classes.taskItemContainer}>
                  <Radio disabled={true} />
                  <ul>
                    <li>
                      <Typography
                        variant="button"
                        component="span"
                        style={{ fontWeight: "bold", fontSize: "16px" }}
                      >
                        {subTask.subTaskTitle}
                      </Typography>
                    </li>
                    <li style={{ fontSize: "12px", fontWeight: "400" }}>
                      <LockIcon style={{ width: "12px" }} />
                      {" My Lists > "} {subTask.categoryName}
                    </li>
                  </ul>
                </div>
              </Button>
            </DialogContentText>
          );
        })}
      </DialogContent>
      <hr />
    </Dialog>
  );
}

export default SearchResultDialog;
