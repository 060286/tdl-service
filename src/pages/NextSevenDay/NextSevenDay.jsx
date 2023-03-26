import React, { useEffect, useRef, useState } from "react";

import HeaderRouteItem from "../../components/core/HeaderRouteItem";
import NextSevenDayListItem from "../../components/core/NextSevenDayListItem";
import {format,addDays} from 'date-fns';

import { Col, Container, Row } from "react-bootstrap";
import {Box, Button, Dialog, Radio, Typography, TextField} from "@mui/material"
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash"
import { getMyListNextSevenDay, updateTodoTitleSlice } from "../../slices/nextSevenDaySlice";

import { VARIABLE_STATUS } from "../../constants/appStatusConstant";
import LockIcon from "@mui/icons-material/Lock";

import "./style.css";

import { makeStyles } from "@mui/styles/";
import TodoDetail from "../../components/TodoDetail/TodoDetail";

const useStyle = makeStyles(() => ({
  container: {
    display: "flex",
    marginTop: "48px",
    width: "175%",
    height: "calc(100% - 88px)"
  },
  hello: {
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    color: "#888",
    marginBottom: "8px"
  },
  LockIconDialog: {
    fontSize: "16px"
  },
  dialogTodo: {
    "& .MuiDialog-paper": {
      padding: "16px 16px 48px 16px",
    },
  },
  scroll: {
    height: "100%",
    overflow: "scroll"
  },
  mini: {
    marginRight: "16px"
  },
  titleTodo: {
    wordBreak: "break-all",
  }
}));

const NextSevenDay = ({now = new Date()}) => {
  const classes = useStyle();
  const [isMyList, setIsMyList] = useState(true);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(undefined);
  const nextSevenDayTask = useSelector(
    (state) => state.nextSevenDayReducer.getMyListNextSevenDay
  );
  const [taskTitle, setTaskTitle] = useState("");
    
  const [state, setState] =  useState([
    nextSevenDayTask?.data?.dayOne || [],
    nextSevenDayTask?.data?.dayTwo || [],
    nextSevenDayTask?.data?.dayThree || [],
    nextSevenDayTask?.data?.dayFour || [],
    nextSevenDayTask?.data?.dayFive || [],
    nextSevenDayTask?.data?.daySix || [],
    nextSevenDayTask?.data?.daySeven || []
  ])

  useEffect(() => {
    setState([
      nextSevenDayTask?.data?.dayOne || [],
      nextSevenDayTask?.data?.dayTwo || [],
      nextSevenDayTask?.data?.dayThree || [],
      nextSevenDayTask?.data?.dayFour || [],
      nextSevenDayTask?.data?.dayFive || [],
      nextSevenDayTask?.data?.daySix || [],
      nextSevenDayTask?.data?.daySeven || []
    ])
}, [nextSevenDayTask])

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
  const move = (source, destination, droppableSource, droppableDestination) => {
  console.log({source, destination})
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};


  function onDragEnd(result) {
    const { source, destination } = result;
    console.log({result})

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      // TODO: send request to be to update priority of todo from source.index to destination.index
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      console.log({source: source.droppableId, destination: destination.droppableId})
      // TODO: send request to be to update column and priority of todo
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState);
    }
  }
  const getListStyle = isDraggingOver => ({
    width: "100%",
    margin: "0 16px",
    border: "1px solid #CCC",
    padding: "16px",
    paddingRight: "4px",
    borderRadius: "8px",
    backgroundColor: "#fafbfc",
    display: "flex",
    flexDirection: "column"
  });
   const handleClickOpen =
    ({ todo }) =>
      () => {
      console.log({todo})
      setOpen(true);
      setSelectedTodo(todo);
    };

 const handleClose = () => {
    setOpen(false);
    setSelectedTodo(undefined);
  };
   const debouncedTitle = useRef(_.debounce(({id, title}) => {dispatch(updateTodoTitleSlice({id, title}))}, 500)).current
  const onTodoTitleChange = async ({ todo, e }) => {
    setSelectedTodo((preSelectedTodo => ({...preSelectedTodo, title: e.target.value})))
    debouncedTitle({ id: todo.id, title: e.target.value })
    
  }

  const getItemStyle = (isDragging, draggableStyle) => {
    
    return {
      with: "25%",
      border: "1px solid #ccc",
      padding: "8px",
      margin: "8px 0",
      borderRadius: "8px",
      backgroundColor: "#FFF",
      ...draggableStyle
    };
  }

  useEffect(() => {
    if (nextSevenDayTask.status === VARIABLE_STATUS.IDLE) {
      dispatch(getMyListNextSevenDay(new Date().toLocaleDateString()));
    }
  }, []);
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
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <Box
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                  {...provided.droppableProps}
                >
                  <Typography variant="h5">{format(addDays(now, ind), 'EEEE')}</Typography>
                  <Box className={classes.scroll}>
                    <Box className={classes.mini}>
                      {el?.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <Box
                            onClick={handleClickOpen({ todo: item })}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Box 
                              style={{
                                display: "flex",
                                alignItems: "center"
                              }}
                            
                            >
                              <Radio
                                checked={item.isCompleted}
                                // TODO: send request to be to toggle checked button 
                                onChange={() => { }}
                              />
                                <Box>
                                <Box className={classes.hello}>
                                  <LockIcon className={classes.LockIconDialog} />
                                  {"My List > "}
                                  {item.category}
                                </Box>
                                <Typography className={classes.titleTodo}>
                                  {item.title}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    </Box>
                  </Box>
                  <Box className={classes.input}>
                    <TextField
                      label="Enter todo content"
                      placeholder="Enter todo content"
                      color="primary"
                      fullWidth
                      value={taskTitle}
                      size={"small"}
                      // TODO: Same with ALL TASK PAGE row 195 
                      // onKeyUp={(e) => onKeyPressHandler(e)}
                      // onChange={(e) => setTaskTitle(e.target.value)}
                    />
                  </Box>
                </Box>
              )}
              
            </Droppable>
          ))}
        </DragDropContext>
      </Box>
      {
        selectedTodo && 
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
          // handleArchivedTodo={handleArchivedTodo}
          handleClose={handleClose}
          setSelectedTodo={setSelectedTodo}
          onTodoTitleChange={onTodoTitleChange}
          // onSubTaskIsCompletedChange={onSubTaskIsCompletedChange}
          // onSubTaskChange={onSubTaskChange}
          // handleCreateSubtask={handleCreateSubtask}
        />
      </Dialog>
      }
    </Box>
  );
};

export default NextSevenDay;
