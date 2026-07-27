import React from "react";
import "./Loader.css";

const Loader = ({ inline = false, fullHeight = false, text }) => {
  const classes = [
    "loader-container",
    inline ? "inline" : "",
    inline && fullHeight ? "full-height" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="loader-content">
        <div className="spinner-ring">
          <div className="spinner-inner"></div>
        </div>
        <div className="loader-text-container">
          <h2 className="loader-title">
            Job<span className="text-primary-blue">Grids</span>
          </h2>
          <div className="loader-subtitle">
            {text || (inline ? "Loading..." : "Connecting Talent with Opportunities")}
          </div>
          <div className="loader-progress-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
