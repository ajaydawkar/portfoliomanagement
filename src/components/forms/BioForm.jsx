import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  IconButton,
  Avatar,
  Divider,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Save as SaveIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  Description as ResumeIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
  CheckCircleOutline as SuccessIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon,
  Sync as LoadingIcon,
  WbSunny as MorningIcon,
  WbSunnyOutlined as AfternoonIcon,
  Brightness2 as EveningIcon,
  NightsStay as NightIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { bioApi, copyrightApi } from "../../api/SupabaseData";
import { Toaster, toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollLock } from "../../hooks/useScrollLock";
import { styled } from "@mui/material/styles";

// Add these utility functions
const isMobile = () => window.innerWidth < 600;
const isTablet = () => window.innerWidth >= 600 && window.innerWidth < 960;

// Add responsive handlers
const handleTouchStart = (event) => {
  if (isMobile()) {
    // Add touch-specific behavior
  }
};

// Update the formStyles with responsive design
const formStyles = {
  container: {
    width: "100%",
    maxWidth: "100%",
    margin: "0 auto",
    p: { xs: 2, sm: 3 },
    "@media (min-width: 1200px)": {
      maxWidth: 1200,
    },
  },
  header: {
    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    p: { xs: 2.5, sm: 3, md: 4 },
    color: "white",
    borderRadius: { xs: "12px 12px 0 0", sm: "16px 16px 0 0" },
  },
  headerTitle: {
    fontWeight: 800,
    mb: { xs: 0.5, sm: 1 },
    fontSize: {
      xs: "1.5rem",
      sm: "1.75rem",
      md: "2rem",
    },
    letterSpacing: "-0.02em",
    background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  contentBox: {
    p: { xs: 2.5, sm: 3, md: 4 },
    backgroundColor: "#FFFFFF",
  },
};

// Update the chipStyles for better mobile handling
const chipStyles = {
  display: "flex",
  flexWrap: "wrap",
  gap: { xs: 1, sm: 1.5 },
  mt: 2,
  "& .MuiChip-root": {
    height: { xs: 32, sm: 36 },
    borderRadius: { xs: "10px", sm: "12px" },
    fontSize: { xs: "0.813rem", sm: "0.875rem" },
    "& .MuiChip-label": {
      px: { xs: 2, sm: 3 },
    },
  },
};

// Add responsive dialog styles
const dialogStyles = {
  paper: {
    width: { xs: "95%", sm: "100%" },
    maxWidth: { xs: "100%", sm: 600 },
    margin: { xs: "16px", sm: "32px" },
    borderRadius: { xs: "16px", sm: "20px" },
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(241, 245, 249, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  },
  title: {
    background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
    color: "white",
    px: { xs: 2.5, sm: 3 },
    py: { xs: 2, sm: 2.5 },
  },
  content: {
    p: { xs: 2.5, sm: 3 },
    "&.MuiDialogContent-root": {
      paddingTop: { xs: "20px !important", sm: "24px !important" },
    },
  },
  actions: {
    p: { xs: 2.5, sm: 3 },
    backgroundColor: "#F8FAFC",
    borderTop: "1px solid rgba(226, 232, 240, 0.8)",
  },
};

// First, add these button styles to your existing styles
const dialogButtonStyles = {
  cancelButton: {
    borderColor: "#E2E8F0",
    color: "#64748B",
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: "none",
    "&:hover": {
      borderColor: "#CBD5E1",
      backgroundColor: "#F1F5F9",
    },
    transition: "all 0.2s ease-in-out",
  },
  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    px: 3,
    py: 1,
    borderRadius: 2,
    textTransform: "none",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    },
    transition: "all 0.2s ease-in-out",
  },
};

