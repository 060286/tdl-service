
import { Box, Radio, TextField, Typography } from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {format,addDays} from 'date-fns';
import LockIcon from "@mui/icons-material/Lock";
import { makeStyles } from "@mui/styles/";
import { useState } from "react";

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
export default function NextSevenDayItem({ind, el, handleClickOpen, getItemStyle, getListStyle, now = new Date()}) {
  const classes = useStyle();
  const [taskTitle, setTaskTitle] = useState("");
  return (
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
  )
}