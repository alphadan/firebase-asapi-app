import React, { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "./components/layout/Sidebar";
import MainContent from "./components/layout/MainContent";
import AuthGuard from "./components/auth/AuthGuard";

function App() {
  const [folder, setFolder] = useState("vendors");

  return (
    <AuthGuard>
      <Box sx={{ display: "flex" }}>
        <Sidebar currentFolder={folder} onFolderChange={setFolder} />
        <MainContent folder={folder} />
      </Box>
    </AuthGuard>
  );
}

export default App;
