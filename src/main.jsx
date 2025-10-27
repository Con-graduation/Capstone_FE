import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, useLocation } from "react-router-dom";
import ResponsiveWrapper from './components/ResponsiveWrapper';

import "./index.css";
import "react-datepicker/dist/react-datepicker.css";
import Router from "./router/router.jsx";
import Header from './components/header';
import MenuBar from './components/menuBar';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';
  const isJoinPage = location.pathname === '/join';
  const isPracticePage = location.pathname === '/practice';

  return (
    <ResponsiveWrapper desktopTitle="홈페이지 - 모바일 전용">
      {!isLoginPage && !isJoinPage && !isPracticePage && <Header />}
      <Router />
      {!isLoginPage && !isJoinPage && !isPracticePage && <MenuBar />}
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
