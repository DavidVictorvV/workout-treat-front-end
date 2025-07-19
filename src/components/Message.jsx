import React from "react";

const Message = ({ text, type = "loading" }) => {
  return <div className={`message ${type}`}>{text}</div>;
};

export default Message;
