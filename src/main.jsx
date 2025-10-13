import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import ResponsiveWrapper from './components/ResponsiveWrapper';

import "./index.css";
import Router from "./router/router.jsx";
import Header from './components/header';
import MenuBar from './components/menuBar';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isJoinPage = location.pathname === '/join';

  return (
    <ResponsiveWrapper desktopTitle="홈페이지 - 모바일 전용">
      {!isLoginPage && !isJoinPage && <Header />}
      <Router />
      {!isLoginPage && !isJoinPage && <MenuBar />}
    </ResponsiveWrapper>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
