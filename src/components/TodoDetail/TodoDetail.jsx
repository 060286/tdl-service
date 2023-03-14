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
} from "@mui/material";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles/";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import {
  getCurrentTodoList,
  selectAllTodos,
  removeTodoFromList,
  archiveTodo,
  getSuggestionTodo,
  selectAllSuggestionTodo,
  addNewTodo,
  createSubTodo,
  removeSuggestion,
  addSubTaskToDetailTodo,
  removeDetailTodo,
} from "../../slices/todoSlice";
import LockIcon from "@mui/icons-material/Lock";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TagIcon from "@mui/icons-material/Tag";
import clsx from "clsx";

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
export default function TodoDetail({
  selectedTodo,
  handleArchivedTodo,
  handleClose,
  setSelectedTodo,
  onSubTaskIsCompletedChange,
  onSubTaskChange,
  handleCreateSubtask,
  className,
}) {
  const classes = useStyle();

  return (
    <Box className={className}>
      <Box className={classes.titleContainer}>
        <Box className={classes.suggestionItemBoxDialog}>
          <LockIcon className={classes.LockIconDialog} />
          {"My List > "}
          {selectedTodo.todoCategory}
        </Box>
        <Box>
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

          <IconButton
            size="small"
            className={classes.iconDialog}
            onClick={() => handleArchivedTodo({ id: selectedTodo.id })}
          >
            <CheckCircleIcon />
          </IconButton>

          <IconButton
            size="small"
            className={classes.iconDialog}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>
      <Box className={classes.dialogContainer}>
        <Input
          autoFocus={true}
          fullWidth={true}
          placeholder={"content of todo"}
          value={selectedTodo.title}
          onChange={(e) =>
            setSelectedTodo((preSelectedTodo) => ({
              ...preSelectedTodo,
              title: e.target.value,
            }))
          }
          onClick={(e) => {
            console.log("tạo task");
          }}
        />
      </Box>
      <Box className={classes.dialogContainer}>
        <Button
          className={clsx(classes.marginRight, classes.dialogButton)}
          size="small"
          variant="contained"
          startIcon={<AssignmentIcon />}
        >
          {selectedTodo.todoCategory}
        </Button>
        <Button
          size="small"
          variant="contained"
          className={classes.dialogButton}
          startIcon={<TagIcon />}
        >
          Tags
        </Button>
      </Box>
      <Box className={classes.dialogContainer}>
        <Typography variant="subtitle2">NOTES</Typography>
        <Input
          fullWidth={true}
          placeholder={"Notes"}
          value={selectedTodo.description || ""}
          onChange={(e) =>
            setSelectedTodo((preSelectedTodo) => ({
              ...preSelectedTodo,
              description: e.target.value,
            }))
          }
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
            fullWidth={true}
            placeholder={"Content of todo"}
            onKeyDown={(e) => handleCreateSubtask(e, selectedTodo.id)}
          />
        </Box>
      </Box>
    </Box>
  );
}
