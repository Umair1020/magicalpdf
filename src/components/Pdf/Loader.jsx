import React from "react";
import "./pdf.css";
const Loader = ({ isLoading }) => {
  if (!isLoading) return null;
  return (
    <div class="container1">
      <div class="spinner1"></div>
    </div>
  );
};

export default Loader;
