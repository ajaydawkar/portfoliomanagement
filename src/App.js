import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import BioForm from "./components/forms/BioForm.jsx";
import EducationForm from "./components/forms/EducationForm.jsx";
import ExperienceForm from "./components/forms/ExperienceForm.jsx";
import ProjectForm from "./components/forms/ProjectForm.jsx";
import SkillForm from "./components/forms/SkillForm.jsx";
import Login from "./components/Login.jsx";
import ContactForm from "./components/forms/ContactForm.jsx";
import Footer from "./components/Footer";

import { supabase } from "./config/supabase";

const App = () => {
  const [session, setSession] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Determine if we're running in production
  const isProduction = process.env.NODE_ENV === "production";
  // Set the basename conditionally
  const basename = "/portfoliomanagement"; // Always use the same basename

  useEffect(() => {
    // Check active sessions and set up auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    ///
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  if (loading) {
    return null;
  }

  if (!session) {
    return (
      <>
        <Login />
        <ToastContainer position="bottom-right" />
      </>
    );
  }

  return (
    <Router basename={basename}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        <Header handleDrawerToggle={handleDrawerToggle} user={session.user} />

        <Sidebar
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: { sm: `calc(100% - ${280}px)` },
            mt: 8,
            backgroundColor: "#F8FAFC",
          }}
        >
          <Box sx={{ p: 3, flexGrow: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/bio" replace />} />
              <Route path="/bio" element={<BioForm />} />
              <Route path="/education" element={<EducationForm />} />
              <Route path="/experience" element={<ExperienceForm />} />
              <Route path="/projects" element={<ProjectForm />} />
              <Route path="/skills" element={<SkillForm />} />
              <Route path="/contacts" element={<ContactForm />} />
              <Route path="*" element={<Navigate to="/bio" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Box>
    </Router>
  );
};

export default App;
