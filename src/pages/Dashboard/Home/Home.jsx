import React from "react";
import Navbar from "../../../components/common/Navbar/Navbar.jsx";
import Sidebar from "../../../components/common/Siderbar/Sidebar.jsx";
import "./Home.css";
import { Link, Route } from "react-router";

function Home() {
  const yourApps = [
    {
      route: "/classification",
      title: "Auto classification",
      description: "Unlock Seamless Auto classification Today",
    },
    {
      route: "/path",
      title: "Product Enrichment",
      description: "Make Your Product Irresistible !",
    },
  ];

  const personalisation = [
    {
      route: "/path",
      title: "Smart Assistant",
      description: "Unlock Seamless Auto Classification Today !",
    },
    {
      route: "/path",
      title: "Recommendations",
      description: "Unlock Seamless Auto Classification Today !",
    },
  ];

  const data = [
    {
      route: "/classification",
      title: "Auto classification",
      description: "Unlock Seamless Auto classification Today",
    },
    {
      route: "/path",
      title: "Product Enrichment",
      description: "Make Your Product Irresistible !",
    },
    {
      route: "/path",
      title: "Product Enrichment",
      description: "Make Your Product Irresistible !",
    },
    {
      route: "/path",
      title: "Product Enrichment",
      description: "Make Your Product Irresistible !",
    },
    {
      route: "/path",
      title: "Product Enrichment",
      description: "Make Your Product Irresistible !",
    },
    {
      route: "/path",
      title: "Product Enrichment",
      description: "Make Your Product Irresistible !",
    },
    {
      route: "/path",
      title: "Product Enrichment",
      description: "Make Your Product Irresistible !",
    },
  ];
  return (
    <div className="home-container">
      <Navbar />
      <Sidebar />
      <main className="dashboard-content">
        <div className="dashboard-header">
          <h1>App Store</h1>
          <p>Place to Find your AI Agents & More</p>
        </div>

        <div className="dashboard-grid">
          <h2 className="dashboard-item-title">Your Apps</h2>
          <div className="dashboard-item">
            {yourApps &&
              yourApps.map((app, index) => (
                <Link to={app.route}>
                  <div className="dashboard-card" key={index}>
                    <h3>{app.title}</h3>
                    <p>{app.description}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        <div className="dashboard-grid">
          <h2 className="dashboard-item-title">Personalisations</h2>
          <div className="dashboard-item">
            {personalisation &&
              personalisation.map((item, index) => (
                <div className="dashboard-card" key={index}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
          </div>
        </div>

        <div className="dashboard-grid">
          <h2 className="dashboard-item-title">Data</h2>
          <div className="dashboard-item">
            {data &&
              data.map((item, index) => (
                <div className="dashboard-card" key={index}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
