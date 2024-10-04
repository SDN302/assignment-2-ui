import React from "react";
import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <AppBar position="fixed">
      <Toolbar style={{ margin: "auto" }}>
        <Button color="inherit" component={Link} to="/">
          Home
        </Button>
        <Button color="inherit" component={Link} to="/quizzes">
          Quizzes
        </Button>
        <Button color="inherit" component={Link} to="/questions">
          Questions
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
