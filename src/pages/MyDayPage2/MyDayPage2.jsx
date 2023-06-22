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
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/system";
import { makeStyles } from "@mui/styles/";
import MyDayWelcomeName from "../../components/core/MyDayWelcomeName";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import { getUserInfo } from "../../slices/accountSlice";
import AddIcon from "@mui/icons-material/Add";
import LockIcon from "@mui/icons-material/Lock";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import _ from "lodash";
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
  getTagListSlice,
  setDefaultTagList,
  updateTodoTagSlicde,
  updateSubTaskTitle,
  updateSubTaskIsCompleted,
  updateCompletedTodoSlice,
  updateTodoStatusSlicde,
  updateTodoTitleSlice,
  updateTodoDescriptionSlice,
  updateRemindAtSlice,
  updateTodoStatusSlice,
  updateTagSlice,
  setSelectedTodoId,
} from "../../slices/todoSlice";

import SearchResultDialog from "../../components/SearchResultDialog/SearchResultDialog";

import {
  updateSubTaskStatusSlice,
  removeSubTaskByIdSlice,
} from "../../slices/subtaskSlice";
import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import MyDayCalendar from "../../components/core/MyDayCalendar";
import ArticleIcon from "@mui/icons-material/Article";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TagIcon from "@mui/icons-material/Tag";
import clsx from "clsx";
import TodoDialog from "../../components/TodoDetail/TodoDetail";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { RadioButtonChecked } from "@mui/icons-material";
import { searchTodoByKeyword } from "../../adapters/myDayPageAdapter";
import { searchTodoByKeywordSlice } from "../../slices/todoSlice";
import { useNavigate } from "react-router";
import ChatComponent from "../../components/ChatComponent";

