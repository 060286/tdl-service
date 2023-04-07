import React, { useEffect, useRef, useState } from "react";

import HeaderRouteItem from "../../components/core/HeaderRouteItem";
import NextSevenDayListItem from "./NextSevenDayItem";
import { addDays } from "date-fns";

import { Col, Row } from "react-bootstrap";
import { Box, Dialog } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import _ from "lodash";
import {
  getMyListNextSevenDay,
  updateTodoTitleSlice,
  updateTodoDescriptionSlice,
  addSubTaskByTodoId,
} from "../../slices/nextSevenDaySlice";

import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import axios from "axios";
import "./style.css";

import { makeStyles } from "@mui/styles/";
import TodoDetail from "../../components/TodoDetail/TodoDetail";
import { getTokenFromLocalStorage } from "../../extensions/tokenExtension";

import { archiveTodoSlice } from "../../slices/nextSevenDaySlice";
import { createSubTaskInTodo } from "../../adapters/taskAdapter";

import { getTagListSlice, setDefaultTagList } from "../../slices/todoSlice";

const useStyle = makeStyles(() => ({
  container: {
    display: "flex",
    marginTop: "48px",
    width: "175%",
    height: "calc(100% - 88px)",
  },
  hello: {
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    color: "#888",
    marginBottom: "8px",
  },
  LockIconDialog: {
    fontSize: "16px",
  },
  dialogTodo: {
    "& .MuiDialog-paper": {
      padding: "16px 16px 48px 16px",
    },
  },
  scroll: {
    height: "100%",
    overflow: "scroll",
  },
  mini: {
    marginRight: "16px",
  },
}));

