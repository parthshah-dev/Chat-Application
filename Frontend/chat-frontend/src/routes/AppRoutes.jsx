import App from "../App";
import ChatPage from "../components/ChatPage";
import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
