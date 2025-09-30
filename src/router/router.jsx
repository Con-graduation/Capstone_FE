import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import MusicRecommend from "../pages/recommend/musicRecommend";
import RecommendResult from "../pages/recommend/recommendResult";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/recommend" element={<MusicRecommend />} />
      <Route path="/recommend/result" element={<RecommendResult />} />
    </Routes>
  );
}