const NextSevenDay = ({ now = new Date() }) => {
  const classes = useStyle();
  const [isMyList, setIsMyList] = useState(true);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(undefined);
  const nextSevenDayTask = useSelector(
    (state) => state.nextSevenDayReducer.getMyListNextSevenDay
  );
  const [selectedTagDetail, setSelectedTagDetail] = useState(undefined);
  const [openTag, setOpenTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState(undefined);

  // const [taskTitle, setTaskTitle] = useState("");
  // const [state, setState] = useState([
  const [state, setState] = useState([
    nextSevenDayTask?.data?.dayOne || [],
    nextSevenDayTask?.data?.dayTwo || [],
    nextSevenDayTask?.data?.dayThree || [],
    nextSevenDayTask?.data?.dayFour || [],
    nextSevenDayTask?.data?.dayFive || [],
    nextSevenDayTask?.data?.daySix || [],
    nextSevenDayTask?.data?.daySeven || [],
  ]);

  useEffect(() => {
    setState([
      nextSevenDayTask?.data?.dayOne || [],
      nextSevenDayTask?.data?.dayTwo || [],
      nextSevenDayTask?.data?.dayThree || [],
      nextSevenDayTask?.data?.dayFour || [],
      nextSevenDayTask?.data?.dayFive || [],
      nextSevenDayTask?.data?.daySix || [],
      nextSevenDayTask?.data?.daySeven || [],
    ]);
  }, [nextSevenDayTask]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onCloseSelectedTag = async () => {
    setOpenTag(false);
    setSelectedTag(undefined);
    dispatch(setDefaultTagList());
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    // const sourceClone = Array.from(source);
    // const destClone = Array.from(destination);
    // const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  // function onDragEnd(result) {
  //   const { source, destination } = result;

  async function onDragEnd(result) {
    const { source, destination, draggableId } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    const isNotRequest =
      source.index === destination.index &&
      source.droppableId === destination.droppableId;
    if (!isNotRequest) {
      axios({
        method: "put",
        url: "https://localhost:44334/api/v1/todos/drag-drop-todo",
        data: {
          dragId: draggableId,
          dropDate: addDays(new Date(), destination.droppableId),
          priority: destination.index,
          isSameColumn: destination.droppableId === source.droppableId,
        },
        headers: {
          Authorization: `Bearer ${getTokenFromLocalStorage()}`,
        },
      });
    }

    if (sInd === dInd) {
      // TODO: send request to be to update priority of todo from source.index to destination.index
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      // TODO: send request to be to update column and priority of todo
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  }

  const getListStyle = (isDraggingOver) => ({
    width: "100%",
    margin: "0 16px",
    border: "1px solid #CCC",
    padding: "16px",
    paddingRight: "4px",
    borderRadius: "8px",
    backgroundColor: "#fafbfc",
    display: "flex",
    flexDirection: "column",
  });

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

  const debouncedTitle = useRef(
    _.debounce(({ id, title }) => {
      dispatch(updateTodoTitleSlice({ id, title }));
    }, 500)
  ).current;

  const onTodoTitleChange = async ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      title: e.target.value,
    }));
    debouncedTitle({ id: todo.id, title: e.target.value });
  };

  const debouncedDescription = useRef(
    _.debounce(({ id, description }) => {
      dispatch(updateTodoDescriptionSlice({ id, description }));
    }, 500)
  ).current;

  const onTodoDescriptionChange = async ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo) => ({
      ...preSelectedTodo,
      description: e.target.value,
    }));
    debouncedDescription({ id: todo.id, description: e.target.value });
  };

  const getItemStyle = (isDragging, draggableStyle) => {
    return {
      with: "25%",
      border: "1px solid #ccc",
      padding: "8px",
      margin: "8px 0",
      borderRadius: "8px",
      backgroundColor: "#FFF",
      ...draggableStyle,
    };
  };

  const onCreateTodo = (todo, ind, e) => {
    const newState = state.map((item, index) => {
      if (index === ind) {
        return [...item, todo];
      }

      return item;
    });

    setState(newState);

    e.target.value = "";
  };

  const onOpenSelectedTag = async () => {
    const { payload } = await dispatch(getTagListSlice());

    setSelectedTag(payload?.data?.data);
    setOpenTag(true);
  };

  const handleArchivedTodo = (data) => {
    // Tắt Popup
    handleClose();

    // Call api & update state
    dispatch(archiveTodoSlice({ data }));
  };

  const handleCreateSubtask = async (e, todoId) => {
    if (e.key === "Enter") {
      const response = await createSubTaskInTodo({
        name: e.target.value,
        todoId,
      });

      const newSubtask = {
        id: response.data.data.id,
        name: response.data.data.title,
        isCompleted: false,
      };

      const subTasks = selectedTodo?.subTasks;
      const newSubtasks = [...subTasks, newSubtask];

      const newSelectedTodo = { ...selectedTodo, subTasks: newSubtasks };
      setSelectedTodo(newSelectedTodo);

      dispatch(addSubTaskByTodoId({ newSubtask, todoId }));
      e.target.value = "";
    }
  };

  useEffect(() => {
    if (nextSevenDayTask.status === VARIABLE_STATUS.IDLE) {
      dispatch(getMyListNextSevenDay(new Date().toLocaleDateString()));
    }
  }, [dispatch, nextSevenDayTask.status]);
  return (
    <Box className="NextSevenDay_Page_Block" style={{ paddingTop: "20px" }}>
      <Row className="NextSevenDay_Header_Block">
        <Col>
          <HeaderRouteItem />
        </Col>
      </Row>
      <Box className={classes.container}>
        <DragDropContext onDragEnd={onDragEnd}>
          {state?.map((el, ind) => (
            <NextSevenDayListItem
              ind={ind}
              el={el}
              handleClickOpen={handleClickOpen}
              getItemStyle={getItemStyle}
              getListStyle={getListStyle}
              onCreateTodo={onCreateTodo}
            />
          ))}
        </DragDropContext>
      </Box>
      {selectedTodo && (
        <Dialog
          onClose={handleClose}
          open={open}
          fullWidth={true}
          maxWidth="md"
          className={classes.dialogTodo}
        >
          {/* TODO:  Add disabled function same with MyDayPage2 page*/}
          <TodoDetail
            selectedTodo={selectedTodo}
            handleArchivedTodo={handleArchivedTodo}
            handleClose={handleClose}
            setSelectedTodo={setSelectedTodo}
            onTodoTitleChange={onTodoTitleChange}
            onTodoDescriptionChange={onTodoDescriptionChange}
            // onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
            // onSubTaskChange={onSubTaskChange}
            handleCreateSubtask={handleCreateSubtask}
            selectedTagDetail={selectedTagDetail}
            onOpenSelectedTag={onOpenSelectedTag}
            openTag={openTag}
            selectedTag={selectedTag}
            onCloseSelectedTag={onCloseSelectedTag}
          />
        </Dialog>
      )}
    </Box>
  );
};

export default NextSevenDay;
