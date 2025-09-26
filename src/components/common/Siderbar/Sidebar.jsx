import React from "react";
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-links active">Your Apps</div>
      <div className="sidebar-links">Personalisation</div>
      <div className="sidebar-links">Data</div>
      <div className="sidebar-links">Add</div>
    </aside>
  );
}

export default Sidebar;
