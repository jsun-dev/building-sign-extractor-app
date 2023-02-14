import React from "react";

const DigitsOverlay = (props) => {
  const style = {
    background: "black",
    margin: "0px",
    padding: "8px",
    position: "absolute",
    boxShadow: "0 0 8px 1px rgba(0, 0, 0, 0.5)",
    fontWeight: "bold",
    display: props.enabled ? "block" : "none",
    left: props.enabled && props.overlayPosition.x,
    top: props.enabled && props.overlayPosition.y,
  };

  return <span style={style}>{props.text}</span>;
};

export default DigitsOverlay;
