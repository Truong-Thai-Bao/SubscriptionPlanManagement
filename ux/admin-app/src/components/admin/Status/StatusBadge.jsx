// src/components/Shared/StatusBadge.jsx
import React from "react";
import "../../../styles/common-table.css";

const StatusBadge = ({ status }) => {
  if (status === 1) {
    return <span className="badge badge-active">Activated</span>;
  }
  return <span className="badge badge-inactive">Deactivated</span>;
};

export default StatusBadge;
