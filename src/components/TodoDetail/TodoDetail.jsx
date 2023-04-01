import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Radio,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles/";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";

import { removeTodoFromList } from "../../slices/todoSlice";

import LockIcon from "@mui/icons-material/Lock";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TagIcon from "@mui/icons-material/Tag";
import Tooltip from "@mui/material/Tooltip";
import clsx from "clsx";
import SubTaskDetail from "../SubTaskDetail/SubTaskDetail";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDatePicker } from "@mui/x-date-pickers";
import CategoryIcon from "@mui/icons-material/Category";
const useStyle = makeStyles(() => ({
  list: {
    overflowY: "scroll",
    maxHeight: "100%",
  },
  suggestionList: {
    overflowY: "scroll",
    maxHeight: "100%",
    width: "100%",
  },
  mydayPage: {
    height: "calc(100vh - 24px)",
    display: "flex",
    flexDirection: "column",
    marginRight: "8px",
    width: "75%",
  },
  suggestionListPage: {
    height: "calc(100vh - 24px)",
    overflowY: "scroll",
    display: "flex",
    flexGrow: 1,
    marginLeft: "8px",
    width: "25%",
  },
  input: {
    marginTop: "16px",
  },
  conatiner: {
    display: "flex",
    marginBottom: "24px",
  },
  suggestionItem: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    margin: "8px 0",
    "&:hover": {
      border: "1px solid #0b52d0",
    },
  },
  suggestionItemBox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "12px",
    color: "#aaa",
  },
  suggestionItemBoxTitle: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "20px",
    fontWeight: "bold",
  },
  todoItem: {
    border: "1px solid #CCC",
    margin: "8px 0",
    borderRadius: "8px",
    "&:hover": {
      border: "1px solid #0b52d0",
    },
  },
  LockIcon: {
    fontSize: "14px",
  },
  LockIconDialog: {
    fontSize: "18px",
    marginRight: "8px",
  },
  todoItemButton: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  suggestionItemBoxDialog: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "16px",
  },
  iconDialog: {
    margin: "0 4px",
  },
  suggestionItemBoxTodoIcon: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    fontSize: "12px",
    color: "#aaa",
    marginLeft: "10px",
  },
  dialogTodo: {
    "& .MuiDialog-paper": {
      padding: "16px 16px 48px 16px",
    },
  },
  titleContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  titleIconContainer: {
    fontSize: "14px",
  },
  dialogContainer: {
    margin: "12px 0",
  },
  marginRight: {
    marginRight: "8px",
  },
  dialogButton: {
    borderRadius: "8px",
  },
  todoDialogContainer: {
    display: "flex",
  },
  radioDialog: {
    marginRight: "8px",
  },
  helperText: {
    color: "red",
    fontSize: "14px",
  },
}));

