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
import MyDayWelcomeName from "../../components/core/MyDayWelcomeName";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { getUserInfo } from "../../slices/accountSlice";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
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
import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import MyDayCalendar from "../../components/core/MyDayCalendar";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TagIcon from "@mui/icons-material/Tag";
import clsx from "clsx";
import TodoDialog from "../../components/TodoDetail/TodoDetail";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
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
export default function MyDayPage2() {
  const classes = useStyle();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.accountReducer.userInfo);
  const todoStatus = useSelector(
    (state) => state.todoReducer.getCurrentTodo.status
  );
  const suggestionTodos = useSelector(selectAllSuggestionTodo);
  const suggestionStatus = useSelector(
    (state) => state.todoReducer.getSuggestionTodo.status
  );
  let todos = useSelector(selectAllTodos);
  const [quotes, setQuotes] = useState("");
  const [author, setAuthor] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState("");
  const [dayOfMonth, setDateOfMonth] = useState(0);
  const [subtaskText, setSubtaskText] = useState("");
  const [monthOfYear, setMonthOfYear] = useState(0);
  const [taskTitle, setTaskTitle] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(undefined);

  const cansave =
    addRequestStatus === VARIABLE_STATUS.IDLE &&
    taskTitle.length > 0 &&
    taskTitle !== "Add Task";
  const onKeyPressHandler = async (e) => {
    const enterKey = "Enter";

    if (e.key === enterKey) {
      try {
        if (!cansave) {
          alert("Please fill the task!");
          return;
        }

        setAddRequestStatus(VARIABLE_STATUS.LOADING);
        await dispatch(addNewTodo({ title: taskTitle })).unwrap();

        setTaskTitle("");
      } catch (err) {
        console.log("Failed to save the post", err);
      } finally {
        setAddRequestStatus(VARIABLE_STATUS.IDLE);
      }
    }
  };

  const handleSuggestionItemClick = async (todoItem) => {
    try {
      const { id, title } = todoItem;

      dispatch(removeSuggestion(id));

      await dispatch(addNewTodo({ title: title })).unwrap();
    } catch (error) {}
  };

  const handleQuotes = () => {
    axios
      .get("https://type.fit/api/quotes")
      .then(function (response) {
        const result = response.data[Math.floor(Math.random() * 100)];
        setQuotes(result.text);
        setAuthor(result.author);
      })
      .catch(function (error) {
        console.error(error);
      });

    const date = new Date();
    const dateNumber = date.getDay();
    const monthNumber = date.getMonth();

    setDayOfWeek(dateFormatted(dateNumber));
    setDateOfMonth(date.getDate());
    setMonthOfYear(monthFormatted(monthNumber));
  };
  useEffect(() => {
    handleQuotes();

    if (todoStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getCurrentTodoList(todos));
    }

    if (userInfo.status === VARIABLE_STATUS.IDLE) {
      const token = getTokenFromLocalStorage();

      dispatch(getUserInfo(token));
    }

    if (suggestionStatus === VARIABLE_STATUS.IDLE) {
      dispatch(getSuggestionTodo());
    }
  }, [todoStatus, dispatch]);

  const monthFormatted = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber);

    return date.toLocaleString("en-US", {
      month: "long",
    });
  };

  const dateFormatted = (dateNumber) => {
    switch (dateNumber) {
      case 0:
        return "Sunday";

      case 1:
        return "Monday";

      case 2:
        return "Tuesday";

      case 3:
        return "Wednesday";

      case 4:
        return "Thursday";

      case 5:
        return "Friday";

      case 6:
        return "Saturday";

      default:
        return "Error";
    }
  };
  const handleClickOpen =
    ({ todo }) =>
    () => {
      setOpen(true);
      setSelectedTodo(todo);
    };

  const handleClose = () => {
    setOpen(false);
    setSelectedTodo(undefined);
  };
  const onRadioButtonChange = (e) => (preTodo) => {
    // TODO: send request to be to update isCompleted of this todo
    // ? Intergate với function này nhé updateSubTaskStatusSlice
    // ? Ông truyền cái id xuống là được.
  };
  const handleArchivedTodo = ({ id }) => {
    handleClose();

    // remove item from todo list
    dispatch(removeTodoFromList(id));
    dispatch(archiveTodo(id));
  };
  const handleCreateSubtask = async (e, id, tod) => {
    if (e.key === "Enter") {
      await dispatch(
        createSubTodo({ todoId: id, name: e.target.value })
      ).unwrap();

      setSubtaskText("");
      dispatch(
        addSubTaskToDetailTodo({
          todoId: id,
          name: e.target.value,
          isCompleted: false,
        })
      );
      e.target.value = "";
    }
  };
  const onSubTaskChange = (todo, e) => {
    // TODO: send request to BE to update subtask text
    // ? Tui nghĩ cái này mình sẽ send id + title của subtask
    // ?
  };
  const onSubTaskIsCompletedChange = (todo, e) => {
    // TODO: send request to BE to update isCompleted subtask
    // ? Tui nghĩ cái này bị duplicate với onRadioButtonChange á.
  };
  const onSubTaskDelete = (todo) => {
    // TODO: send request to be to delete subtask
  };

  console.log({ selectedTodo });
  return (
    <Box className={classes.conatiner}>
      <Box className={classes.mydayPage} spacing={2}>
        <MyDayWelcomeName
          username={userInfo.fullName}
          qoutes={quotes}
          author={author}
        />
        <MyDayCalendar
          weekday={dayOfWeek}
          day={dayOfMonth}
          month={monthOfYear}
        />
        <List className={classes.list}>
          {todos?.todos.map((todo) => {
            return (
              <ListItem
                disablePadding
                className={classes.todoItem}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={handleClickOpen({ todo })}
                  >
                    <ArticleIcon />
                  </IconButton>
                }
              >
                <ListItemButton className={classes.todoItemButton}>
                  {todo.todoCategory && (
                    <Box className={classes.suggestionItemBoxTodoIcon}>
                      <LockIcon className={classes.LockIcon} />
                      {" > "}
                      {todo.todoCategory}
                    </Box>
                  )}
                  <Box className={classes.suggestionItemBoxTitle}>
                    <ListItemIcon>
                      <RadioGroup
                        value={todo.isCompleted}
                        name={todo.id}
                        onChange={onRadioButtonChange(todo)}
                      >
                        <Radio />
                      </RadioGroup>
                    </ListItemIcon>
                    <ListItemText id={todo.id} primary={todo.title} />
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Box className={classes.input}>
          <TextField
            label="Enter todo content"
            placeholder="Enter todo content"
            color="primary"
            fullWidth
            focused
            value={taskTitle}
            onKeyUp={(e) => onKeyPressHandler(e)}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </Box>
      </Box>
      <Box className={classes.suggestionListPage}>
        <List className={classes.suggestionList}>
          {suggestionTodos?.todos.map((todo) => {
            return (
              <ListItem disablePadding className={classes.suggestionItem}>
                <ListItemButton
                  onClick={() => {
                    handleSuggestionItemClick(todo);
                  }}
                  dense
                >
                  <ListItemIcon>
                    <IconButton>
                      <AddIcon />
                    </IconButton>
                  </ListItemIcon>
                  <Box>
                    <Box className={classes.suggestionItemBox}>
                      <LockIcon className={classes.LockIcon} />
                      {" > "}
                      {todo.categoryName}
                    </Box>
                    <Box className={classes.suggestionItemBoxTitle}>
                      {todo.title}
                    </Box>
                    <Box className={classes.suggestionItemBox}>
                      {todo.dateRemind}
                    </Box>
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      {selectedTodo && (
        <Dialog
          onClose={handleClose}
          open={open}
          fullWidth={true}
          maxWidth="md"
          className={classes.dialogTodo}
        >
          <TodoDetail
            selectedTodo={selectedTodo}
            handleArchivedTodo={handleArchivedTodo}
            handleClose={handleClose}
            setSelectedTodo={setSelectedTodo}
            onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
            onSubTaskChange={onSubTaskChange}
            handleCreateSubtask={handleCreateSubtask}
          />
        </Dialog>
      )}
    </Box>
  );
}