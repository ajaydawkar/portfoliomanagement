import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";

const Header = ({ handleDrawerToggle, user }) => {
  const [bioData, setBioData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  useEffect(() => {
    fetchBioData();
  }, []);

  const fetchBioData = async () => {
    try {
      const { data: bioInfo, error: bioError } = await supabase
        .from("bio")
        .select("*")
        .single();

      if (bioError) throw bioError;
      setBioData(bioInfo);

      if (bioInfo?.Image) {
        const { data: imageData, error: imageError } = await supabase.storage
          .from("bio-images")
          .download(bioInfo.Image);

        if (imageError) throw imageError;

        const imageUrl = URL.createObjectURL(imageData);
        setProfileImage(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching bio:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const getUserDisplayName = () => {
    if (bioData?.name) {
      return bioData.name;
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    return user?.email?.split("@")[0] || "User";
  };

  const getUserAvatar = () => {
    return (
      profileImage ||
      bioData?.Image ||
      user?.user_metadata?.avatar_url ||
      `https://ui-avatars.com/api/?name=${getUserDisplayName()}&background=0D8ABC&color=fff`
    );
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        background:
          "linear-gradient(to right, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.95))",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.03)",
        borderBottom: "1px solid rgba(241, 245, 249, 0.9)",
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: "none" },
            color: "#1E293B",
            "&:hover": {
              background: "rgba(30, 41, 59, 0.04)",
              transform: "scale(1.05)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 800,
              fontSize: { xs: "1.1rem", sm: "1.35rem" },
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: 2,
              position: "relative",
              "&:after": {
                content: '""',
                position: "absolute",
                bottom: -2,
                left: 0,
                width: "40%",
                height: "2px",
                background:
                  "linear-gradient(90deg, #0F172A 0%, transparent 100%)",
                borderRadius: "2px",
              },
            }}
          >
            Ajay Dawkar Portfolio Management
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, sm: 3 },
            }}
          >
            {user && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1, sm: 2 },
                    background:
                      "linear-gradient(to right, rgba(30, 41, 59, 0.04), rgba(30, 41, 59, 0.02))",
                    padding: "8px 16px",
                    borderRadius: "16px",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(241, 245, 249, 0.9)",
                    "&:hover": {
                      background:
                        "linear-gradient(to right, rgba(30, 41, 59, 0.06), rgba(30, 41, 59, 0.04))",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.03)",
                    },
                  }}
                >
                  <Avatar
                    src={getUserAvatar()}
                    alt={getUserDisplayName()}
                    sx={{
                      width: { xs: 38, sm: 42 },
                      height: { xs: 38, sm: 42 },
                      border: "3px solid white",
                      bgcolor: "#0D8ABC",
                      boxShadow: "0 2px 12px rgba(13,138,188,0.25)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.08) rotate(5deg)",
                        boxShadow: "0 4px 16px rgba(13,138,188,0.35)",
                      },
                    }}
                  />
                  {!isMobile && (
                    <Box sx={{ minWidth: 100 }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#1E293B",
                          fontWeight: 600,
                          lineHeight: 1.2,
                        }}
                      >
                        {getUserDisplayName()}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#64748B",
                          display: "block",
                          fontSize: "0.75rem",
                        }}
                      >
                        {bioData?.title || user.email}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    borderColor: "rgba(226, 232, 240, 0.8)",
                    color: "#64748B",
                    borderRadius: "12px",
                    px: { xs: 2, sm: 3 },
                    py: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    "&:hover": {
                      borderColor: "#CBD5E1",
                      backgroundColor: "#F8FAFC",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                    },
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    minWidth: { xs: 42, sm: "auto" },
                    height: 42,
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  {isMobile ? "" : "Logout"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
