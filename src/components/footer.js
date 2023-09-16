import React from "react";
import "../App.css";
import { ListItemButton, ListItemText } from "@mui/material";

function Footer() {
  return (
    <div>
      <nav className="footer">
        <ListItemButton href="https://github.com/groverbraam">
          <ListItemText primary="Twitter" />
        </ListItemButton>
        <ListItemButton href="https://www.linkedin.com/in/christophermaleakethompson/">
          <ListItemText primary="Instagram" />
        </ListItemButton>
      </nav>
    </div>
  );
}

export default Footer;
