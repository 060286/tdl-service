import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Grid,
  Item,
  List,
  ListItem,
  ListItemButton,
  Radio,
  TextField,
} from "@mui/material";

import { makeStyles } from "@mui/styles/";
const useStyle = makeStyles(() => ({
  listItem: {
    borderRadius: "16px",
    padding: "4px",
  },
  container: {
    marginTop: "16px",
    height: "calc(100vh - 64px)",
  },
  gridContainer: {
    marginTop: "16px",
    height: "100%",
  },
  rightContainer: {
    overflow: "scroll",
  },
  item: {
    height: "100%",
    overflow: "scroll",
  },
  todoTitle: {
    wordBreak: "break-all",
  },
}));
export default function Accordition({
  tasks,
  title,
  handleTodoIsCompletedChange,
  onClick,
}) {
  const classes = useStyle();

  return (
    <>
      <Accordion expanded={true}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="allTaskUpComming">
          <Typography component={"subtitle1"}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <List className={classes.rightContainer}>
            {tasks?.map((todo) => {
              return (
                <ListItemButton
                  className={classes.listItem}
                  onClick={() => onClick(todo, title)}
                >
                  <Radio
                    checked={todo.isCompleted}
                    onChange={(e) => handleTodoIsCompletedChange(todo, e)}
                  />
                  <Typography className={classes.todoTitle}>
                    {todo.title}
                  </Typography>
                </ListItemButton>
              );
            })}
          </List>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
