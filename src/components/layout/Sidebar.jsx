import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { COLLECTIONS } from "../../utils/constants";
import companyLogo from "../../images/logo_icon_180.jpg";
import FirebaseAuthService from "../../FirebaseAuthService";
import { auth } from "../../FirebaseConfig";

const drawerWidth = 240;

const handleLogout = () => {
  if (window.confirm("Are you sure you want to log out?")) {
    FirebaseAuthService.logoutUser(auth);
  }
};

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
      <Box sx={{ p: 1, textAlign: "center" }}>
        <Box
          component="img"
          src={companyLogo}
          alt="Alphabet Signs Logo"
          sx={{
            height: 48, // Set fixed height
            width: "auto", // Scales width accordingly
            maxWidth: "100%", // Ensures it doesn't overflow
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
      {/* Logout Button at the Bottom */}
      <Box sx={{ p: 2, mt: "auto" }}>
        <Divider sx={{ mb: 2 }} />
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: "text.primary",
              "&:hover": { bgcolor: "rgba(211, 47, 47, 0.04)" },
            }}
          >
            <ListItemIcon sx={{ color: "text.primary", minWidth: 40 }}>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              slotProps={{
                primary: { fontWeight: 600, fontSize: "0.875rem" },
              }}
            />
          </ListItemButton>
        </ListItem>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