export default function TodoDetail({
  selectedTodo,
  handleArchivedTodo,
  handleClose,
  setSelectedTodo,
  onSubTaskIsCompletedChange,
  onSubTaskChange,
  handleCreateSubtask,
  onTodoTitleChange,
  onTodoDescriptionChange,
  className,
  onDeleteSubTask,
  onOpenSelectedTag,
  onCloseSelectedTag,
  openTag,
  selectedTag,
  selectedTagDetail,
  onTagItemClick,
  onOpenRemindMe,
  openRemindMe,
  onUpdateRemindAtHandler,
  onCloseRemindMe,
}) {
  const [titleHelperText, setTitleHelperText] = useState("");
  const [selectedRemindAt, setSelectedRemindAt] = useState(null);

  console.log(selectedTodo);

  useEffect(() => {
    if (selectedTodo) {
      setSelectedRemindAt(selectedTodo.remindedAt);
    }
  }, []);

  const isValidTitle = (title) => {
    if (title.length > 200) {
      setTitleHelperText("Max character of title must be less than 200");
      return false;
    }
    setTitleHelperText("");
    return true;
  };

  console.log(selectedTodo.remindedAt);

  const classes = useStyle();
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className={className}>
        <Box className={classes.titleContainer}>
          <Box className={classes.suggestionItemBoxDialog}>
            <LockIcon className={classes.LockIconDialog} />
            {"My List > "}
            {selectedTodo?.categoryName}
          </Box>
          <Box>
            <Tooltip title="Move to trash" placement="top-start">
              <IconButton
                size="small"
                className={classes.iconDialog}
                onClick={() =>
                  // TODO: This action dont work
                  removeTodoFromList(selectedTodo.id)
                }
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Archived Todo" placement="top-start">
              <IconButton
                size="small"
                className={classes.iconDialog}
                onClick={() => handleArchivedTodo({ id: selectedTodo.id })}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Close Todo" placement="top-start">
              <IconButton
                size="small"
                className={classes.iconDialog}
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box className={classes.dialogContainer}>
          <Input
            minRows={1}
            multiline
            maxRows={5}
            autoFocus={true}
            fullWidth={true}
            placeholder={"content of todo"}
            value={selectedTodo.title}
            onChange={(e) => {
              const isValid = isValidTitle(e.target.value);
              if (isValid) {
                onTodoTitleChange({ todo: selectedTodo, e });
              }
            }}
            // onChange={(e) => onTodoTitleChange({ todo: selectedTodo, e })}
            onClick={(e) => {
              console.log("tạo task");
            }}
            error={titleHelperText}
          />
          <Typography className={classes.helperText}>
            {titleHelperText}
          </Typography>
        </Box>
        <Box className={classes.dialogContainer}>
          {/* Remind Button  */}
          <Tooltip title="Remind me at" placement="bottom">
            <Button
              className={clsx(classes.marginRight, classes.dialogButton)}
              size="small"
              variant="contained"
              startIcon={<AssignmentIcon />}
              onClick={() => {
                onOpenRemindMe();
              }}
            >
              {selectedRemindAt || "Remind Me"}
            </Button>
          </Tooltip>

          {/* Category  */}
          <Tooltip title="Categories" placement="bottom">
            <Button
              className={clsx(classes.marginRight, classes.dialogButton)}
              size="small"
              variant="contained"
              startIcon={<CategoryIcon />}
              onclick={() => {
                console.log("Chọn category");
              }}
            >
              {selectedTodo?.categoryName || "Default"}
            </Button>
          </Tooltip>

          <Tooltip title="Priority" placement="bottom">
            <Button
              size="small"
              variant="contained"
              className={classes.dialogButton}
              startIcon={<TagIcon />}
              onClick={() => onOpenSelectedTag()}
              sx={{
                bgcolor: selectedTagDetail?.backgroundColor,
                color: selectedTagDetail?.color,
                ":hover": {
                  bgcolor: selectedTagDetail?.backgroundColor, // theme.palette.primary.main
                  color: selectedTagDetail?.color,
                },
              }}
            >
              {selectedTagDetail?.text}
            </Button>
          </Tooltip>

          <Dialog open={openTag} onClose={onCloseSelectedTag}>
            <DialogTitle>Choose Tags</DialogTitle>
            <List sx={{ pt: 0 }}>
              {/* // ? Show Tags Here */}
              {selectedTag?.map((tag) => {
                return (
                  <ListItem
                    disableGutters
                    sx={{
                      bgcolor: tag.backgroundColor,
                      color: tag.color,
                    }}
                    onClick={() => onTagItemClick(tag, selectedTodo.id)}
                  >
                    <ListItemButton key={tag?.text}>
                      <ListItemText primary={tag?.text} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Dialog>
        </Box>
        <Box className={classes.dialogContainer}>
          <Typography variant="subtitle2">NOTES</Typography>
          <Input
            multiline
            minRows={1}
            maxRows={5}
            fullWidth={true}
            placeholder={"Notes"}
            value={selectedTodo.description || ""}
            onChange={(e) => {
              onTodoDescriptionChange({ todo: selectedTodo, e });
            }}
            // value={selectedTodo?.description}
            // onChange={(e) =>
            //   setSelectedTodo((preSelectedTodo) => ({
            //     ...preSelectedTodo,
            //     description: e.target.value,
            //   }))
            // }
          />
        </Box>
        <Box className={classes.dialogContainer}>
          <Typography variant="subtitle2">SUBTASKS</Typography>

          {selectedTodo?.subTasks?.map((todo) => {
            <Box className={classes.todoDialogContainer}>
              <Radio
                className={classes.radioDialog}
                checked={false}
                onChange={(e) => onSubTaskIsCompletedChange(todo, e)}
                value="b"
                name="radio-buttons"
              />
              <Input
                multiline
                minRows={1}
                maxRows={5}
                fullWidth={true}
                placeholder={"Content of todo"}
                onChange={(e) => {
                  onSubTaskChange(todo, e);
                }}
              />
            </Box>;
          })}
          <Box className={classes.todoDialogContainer}>
            <Radio
              className={classes.radioDialog}
              checked={false}
              name="radio-buttons"
              disabled={true}
            />
            <Input
              multiline
              minRows={1}
              maxRows={5}
              fullWidth={true}
              placeholder={"Content of todo"}
              onKeyDown={(e) => handleCreateSubtask(e, selectedTodo.id)}
            />
          </Box>

          {selectedTodo?.subTasks?.map((subtask) => {
            return (
              <SubTaskDetail
                key={subtask.id}
                onDeleteSubTask={onDeleteSubTask}
                selectedSubTask={subtask}
                onSubTaskChange={onSubTaskChange}
                onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
                todoId={selectedTodo.id}
              ></SubTaskDetail>
            );
          })}
        </Box>

        {/* // ! Remind Me Dialog */}
        <Dialog open={openRemindMe} onClose={onOpenRemindMe}>
          <DialogTitle>Remind Me At</DialogTitle>
          <Box
            sx={{
              width: "400px",
              height: "500px",
            }}
          >
            <StaticDatePicker
              onClose={() => setSelectedRemindAt(null)}
              onChange={(remindAt) => {
                setSelectedRemindAt(JSON.stringify(remindAt));
              }}
              onAccept={(remindAt) => {
                //Todo : close Popup
                onCloseRemindMe();

                //Todo : set remind at

                setSelectedRemindAt(JSON.stringify(remindAt));

                // Todo : call api to update
                const data = {
                  todoId: selectedTodo.id,
                  remindAt: remindAt,
                };
                onUpdateRemindAtHandler(data);
              }}
            />
          </Box>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}
