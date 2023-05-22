import React from 'react'
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router';
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
      height: "calc(100% - 32px)",
      overflow: "scroll",
    },
    todoDetail: {
      border: "1px solid #ccc",
      borderRadius: "16px",
      padding: "16px",
    },
    containerAcc: {
      border: "1px solid #ccc",
      borderRadius: "16px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    accordition: {
      marginBottom: "32px",
      maxHeight: "calc(100% - 32px)",
      overflow: "scroll",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
    },
    selectedTodoContainer: {
      paddingTop: "0",
    },
  }));
  

function WorkspacePage() {
    const { id } = useParams();
  const classes = useStyle();

  console.log({id});

  return (
    <Box className={classes.container}>
      <Typography variant="h5">Manage todo by Workspace</Typography>
    </Box>
  )
}

export default WorkspacePage