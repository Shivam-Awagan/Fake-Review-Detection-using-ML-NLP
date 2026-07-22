import { Link, useNavigate, useLocation } from "react-router-dom";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState, useEffect } from "react";

const NAVBAR_HEIGHT = 64;

const Navbar = ({ isLoggedIn, hasStarted, setIsLoggedIn, setHasStarted }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/home";

  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const openAccount = Boolean(anchorEl);

  // ✅ Sync current logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  const handleAccountClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsLoggedIn(false);
    setHasStarted(false);
    handleAccountClose();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: `${NAVBAR_HEIGHT}px`,
        width: "100%",
        px: 3,
        backgroundColor: "#406584d7",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      {/* LEFT TITLE */}
      <Box sx={{ color: "white", fontSize: "1.4rem", fontWeight: 600 }}>
        Fake Review Detection
      </Box>

      {/* RIGHT SIDE */}
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>

        {!isLoggedIn && (
          <>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              size="small"
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/signin"
              size="small"
              variant="contained"
              sx={{
                backgroundColor: "#4CAF50", // 🌿 Light Green
                color: "white",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#43A047",
                },
              }}
            >
              Sign Up
            </Button>
          </>
        )}

        {isLoggedIn && (
          <>
            <NavBtn to="/home" icon="/icons/home.svg">
              Home
            </NavBtn>

            {hasStarted && !isHomePage && (
              <>
                <NavBtn to="/single-analysis" icon="/icons/review.svg">
                  Single Review
                </NavBtn>
                <NavBtn to="/url-analysis" icon="/icons/url.svg">
                  URL Analysis
                </NavBtn>
              </>
            )}

            <AccountMenu
              anchorEl={anchorEl}
              openAccount={openAccount}
              onClick={handleAccountClick}
              onClose={handleAccountClose}
              onLogout={handleLogout}
              user={user}
            />
          </>
        )}
      </Box>
    </Box>
  );
};

/* ---------- NAV BUTTON ---------- */

const NavBtn = ({ to, icon, children }) => (
  <Button
    component={Link}
    to={to}
    size="small"
    sx={{
      height: 36,
      color: "white",
      textTransform: "none",
      fontSize: "0.95rem",
      display: "flex",
      alignItems: "center",
      gap: 1,
    }}
  >
    <img src={icon} alt={children} width="22" height="22" />
    {children}
  </Button>
);

/* ---------- ACCOUNT MENU ---------- */

const AccountMenu = ({ anchorEl, openAccount, onClick, onClose, onLogout, user }) => (
  <>
    <Button
      size="small"
      sx={{
        height: 36,
        color: "white",
        textTransform: "none",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
      onClick={onClick}
    >
      <img src="/icons/account.svg" alt="Account" width="22" height="22" />
      Account
    </Button>

    <Menu
      anchorEl={anchorEl}
      open={openAccount}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      PaperProps={{
        sx: {
          minWidth: 260,
          p: 2,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
        },
      }}
    >
      {user ? (
        <>
          <Box sx={{ mb: 1 }}>
            <Typography fontWeight={700} sx={{ color: "black" }}>
              Name: {user.name}
            </Typography>

            <Typography sx={{ color: "black" }}>
              Email: {user.email}
            </Typography>

            {user.role && (
              <Typography sx={{ color: "black" }}>
                Role: {user.role}
              </Typography>
            )}
          </Box>

          <MenuItem
            onClick={onLogout}
            sx={{
              color: "red",
              fontWeight: 600,
              borderTop: "1px solid #eee",
              mt: 1,
            }}
          >
            Logout
          </MenuItem>
        </>
      ) : (
        <MenuItem disabled>No user data</MenuItem>
      )}
    </Menu>
  </>
);

export default Navbar;