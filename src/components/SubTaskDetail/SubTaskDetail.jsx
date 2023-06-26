import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  IconButton,
  Input,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Checkbox,
  Box,
} from "@mui/material";

import CheckCircleOutlineSharpIcon from "@mui/icons-material/CheckCircleOutlineSharp";
import CheckCircleSharpIcon from "@mui/icons-material/CheckCircleSharp";
import HighlightOffSharpIcon from "@mui/icons-material/HighlightOffSharp";

import { makeStyles } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { updateSubTaskIsCompleted } from "../../slices/todoSlice";

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
}));

const SubTaskDetail = ({
  selectedSubTask,
  onSubTaskIsCompletedChange,
  onDeleteSubTask,
  onSubTaskChange,
  onChangeSubTaskTitle,
  todoId,
}) => {
  const classes = useStyle();
  const [title, setTitle] = useState(selectedSubTask?.name);
  const [isCompleted, setIsCompleted] = useState(selectedSubTask.isCompleted);
  const [subTask, setSubTask] = useState(selectedSubTask);

  return (
    <Box className={classes.todoDialogContainer}>
      <Checkbox
        className={classes.radioDialog}
        checked={isCompleted}
        icon={<CheckCircleOutlineSharpIcon />}
        checkedIcon={<CheckCircleSharpIcon />}
        onChange={(e) => {
          onSubTaskIsCompletedChange(subTask, e);
          setIsCompleted(!isCompleted);
        }}
        value={subTask?.isCompleted}
        name="radio-buttons"
      />
      <Input
        fullWidth={true}
        value={subTask.name}
        onChange={(e) => {
          onSubTaskChange(e, subTask, todoId, e.target.value);

          const newSubTask = { ...subTask };
          newSubTask.name = e.target.value;
          setSubTask(newSubTask);
        }}
        disabled={isCompleted}
      />
      <HighlightOffSharpIcon onClick={() => onDeleteSubTask(subTask)} />
    </Box>
  );
};

export default SubTaskDetail;
