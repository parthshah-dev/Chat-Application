import { createContext, useState, useContext } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [connected, setConnected] = useState(false);

  return (
    <ChatContext.Provider value={{ roomId, setRoomId, username, setUsername, connected, setConnected }}>
      {children}
    </ChatContext.Provider>
  );
};

const useChatContext = () => useContext(ChatContext);

export default useChatContext;
