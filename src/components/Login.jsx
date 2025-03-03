import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@mui/icons-material";
import { supabase } from "../config/supabase";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);

  const fetchProfileImage = async () => {
    try {
      const { data, error } = await supabase
        .from("bio")
        .select("Image")
        .single();

      if (error) throw error;
      if (data?.Image) {
        setAvatarUrl(data.Image);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error.message);
      toast.error("Failed to load profile image");
    }
  };

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // On successful login, the App component will automatically redirect to /bio
      // due to the auth state change and routing configuration
    } catch (error) {
      console.error("Error logging in:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)",
        p: 3,
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M15 0h30v15H30v15H15V15H0V0h15zm0 60h30V45H30V30H15v15H0v15h15zM45 0h15v60H45V0zM0 15h15v30H0V15z'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "60px 60px",
          opacity: 0.9,
          pointerEvents: "none",
          animation: "patternMove 60s linear infinite",
        },
        "@keyframes patternMove": {
          "0%": {
            backgroundPosition: "0 0",
          },
          "100%": {
            backgroundPosition: "60px 60px",
          },
        },
        "& > *": {
          position: "relative",
          zIndex: 1,
        },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 450,
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #2196f3, #1976d2)",
          },
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            p: 4,
            pb: 3,
            background: "white",
            color: "#1a237e",
            textAlign: "center",
          }}
        >
          {/* Add Avatar here */}
          <Avatar
            src={avatarUrl}
            alt="Ajay Dawkar"
            sx={{
              width: 120,
              height: 120,
              margin: "0 auto",
              mb: 3,
              border: "3px solid #1a237e",
              boxShadow: "0 4px 12px rgba(26,35,126,0.15)",
              animation: "fadeIn 0.5s ease-in-out",
              "@keyframes fadeIn": {
                "0%": {
                  opacity: 0,
                  transform: "scale(0.9)",
                },
                "100%": {
                  opacity: 1,
                  transform: "scale(1)",
                },
              },
            }}
          />
          {/* Existing Typography components */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: "linear-gradient(90deg, #1a237e, #0d47a1)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#546e7a",
              mb: 2,
              fontWeight: 500,
            }}
          >
            Ajay Dawkar Portfolio Management
          </Typography>
        </Box>

        {/* Form Section */}
        <Box sx={{ p: 4, bgcolor: "#fafafa" }}>
          <form onSubmit={handleLogin}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <TextField
                required
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#64748B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "white",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                  },
                }}
              />

              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#64748B" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon sx={{ color: "#64748B" }} />
                        ) : (
                          <VisibilityIcon sx={{ color: "#64748B" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "white",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "white",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                    "&.Mui-focused": {
                      backgroundColor: "white",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<LoginIcon />}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  borderRadius: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #1a237e, #0d47a1)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "linear-gradient(90deg, #0d47a1, #1a237e)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 20px rgba(26,35,126,0.3)",
                  },
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{
                color: "#546e7a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <LockIcon sx={{ fontSize: 16 }} />
              Secure login for portfolio management
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
