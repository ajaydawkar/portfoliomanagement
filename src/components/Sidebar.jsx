import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import {
  Person as BioIcon,
  School as EducationIcon,
  Work as ExperienceIcon,
  Code as ProjectIcon,
  Psychology as SkillIcon,
  ContactMail as ContactMailIcon,
  Image as ImageIcon,
  Folder as FolderIcon,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";

const drawerWidth = 280;

const menuItems = [
  { text: "Bio", icon: <BioIcon />, path: "/bio" },
  { text: "Education", icon: <EducationIcon />, path: "/education" },
  { text: "Experience", icon: <ExperienceIcon />, path: "/experience" },
  { text: "Projects", icon: <ProjectIcon />, path: "/projects" },
  { text: "Skills", icon: <SkillIcon />, path: "/skills" },
  { text: "Contacts", icon: <ContactMailIcon />, path: "/contacts" },
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const drawer = (
    <Box
      sx={{
        height: "100%",
        backgroundColor: "white",
        background:
          "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(248,250,252,0.5) 100%)",
      }}
    >
      <Box
        sx={{
          height: 70,
          display: "flex",
          alignItems: "center",
          px: 3,
          borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
          backdropFilter: "blur(10px)",
        }}
      />
      <List
        sx={{
          p: 2,
          "& .MuiListItem-root": {
            transition: "all 0.2s ease-in-out",
          },
        }}
      >
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            button
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 2,
              mb: 1,
              backgroundColor:
                location.pathname === item.path
                  ? "rgba(15, 23, 42, 0.04)"
                  : "transparent",
              color: location.pathname === item.path ? "#0F172A" : "#64748B",
              position: "relative",
              overflow: "hidden",
              "&:hover": {
                backgroundColor: "rgba(15, 23, 42, 0.02)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                "& .MuiListItemIcon-root": {
                  color: "#0F172A",
                  transform: "scale(1.1)",
                },
                "& .MuiListItemText-primary": {
                  color: "#0F172A",
                },
              },
              "&:active": {
                transform: "translateY(0)",
              },
              "&::before": {
                content: '""',
                display: location.pathname === item.path ? "block" : "none",
                position: "absolute",
                left: 0,
                top: "50%",
                transform: "translateY(-50%)",
                height: "60%",
                width: "3px",
                backgroundColor: "#0F172A",
                borderRadius: "0 4px 4px 0",
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? "#0F172A" : "#64748B",
                minWidth: 40,
                transition: "all 0.2s ease-in-out",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 500,
                sx: {
                  transition: "all 0.2s ease-in-out",
                  fontSize: "0.95rem",
                  letterSpacing: "0.01em",
                },
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
      }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "white",
            border: "none",
            boxShadow: "4px 0 25px rgba(0,0,0,0.08)",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "white",
            border: "none",
            boxShadow: "4px 0 25px rgba(0,0,0,0.08)",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
