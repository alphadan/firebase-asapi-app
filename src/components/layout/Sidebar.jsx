import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { COLLECTIONS } from "../../utils/constants";
import companyLogo from "../../images/alphabet-signs-logo-450.png";

const drawerWidth = 240;

const Sidebar = ({ currentFolder, onFolderChange }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          borderRight: "1px solid #eee",
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Box
          component="img"
          src={companyLogo}
          alt="Alphabet Signs Logo"
          sx={{
            width: "100%",
            maxWidth: 180,
            height: "auto",
            mb: 1,
          }}
        />
        <Typography
          variant="subtitle2"
          color="text.secondary"
          fontWeight="bold"
          sx={{ letterSpacing: 1 }}
        >
          ADMIN CONSOLE
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        {Object.entries(COLLECTIONS).map(([key, { label }]) => (
          <ListItem key={key} disablePadding>
            <ListItemButton
              selected={currentFolder === key}
              onClick={() => onFolderChange(key)}
              sx={{
                py: 1.5,
                "&.Mui-selected": {
                  borderRight: "4px solid",
                  borderColor: "primary.main",
                },
              }}
            >
              <ListItemText
                primary={label}
                slotProps={{
                  primary: {
                    fontWeight: currentFolder === key ? 700 : 500,
                    fontSize: "0.875rem",
                    color:
                      currentFolder === key ? "primary.main" : "text.primary",
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