const useStyle = makeStyles(() => ({
  list: {
    overflowY: "scroll",
    maxHeight: "100%",
  },
  suggestionList: {
    overflowY: "scroll",
    maxHeight: "100%",
    width: "100%",
    padding: "15px",
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
    marginTop: "350px",
    boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)'
  },
  conatiner: {
    display: "flex",
    marginBottom: "24px",
    width: '100%',
    height: '80%'
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
  suggestionItemDay: {
    color: '#0d6efd',
    fontSize: "12px",
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
  todoTitle: {
    wordBreak: "break-all",
  },
  childContainer: {
    padding: '10px',
    display: "flex",
    marginBottom: "24px",
    width: '100%'
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
  const [taskTitleHelperText, setTaskTitleHelperText] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(undefined);
  const [selectedTag, setSelectedTag] = useState(undefined);
  const [openTag, setOpenTag] = useState(false);
  const [selectedTagDetail, setSelectedTagDetail] = useState(undefined);
  const [openRemindMe, setOpenRemindMe] = useState(false);
  const [openSearchResult, setOpenSearchResult] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [subTasks, setSubtasks] = useState([]);
  const navigate = useNavigate();

  const cansave =
    addRequestStatus === VARIABLE_STATUS.IDLE &&
    taskTitle.length > 0 &&
    taskTitle !== "Add Task";

  const onOpenRemindMe = () => {
    setOpenRemindMe(true);
  };

  const onCloseRemindMe = () => {
    setOpenRemindMe(false);
  };

  const onUpdateRemindAtHandler = async (data) => {
    dispatch(updateRemindAtSlice(data));
  };

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
    } catch (error) { }
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
        setSelectedTagDetail(todo.tag);
      };

  const handleClose = () => {
    setOpen(false);
    setSelectedTodo(undefined);
  };

  const onRadioButtonChange = (preTodo) => {
    // TODO: send request to be to update isCompleted of this todo
    dispatch(updateTodoStatusSlicde(preTodo));
  };

  const handleArchivedTodo = ({ id }) => {
    handleClose();
    dispatch(removeTodoFromList(id));
    dispatch(archiveTodo(id));
  };

  const handleCreateSubtask = async (e, id) => {
    if (e.key === "Enter") {
      const response = await dispatch(
        createSubTodo({ todoId: id, name: e.target.value })
      ).unwrap();
      setSubtaskText("");

      const newSubTask = {
        id: response.response.data.data.id,
        name: e.target.value,
        isCompleted: false,
      };

      const temp = [...selectedTodo.subTasks, newSubTask];

      const newSelectedTodo = { ...selectedTodo, subTasks: temp };

      setSelectedTodo(newSelectedTodo);

      e.target.value = "";
    }
  };

  const debouncedTitle = useRef(
    _.debounce(({ id, title }) => {
      dispatch(updateTodoTitleSlice({ id, title }));
    }, 500)
  ).current;

  const onTodoTitleChange = ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      title: e.target.value,
    }));

    debouncedTitle({ id: todo.id, title: e.target.value });
  };

  const debouncedDescription = useRef(
    _.debounce(async ({ id, description }) => {
      await dispatch(updateTodoDescriptionSlice({ id, description }));
    }, 500)
  ).current;

  const onTodoDescriptionChange = ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      description: e.target.value,
    }));
    debouncedDescription({ id: todo.id, description: e.target.value });
  };

  const onSubTaskChange = (e, subtask, todoId) => {
    // TODO: send request to BE to update subtask text
    const { id } = subtask;
    const title = e.target.value;

    dispatch(updateSubTaskTitle({ id, title, todoId }));
  };

  const onSubTaskIsCompletedChange = async (subtask, e) => {
    // TODO: send request to BE to update isCompleted subtask
    const { id, isCompleted } = subtask;
    const newTodo = { ...selectedTodo };
    newTodo.subTasks = newTodo.subTasks.map((ele) =>
      ele.id === id ? { ...ele, isCompleted: !isCompleted } : ele
    );
    setSelectedTodo(newTodo);

    // ? UPDATE API
    dispatch(updateSubTaskStatusSlice(id));
    dispatch(updateSubTaskIsCompleted({ id, todoId: selectedTodo.id }));
  };

  const onHandleChangeDescription = () => { };

  const onDeleteSubTask = async ({ id }) => {
    // TODO: send request to be to delete subtask
    const newTodo = { ...selectedTodo };
    newTodo.subTasks = newTodo?.subTasks.filter((ele) => ele.id !== id);

    console.log(newTodo);

    setSelectedTodo(newTodo);

    await dispatch(removeSubTaskByIdSlice(id));
  };

  const onOpenSelectedTag = async () => {
    const { payload } = await dispatch(getTagListSlice());

    setSelectedTag(payload?.data?.data);
    setOpenTag(true);
  };

  const onCloseSelectedTag = async () => {
    setOpenTag(false);
    setSelectedTag(undefined);
    dispatch(setDefaultTagList());
  };

  // ? Update Current Tag Detail
  const onTagItemClick = async (tag, todoId) => {
    setOpenTag(false);
    setSelectedTagDetail(tag);

    // ? Update On API
    const res = await dispatch(updateTodoTagSlicde({ tag, todoId }));
    const newSelectedTodo = { ...selectedTodo };
    newSelectedTodo.tag = res.payload?.data?.data;
    setSelectedTodo(newSelectedTodo);

    dispatch(updateTagSlice({ tag, todoId }));
  };

  const searchTodoAndSubTask = async (e) => {
    if (e.key === "Enter") {
      const res = await dispatch(searchTodoByKeywordSlice(e.target.value));
      setSubtasks(res.payload.subTasks);
      setTasks(res.payload.tasks);
      setOpenSearchResult(true);

      e.target.value = "";
    }
  };

  const handleCloseSearchResultDialog = () => {
    setOpenSearchResult(false);
  };

  const onSearchResultClick = (task) => {
    setOpenSearchResult(false);
    dispatch(setSelectedTodoId(task.id));

    navigate(`/category/${task.categoryId}&isSearch=true`);
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

  return (
    <Box className={classes.conatiner}>
      <div className={classes.childContainer}>
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
                    <Tooltip title="Open todo">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={handleClickOpen({ todo })}
                      >
                        <ArticleIcon />
                      </IconButton>
                    </Tooltip>
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
                        <Tooltip
                          title={
                            todo.isCompleted
                              ? "Uncompleted task"
                              : "Completed task"
                          }
                        >
                          <Checkbox
                            checked={todo.isCompleted}
                            name={todo.id}
                            onChange={() => onRadioButtonChange(todo)}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<RadioButtonChecked />}
                          ></Checkbox>
                        </Tooltip>
                      </ListItemIcon>
                      <ListItemText
                        id={todo.id}
                        primary={todo.title}
                        className={classes.todoTitle}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
          <Box className={classes.input}>
            <TextField
              multiline
              label="Enter todo content"
              placeholder="Enter todo content"
              color="primary"
              fullWidth
              value={taskTitle}
              onKeyUp={(e) => onKeyPressHandler(e)}
              onChange={(e) => {
                if (e.target.value.length > 200) {
                  setTaskTitleHelperText(
                    "Max character of title must be less than 200"
                  );
                  return;
                }
                setTaskTitleHelperText("");
                setTaskTitle(e.target.value);
              }}
              helperText={taskTitleHelperText}
              error={taskTitleHelperText}
            />
          </Box>
        </Box>
        <Box className={classes.suggestionListPage}>
          <List className={classes.suggestionList}>
            <TextField
              id="search-bar"
              className="text"
              // onInput={(e) => {
              //   setSearchQuery(e.target.value);
              // }}
              onKeyDown={(e) => searchTodoAndSubTask(e)}
              label="Search todo & subtask"
              variant="outlined"
              placeholder="Search..."
              size="small"
              style={{ width: "100%" }}
            />
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
                      <Tooltip title="Add todo">
                        <IconButton sx={{ color: '#0d6efd'}}>
                          <AddIcon />
                        </IconButton>
                      </Tooltip>
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
                      <Box className={classes.suggestionItemDay}>
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
              handleClose={handleClose}
              setSelectedTodo={setSelectedTodo}
              handleArchivedTodo={handleArchivedTodo}
              onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
              onSubTaskChange={onSubTaskChange}
              handleCreateSubtask={handleCreateSubtask}
              onTodoTitleChange={onTodoTitleChange}
              onTodoDescriptionChange={onTodoDescriptionChange}
              onDeleteSubTask={onDeleteSubTask}
              onOpenSelectedTag={onOpenSelectedTag}
              onCloseSelectedTag={onCloseSelectedTag}
              openTag={openTag}
              selectedTag={selectedTag}
              selectedTagDetail={selectedTagDetail}
              onTagItemClick={onTagItemClick}
              onOpenRemindMe={onOpenRemindMe}
              openRemindMe={openRemindMe}
              onUpdateRemindAtHandler={onUpdateRemindAtHandler}
              onCloseRemindMe={onCloseRemindMe}
            />
          </Dialog>
        )}
        {openSearchResult && (
          <SearchResultDialog
            handleCloseSearchResultDialog={handleCloseSearchResultDialog}
            tasks={tasks}
            subTasks={subTasks}
            openSearchResult={openSearchResult}
            onSearchResultClick={onSearchResultClick}
          />
        )}
      </div>

    </Box>
  );
}
