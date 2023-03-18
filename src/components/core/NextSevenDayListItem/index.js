import React from "react";
import {Box} from "@mui/material"
import "./style.css";
import { makeStyles } from "@mui/styles/";

const useStyle = makeStyles(() => ({
  container: {
    width: "25%"
  }
}));

const NextSevenDayListItem = ({ todos }) => {
  
const classes = useStyle();
  return (
    <Box className={classes.container}>
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
    </Box>
  );
};

export default NextSevenDayListItem;
