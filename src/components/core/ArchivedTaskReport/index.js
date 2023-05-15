import React, {useState, useEffect} from "react";

import {
  DialogContent,
  Dialog,
  DialogTitle,
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import "./style.css";

import { getTokenFromLocalStorage } from "../../../extensions/tokenExtension";
import axios from "axios";

export default function ArchivedTaskReport({
  onCloseArchivedTaskReportDialog,
  open,
}) {
  const [archivedCounter, setArchivedCount] = useState(null);
  const [archivedTaskList, setArchivedTaskList] = useState([]);

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    const url = `https://localhost:44334/api/v1/todos/view-archived-task-report`;

    axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res?.data?.data != null) {
          setArchivedCount(res.data.data.archivedCounter);
          setArchivedTaskList(res.data.data.archivedTaskList);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(archivedTaskList);

  return (
    <Dialog onClose={onCloseArchivedTaskReportDialog} open={open}>
      <DialogTitle>Archived Report View</DialogTitle>
      <DialogContent>
        <Box display="flex" sx={{ width: 500, height: 50 }}>
          <Box flexGrow={1}>All Time : {archivedCounter && archivedCounter.totalItemCount}</Box>
          <Box flexGrow={1}>This Week: {archivedCounter && archivedCounter.thisWeekCount}</Box>
          <Box flexGrow={1}>Today: {archivedCounter && archivedCounter.todayCount}</Box>
        </Box>
        <hr></hr>
        
      </DialogContent>
      {archivedTaskList && <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            maxHeight: 300,
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          {archivedTaskList.map(archivedTask => (
            <li key={`section-${archivedTask.archivedDate}`}>
            <ul>
              <ListSubheader>{`Archived At: ${archivedTask.archivedDate}`}</ListSubheader>
              {archivedTask?.archivedTasks?.map((item) => (
                <ListItem >
                  <ListItemText primary={`Task name : ${item.title} - Task Category : ${item.categoryTitle} - IsArchived: ${item.isArchived
}`} />
                </ListItem>
              ))} 
            </ul>
          </li>
          ))}
          
        </List>}
      
    </Dialog>
  );
}

// eslint-disable-next-line no-lone-blocks
{/* {[0, 1, 2, 3, 4].map((sectionId) => (
            <li key={`section-${sectionId}`}>
              <ul>
                <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
                {[0, 1, 2].map((item) => (
                  <ListItem key={`item-${sectionId}-${item}`}>
                    <ListItemText primary={`Item ${item}`} />
                  </ListItem>
                ))}
              </ul>
            </li>
          ))} */}