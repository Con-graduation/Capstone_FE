import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ResponsiveWrapper from './components/ResponsiveWrapper';

import "./index.css";
import Router from "./router/router.jsx";
import Header from './components/header';
import MenuBar from './components/menuBar';


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
    <ResponsiveWrapper desktopTitle="홈페이지 - 모바일 전용">
      <Header />
      <Router />
      <MenuBar />
    </ResponsiveWrapper>
    </BrowserRouter>
  </StrictMode>
);