// Update the social icons for better touch targets
const socialIconStyles = (color) => ({
  color: color,
  backgroundColor: `${color}08`,
  padding: { xs: 1.25, sm: 1.5 },
  borderRadius: { xs: "10px", sm: "12px" },
  minWidth: { xs: 44, sm: 48 },
  minHeight: { xs: 44, sm: 48 },
  "& .MuiSvgIcon-root": {
    fontSize: { xs: "1.25rem", sm: "1.5rem" },
  },
});

// Update avatar styles for responsive sizing
const avatarStyles = {
  width: { xs: 120, sm: 140, md: 160 },
  height: { xs: 120, sm: 140, md: 160 },
  border: "4px solid white",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};

// Update text field styles for mobile
const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: { xs: "10px", sm: "12px" },
    minHeight: { xs: "44px", sm: "48px" },
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },
  "& .MuiInputLabel-root": {
    fontSize: { xs: "0.875rem", sm: "1rem" },
  },
  "& .MuiInputAdornment-root": {
    "& .MuiSvgIcon-root": {
      fontSize: { xs: "1.125rem", sm: "1.25rem" },
    },
  },
};

// Add these styles for better mobile grid spacing
const gridStyles = {
  container: {
    spacing: { xs: 2, sm: 3 },
  },
  item: {
    xs: 12,
    sm: 6,
    md: 6,
  },
};

// Update the Grid container in the return statement
<Grid container spacing={gridStyles.container.spacing}>
  {/* Grid items */}
  <Grid item xs={gridStyles.item.xs} sm={gridStyles.item.sm}>
    {/* Content */}
  </Grid>
</Grid>;

// Add touch-friendly button styles
const buttonStyles = {
  minHeight: { xs: "44px", sm: "48px" },
  px: { xs: 3, sm: 4 },
  fontSize: { xs: "0.875rem", sm: "0.95rem" },
  borderRadius: { xs: "10px", sm: "12px" },
};

