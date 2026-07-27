import React from "react";
import "./EmptyState.css";

const EmptyState = ({ 
  icon: Icon, 
  title = "No results found", 
  description = "Try adjusting your search keywords or resetting your filters.", 
  actionText, 
  onAction 
}) => {
  return (
    <div className="empty-state-card border rounded-4 bg-white text-center p-5 my-4 mx-auto w-100 shadow-sm">
      <div className="empty-state-icon-container mb-4">
        {Icon ? (
          <Icon className="empty-state-icon text-primary" size={40} />
        ) : (
          <div className="empty-state-dot"></div>
        )}
      </div>
      <h4 className="fw-bold mb-2 text-dark">{title}</h4>
      <p className="text-muted mx-auto mb-4 fs-14 empty-state-desc" style={{ maxWidth: "440px" }}>
        {description}
      </p>
      {actionText && onAction && (
        <button 
          onClick={onAction} 
          className="btn bg-blue px-4 py-2 fw-semibold fs-14 rounded-pill empty-state-btn shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
