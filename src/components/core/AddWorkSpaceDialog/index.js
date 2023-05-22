import React from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

export default function AddWorkSpaceDialog({
  openWorkspaceDialog,
  handleCloseWorkspaceDialog,
  handleCreateWorkspace,
  handleWorkspaceDescChange,
  handleWorkspaceTitleChange
}) {
  return (
    <Dialog
      PaperProps={{ style: { width: "500px" } }}
      open={openWorkspaceDialog}
      onClose={handleCloseWorkspaceDialog}
    >
      <DialogTitle>Create Your Workspace</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Category Your Workspace"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => {
            handleWorkspaceTitleChange(e.target.value)
          }}
        />
        <TextField
          margin="dense"
          id="name"
          label="Description"
          type="text"
          fullWidth
          variant="standard"
          onChange={(e) => {
            handleWorkspaceDescChange(e.target.value)
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseWorkspaceDialog}>Cancel</Button>
        <Button onClick={handleCreateWorkspace}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}
