import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}