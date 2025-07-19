import React from "react";

interface MessageProps {
  text: string;
  type?: "success" | "error" | "loading" | "info";
}

const Message: React.FC<MessageProps> = ({ text, type = "loading" }) => {
  return <div className={`message ${type}`}>{text}</div>;
};

export default Message;