const GreetingMessage = ({ userName }) => {
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12)
      return {
        text: "Good morning",
        icon: <MorningIcon />,
        color: "#FDB813",
        gradientStart: "#FF512F",
        gradientEnd: "#F09819",
        bgPattern:
          "radial-gradient(circle at top right, #FDB81315, transparent 70%)",
      };

    if (hour >= 12 && hour < 17)
      return {
        text: "Good afternoon",
        icon: <AfternoonIcon />,
        color: "#FFB100",
        gradientStart: "#1E293B",
        gradientEnd: "#334155",
        bgPattern:
          "radial-gradient(circle at top right, #FFB10015, transparent 70%)",
      };

    if (hour >= 17 && hour < 22)
      return {
        text: "Good evening",
        icon: <EveningIcon />,
        color: "#60A5FA",
        gradientStart: "#2D3A69",
        gradientEnd: "#1E293B",
        bgPattern:
          "radial-gradient(circle at top right, #60A5FA15, transparent 70%)",
      };

    return {
      text: "Good night",
      icon: <NightIcon />,
      color: "#A78BFA",
      gradientStart: "#0F172A",
      gradientEnd: "#1E293B",
      bgPattern:
        "radial-gradient(circle at top right, #A78BFA15, transparent 70%)",
    };
  };

  const greeting = getCurrentTimeGreeting();

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{
        mb: 4,
        p: { xs: 2.5, sm: 3 },
        borderRadius: { xs: 3, sm: 4 },
        background: `linear-gradient(135deg, ${greeting.gradientStart} 0%, ${greeting.gradientEnd} 100%)`,
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: greeting.bgPattern,
          opacity: 0.6,
          pointerEvents: "none",
        },
      }}
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
      >
        <Typography
          variant="h5"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            fontWeight: 700,
            mb: 1.5,
            fontSize: { xs: "1.5rem", sm: "1.75rem" },
          }}
        >
          <Box
            component={motion.div}
            initial={{ rotate: -30, scale: 0.5 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.5,
              ease: "easeOut",
              type: "spring",
              stiffness: 200,
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 40, sm: 48 },
              height: { xs: 40, sm: 48 },
              borderRadius: "14px",
              backgroundColor: `${greeting.color}20`,
              border: `2px solid ${greeting.color}40`,
              color: greeting.color,
              boxShadow: `0 4px 12px ${greeting.color}30`,
              transition: "all 0.3s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "scale(1.1) rotate(5deg)",
                backgroundColor: `${greeting.color}30`,
                border: `2px solid ${greeting.color}60`,
                boxShadow: `0 6px 16px ${greeting.color}40`,
              },
            }}
          >
            {greeting.icon}
          </Box>
          <Box
            sx={{
              background: "linear-gradient(135deg, #E2E8F0 0%, #FFFFFF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {`${greeting.text}, ${userName || "there"}!`}
          </Box>
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Typography
          variant="body1"
          sx={{
            color: "#94A3B8",
            lineHeight: 1.7,
            fontSize: { xs: "0.875rem", sm: "1rem" },
            maxWidth: "600px",
            letterSpacing: "0.01em",
            "& strong": {
              color: "#E2E8F0",
              fontWeight: 600,
            },
          }}
        >
          Welcome to your <strong>portfolio management dashboard</strong>. Here
          you can update your bio information and manage your{" "}
          <strong>social media presence</strong>.
        </Typography>
      </motion.div>

      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        sx={{
          display: "flex",
          gap: 1,
          mt: 2.5,
          flexWrap: "wrap",
        }}
      >
        {["Bio", "Social Links", "Copyright"].map((item, index) => (
          <Chip
            key={item}
            label={item}
            sx={{
              backgroundColor: "rgba(255,255,255,0.08)",
              color: "#E2E8F0",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.1)",
              backdropFilter: "blur(8px)",
              fontSize: { xs: "0.75rem", sm: "0.813rem" },
              height: { xs: "28px", sm: "32px" },
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.12)",
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              },
              animation: `fadeIn 0.5s ease forwards ${0.7 + index * 0.1}s`,
              "@keyframes fadeIn": {
                "0%": { opacity: 0, transform: "translateY(10px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const BioForm = () => {
  const { enableBodyScroll, disableBodyScroll } = useScrollLock();
  const [bio, setBio] = useState({
    name: "",
    roles: [],
    description: "",
    github: "",
    resume: "",
    linkedin: "",
    twitter: "",
    insta: "",
    image: "", // Changed from Image to image
  });
  const [copyright, setCopyright] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [deleteRoleDialog, setDeleteRoleDialog] = useState({
    open: false,
    role: "",
    index: -1,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const commonButtonSx = {
    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    borderRadius: "12px",
    textTransform: "none",
    px: 4,
    py: 1.5,
    minWidth: { xs: "100%", sm: "160px" },
    height: 46,
    fontSize: "0.95rem",
    fontWeight: 600,
    letterSpacing: "0.01em",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    },
  };

  // Update paperStyles
  const paperStyles = {
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    transition: "all 0.3s ease",
    border: "1px solid rgba(241, 245, 249, 0.2)",
    backdropFilter: "blur(20px)",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
    },
  };

  // Update textFieldStyles
  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      backgroundColor: "#F8FAFC",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: "#F1F5F9",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#94A3B8",
          borderWidth: "2px",
        },
      },
      "&.Mui-focused": {
        backgroundColor: "#F1F5F9",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#0F172A",
          borderWidth: "2px",
        },
      },
    },
    "& .MuiInputLabel-root": {
      color: "#64748B",
      "&.Mui-focused": {
        color: "#0F172A",
      },
    },
    "& .MuiInputAdornment-root": {
      "& .MuiSvgIcon-root": {
        fontSize: "1.25rem",
        transition: "all 0.2s ease",
      },
      "&:hover .MuiSvgIcon-root": {
        transform: "scale(1.1)",
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 1,
      color: "#94A3B8",
    },
  };

  // Update socialIconStyles
  const socialIconStyles = (color) => ({
    color: color,
    backgroundColor: `${color}08`,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    padding: 1.5,
    borderRadius: "12px",
    "&:hover": {
      backgroundColor: `${color}15`,
      transform: "translateY(-3px) scale(1.05)",
      boxShadow: `0 4px 12px ${color}20`,
    },
    "& .MuiSvgIcon-root": {
      fontSize: "1.5rem",
    },
  });

  const avatarStyles = {
    width: { xs: 140, sm: 160 },
    height: { xs: 140, sm: 160 },
    border: "4px solid white",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      transform: "scale(1.05) rotate(2deg)",
      boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
      border: "4px solid #E2E8F0",
    },
  };

  // Add these styles to your existing styles
  const previewStyles = {
    previewSection: {
      p: { xs: 2.5, sm: 3 },
      borderRadius: { xs: 2, sm: 3 },
      background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
    previewTitle: {
      color: "#1E293B",
      fontWeight: 600,
      fontSize: { xs: "1.25rem", sm: "1.5rem" },
      mb: { xs: 2, sm: 3 },
      background: "linear-gradient(135deg, #1E293B 0%, #334155 100%)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    socialIconsContainer: {
      display: "flex",
      gap: { xs: 1.5, sm: 2 },
      flexWrap: "wrap",
      justifyContent: { xs: "center", sm: "flex-start" },
    },
  };

  // Add these loading toast styles
  const loadingToastStyles = {
    style: {
      background: "rgba(15, 23, 42, 0.95)",
      backdropFilter: "blur(8px)",
      color: "white",
      borderRadius: "16px",
      padding: "16px 24px",
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      fontSize: "14px",
      fontWeight: 500,
      border: "1px solid rgba(255,255,255,0.1)",
    },
    icon: "🔄",
    position: "bottom-center",
    duration: Infinity,
  };

  // Update the toast configuration
  const toastConfig = {
    position: "top-center",
    duration: 3000,
    style: {
      background: "rgba(15, 23, 42, 0.95)",
      color: "white",
      backdropFilter: "blur(8px)",
      borderRadius: "16px",
      padding: "16px 24px",
      maxWidth: "500px",
      width: "90%",
      border: "1px solid rgba(255,255,255,0.1)",
      fontSize: "14px",
      fontWeight: 500,
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    success: {
      style: {
        background: "rgba(16, 185, 129, 0.95)",
      },
      icon: (
        <SuccessIcon
          sx={{
            animation: "rotate 0.5s ease-out",
            "@keyframes rotate": {
              "0%": { transform: "scale(0.5) rotate(-180deg)" },
              "100%": { transform: "scale(1) rotate(0)" },
            },
          }}
        />
      ),
    },
    error: {
      style: {
        background: "rgba(239, 68, 68, 0.95)",
      },
      icon: (
        <ErrorIcon
          sx={{
            animation: "shake 0.5s ease-in-out",
            "@keyframes shake": {
              "0%, 100%": { transform: "translateX(0)" },
              "25%": { transform: "translateX(-4px)" },
              "75%": { transform: "translateX(4px)" },
            },
          }}
        />
      ),
    },
    loading: {
      style: {
        background: "rgba(30, 41, 59, 0.95)",
      },
      icon: (
        <LoadingIcon
          sx={{
            animation: "spin 1s linear infinite",
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
        />
      ),
      duration: Infinity,
    },
    info: {
      style: {
        background: "rgba(59, 130, 246, 0.95)",
      },
      icon: <InfoIcon sx={{ animation: "fadeIn 0.5s ease-in" }} />,
    },
  };

  useEffect(() => {
    fetchBio();
    fetchCopyright();
  }, []);

  // Update the fetchBio function to remove prefilled roles
  const fetchBio = async () => {
    const loadingToast = toast.loading(
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <LoadingIcon sx={{ animation: "spin 1s linear infinite" }} />
        <Typography>Loading your information...</Typography>
      </Box>,
      { ...toastConfig }
    );

    try {
      const data = await bioApi.fetch();
      setBio({
        ...data,
        roles: Array.isArray(data?.roles) ? data.roles : [],
      });

      toast.success(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Information loaded successfully</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast, // Replace the loading toast with success
          duration: 2000,
        }
      );
    } catch (error) {
      toast.error(
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Typography>Failed to load information</Typography>
        </Box>,
        {
          ...toastConfig,
          id: loadingToast, // Replace the loading toast with error
          duration: 3000,
        }
      );
    }
  };

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Saving changes...", toastConfig);
    try {
      if (!bio.name || !bio.description) {
        toast.dismiss(loadingToast);
        toast.error("Please fill in all required fields", toastConfig);
        return;
      }

      await bioApi.update(bio);
      toast.dismiss(loadingToast);
      toast.success("Changes saved successfully", toastConfig);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to save changes", toastConfig);
    }
  };

  const fetchCopyright = async () => {
    try {
      const data = await copyrightApi.fetch();
      setCopyright(data?.copyright || "");
    } catch (error) {
      toast.error("Error loading copyright", toastConfig);
    }
  };

  const handleCopyrightSubmit = async () => {
    if (!copyright.trim()) {
      toast.error("Copyright text cannot be empty", toastConfig);
      return;
    }

    const loadingToast = toast.loading("Saving copyright...", toastConfig);
    try {
      await copyrightApi.update(copyright.trim());
      toast.dismiss(loadingToast);
      toast.success("Copyright saved", toastConfig);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to save copyright", toastConfig);
    }
  };

  const handleRoleChange = (e) => {
    setRoleInput(e.target.value);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
    disableBodyScroll();
  };

  const handleCloseDelete = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    enableBodyScroll();
  };

  const handleConfirmDelete = async () => {
    const loadingToast = toast.loading("Deleting bio...", toastConfig);
    try {
      await bioApi.delete(itemToDelete.id);
      await fetchBio();
      toast.dismiss(loadingToast);
      toast.success("Bio deleted successfully", toastConfig);
      handleCloseDelete();
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error deleting bio: " + error.message, toastConfig);
    }
  };

  // Update the role delete dialog handlers
  const handleOpenDeleteRole = (role, index) => {
    setDeleteRoleDialog({ open: true, role, index });
    disableBodyScroll();
  };

  const handleCloseDeleteRole = () => {
    setDeleteRoleDialog({ open: false, role: "", index: -1 });
    enableBodyScroll();
  };

  const handleConfirmDeleteRole = () => {
    setBio((prev) => ({
      ...prev,
      roles: prev.roles.filter((_, i) => i !== deleteRoleDialog.index),
    }));
    toast.success(`Removed role: ${deleteRoleDialog.role}`);
    handleCloseDeleteRole(); // Use this instead of direct setState
  };

  useEffect(() => {
    return () => {
      enableBodyScroll(); // Cleanup on unmount
    };
  }, []);

  return (
    <Box sx={formStyles.container}>
      <GreetingMessage userName={bio.name} /> {/* Add this line */}
      <Paper sx={paperStyles}>
        <Box sx={formStyles.header}>
          <Typography variant="h4" sx={formStyles.headerTitle}>
            Bio Information
          </Typography>
          <Typography variant="body1" sx={{ color: "#94A3B8" }}>
            Manage your personal information and social links
          </Typography>
        </Box>

        <Box sx={formStyles.contentBox}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SectionHeader
                title="Personal Information"
                subtitle="Your basic profile information"
              />
            </Grid>
            {/* Profile Image URL */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Profile Image URL"
                value={bio.Image || ""} // Changed from Image to image
                onChange={(e) => setBio({ ...bio, Image: e.target.value })}
                sx={textFieldStyles}
                InputProps={{
                  startAdornment: (
                    <Box
                      component="img"
                      src={bio.Image || ""} // Changed from Image to image
                      alt=""
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        mr: 1,
                        objectFit: "cover",
                        display: bio.Image ? "block" : "none", // Changed from Image to image
                      }}
                    />
                  ),
                }}
                helperText="Enter the URL of your profile image"
              />
            </Grid>

            {/* Avatar Preview */}
            <Grid item xs={12} display="flex" justifyContent="center">
              <Box
                sx={{
                  position: "relative",
                  "&:hover": {
                    "& .image-overlay": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <Avatar
                  src={bio.Image || ""} // Changed from Image to image
                  alt={bio.name}
                  sx={avatarStyles}
                />
              </Box>
            </Grid>

            {/* Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Name"
                value={bio.name || ""}
                onChange={(e) => setBio({ ...bio, name: e.target.value })}
                sx={textFieldStyles}
              />
            </Grid>

            {/* Roles */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Role"
                value={roleInput}
                onChange={handleRoleChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && roleInput.trim()) {
                    e.preventDefault();
                    const newRole = roleInput.trim();
                    if (!bio.roles.includes(newRole)) {
                      setBio((prev) => ({
                        ...prev,
                        roles: [...prev.roles, newRole],
                      }));
                      setRoleInput("");
                      toast.success(`Added role: ${newRole}`, {
                        icon: "🎯",
                        duration: 2000,
                      });
                    } else {
                      toast.error("This role already exists", {
                        icon: "⚠️",
                        duration: 3000,
                      });
                    }
                  }
                }}
                placeholder="Type a role and press Enter"
                helperText="Press Enter to add a role"
                sx={textFieldStyles}
                InputProps={{
                  sx: {
                    "&::placeholder": {
                      color: "rgba(100, 116, 139, 0.8)",
                    },
                  },
                }}
              />
              <AnimatePresence>
                <Stack
                  direction="row"
                  flexWrap="wrap"
                  sx={chipStyles}
                  component={motion.div}
                  layout
                >
                  {bio.roles.map((role, index) => (
                    <motion.div
                      key={role}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                    >
                      <Chip
                        label={role}
                        onDelete={() => handleOpenDeleteRole(role, index)}
                        sx={{
                          maxWidth: "180px",
                          backgroundColor: `hsl(${
                            (index * 75) % 360
                          }, 85%, 97%)`,
                          borderColor: `hsl(${(index * 75) % 360}, 85%, 90%)`,
                          color: `hsl(${(index * 75) % 360}, 85%, 35%)`,
                          "&:hover": {
                            backgroundColor: `hsl(${
                              (index * 75) % 360
                            }, 85%, 95%)`,
                            borderColor: `hsl(${(index * 75) % 360}, 85%, 85%)`,
                          },
                          "& .MuiChip-label": {
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: 600,
                          },
                          "& .MuiChip-deleteIcon": {
                            color: `hsl(${(index * 75) % 360}, 85%, 35%)`,
                            "&:hover": {
                              color: `hsl(${(index * 75) % 360}, 85%, 25%)`,
                            },
                          },
                        }}
                      />
                    </motion.div>
                  ))}
                </Stack>
              </AnimatePresence>
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Description"
                value={bio.description || ""}
                onChange={(e) =>
                  setBio({ ...bio, description: e.target.value })
                }
                sx={textFieldStyles}
              />
            </Grid>

            {/* Social Links */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="GitHub URL"
                value={bio.github || ""}
                onChange={(e) => setBio({ ...bio, github: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <GitHubIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={bio.linkedin || ""}
                onChange={(e) => setBio({ ...bio, linkedin: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <LinkedInIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Twitter URL"
                value={bio.twitter || ""}
                onChange={(e) => setBio({ ...bio, twitter: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <TwitterIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Instagram URL"
                value={bio.insta || ""}
                onChange={(e) => setBio({ ...bio, insta: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <InstagramIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Resume URL"
                value={bio.resume || ""}
                onChange={(e) => setBio({ ...bio, resume: e.target.value })}
                InputProps={{
                  startAdornment: (
                    <ResumeIcon sx={{ mr: 1, color: "#64748B" }} />
                  ),
                }}
                sx={textFieldStyles}
              />
            </Grid>

            {/* Save Button */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", sm: "flex-end" },
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  sx={{
                    ...commonButtonSx,
                    background:
                      "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <StyledDialog
          open={deleteRoleDialog.open}
          onClose={handleCloseDeleteRole}
          maxWidth="sm"
          fullWidth
          TransitionComponent={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          disableScrollLock={false}
          onBackdropClick={handleCloseDeleteRole}
          PaperProps={{
            sx: {
              m: 2,
              maxHeight: "calc(100% - 64px)",
            },
          }}
        >
          <StyledDialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <DeleteIcon sx={{ color: "#EF4444" }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Delete Role
                </Typography>
              </Box>
              <IconButton
                onClick={handleCloseDeleteRole}
                sx={{
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    transform: "rotate(90deg)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </StyledDialogTitle>

          <DialogContent sx={styles.dialogContent}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Box sx={styles.warningBox}>
                <Box sx={styles.warningIconBox}>
                  <WarningIcon sx={{ color: "#EF4444", fontSize: 28 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: "#1E293B",
                      mb: 0.5,
                    }}
                  >
                    {deleteRoleDialog.role}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    Role to be deleted
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: "#1E293B",
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                Are you sure you want to delete this role?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                ⚠️ This action cannot be undone. The role will be permanently
                removed from your profile.
              </Typography>
            </motion.div>
          </DialogContent>

          <DialogActions sx={styles.dialogActions}>
            <Button
              onClick={handleCloseDeleteRole}
              variant="outlined"
              sx={styles.cancelButton}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDeleteRole}
              variant="contained"
              sx={styles.deleteButton}
            >
              Delete Role
            </Button>
          </DialogActions>
        </StyledDialog>
      </Paper>
      <Divider sx={formStyles.divider} />
      {/* Social Links Preview */}
      <Paper sx={previewStyles.previewSection}>
        <Typography variant="h6" sx={previewStyles.previewTitle}>
          Social Links Preview
        </Typography>
        <Box sx={previewStyles.socialIconsContainer}>
          {bio.github && (
            <IconButton
              href={bio.github}
              target="_blank"
              sx={{
                ...socialIconStyles("#24292e"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <GitHubIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </IconButton>
          )}
          {bio.linkedin && (
            <IconButton
              href={bio.linkedin}
              target="_blank"
              sx={{
                ...socialIconStyles("#0077B5"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <LinkedInIcon
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              />
            </IconButton>
          )}
          {bio.twitter && (
            <IconButton
              href={bio.twitter}
              target="_blank"
              sx={{
                ...socialIconStyles("#1DA1F2"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <TwitterIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </IconButton>
          )}
          {bio.insta && (
            <IconButton
              href={bio.insta}
              target="_blank"
              sx={{
                ...socialIconStyles("#E4405F"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <InstagramIcon
                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
              />
            </IconButton>
          )}
          {bio.resume && (
            <IconButton
              href={bio.resume}
              target="_blank"
              sx={{
                ...socialIconStyles("#1E293B"),
                p: { xs: 1.5, sm: 2 },
                minWidth: { xs: 44, sm: 48 },
                minHeight: { xs: 44, sm: 48 },
              }}
            >
              <ResumeIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </IconButton>
          )}
        </Box>
      </Paper>
      <Divider sx={formStyles.divider} />
      {/* Copyright Section */}
      <Paper sx={{ ...paperStyles, mt: 3, p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#0F172A",
              fontWeight: 600,
              mb: { xs: 2, sm: 0 },
            }}
          >
            Copyright Information
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Copyright Text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            helperText="Example: © 2024 Your Name. All rights reserved."
            sx={textFieldStyles}
          />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Preview: {copyright || "No copyright text set"}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "stretch", sm: "flex-end" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleCopyrightSubmit}
              sx={commonButtonSx}
            >
              Save Copyright
            </Button>
          </Box>
        </Box>
      </Paper>
      <Toaster
        position="top-center"
        toastOptions={toastConfig}
        containerStyle={{
          top: 20,
          right: 20,
          left: 20,
        }}
        gutter={8}
      />
      <StyledDialog
        open={deleteDialogOpen}
        onClose={handleCloseDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        disableScrollLock={false}
        onBackdropClick={handleCloseDelete}
        PaperProps={{
          sx: {
            m: 2,
            maxHeight: "calc(100% - 64px)",
          },
        }}
      >
        <StyledDialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <DeleteIcon sx={{ color: "#EF4444" }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Delete Bio
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseDelete}
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                  transform: "rotate(90deg)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </StyledDialogTitle>

        <DialogContent sx={styles.dialogContent}>
          {itemToDelete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2.5,
                  mb: 3,
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "rgba(241, 245, 249, 0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, color: "#1E293B" }}
                >
                  {itemToDelete.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  {itemToDelete.description}
                </Typography>
              </Box>

              <Typography
                variant="body1"
                sx={{ color: "#1E293B", mb: 2, fontWeight: 500 }}
              >
                Are you sure you want to delete this bio?
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                ⚠️ This action cannot be undone. The bio entry will be
                permanently removed.
              </Typography>
            </motion.div>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: "#F8FAFC",
            borderTop: "1px solid rgba(226, 232, 240, 0.8)",
          }}
        >
          <Button
            onClick={handleCloseDelete}
            variant="outlined"
            sx={styles.cancelButton}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            sx={styles.deleteButton}
          >
            Delete Bio
          </Button>
        </DialogActions>
      </StyledDialog>
    </Box>
  );
};

// Add this component for section headers
const SectionHeader = ({ title, subtitle }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="h6"
      sx={{
        color: "#0F172A",
        fontWeight: 700,
        fontSize: "1.25rem",
        mb: 0.5,
        background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" sx={{ color: "#64748B" }}>
        {subtitle}
      </Typography>
    )}
  </Box>
);

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px) saturate(180%);
    border: 1px solid rgba(241, 245, 249, 0.2);
    border-radius: 24px;
    box-shadow: rgb(0 0 0 / 8%) 0px 20px 40px, rgb(0 0 0 / 6%) 0px 1px 3px;
    overflow: hidden;
  }
`;

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)",
  color: "white",
  padding: "24px",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "1px",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
  },
}));

// Add these styles to your existing styles object
const styles = {
  // ...existing styles...

  dialogContent: {
    p: 3,
    background:
      "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
  },
  warningBox: {
    display: "flex",
    gap: 2.5,
    mb: 3,
    p: 2,
    borderRadius: 2,
    backgroundColor: "rgba(241, 245, 249, 0.5)",
    backdropFilter: "blur(8px)",
  },
  warningIconBox: {
    width: 48,
    height: 48,
    borderRadius: 2,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogActions: {
    p: 3,
    backgroundColor: "#F8FAFC",
    borderTop: "1px solid rgba(226, 232, 240, 0.8)",
  },
  cancelButton: {
    borderColor: "#E2E8F0",
    color: "#64748B",
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 500,
    "&:hover": {
      borderColor: "#CBD5E1",
      backgroundColor: "#F1F5F9",
      transform: "translateY(-2px)",
    },
    transition: "all 0.2s ease-in-out",
  },
  deleteButton: {
    background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)",
    color: "white",
    px: 3,
    py: 1.5,
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    boxShadow: "0 4px 12px rgba(239,68,68,0.2)",
    "&:hover": {
      background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 16px rgba(239,68,68,0.3)",
    },
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};

export default BioForm;
