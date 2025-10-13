import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import MusicRecommend from "../pages/recommend/musicRecommend";
import RecommendResult from "../pages/recommend/recommendResult";
import Join from "../pages/join"
import MyPage from "../pages/mypage"
import Metronome from "../pages/settings/metronome"
import Tuner from "../pages/settings/tuner"
import Audio from "../pages/settings/audio"

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/recommend" element={<MusicRecommend />} />
      <Route path="/recommend/result" element={<RecommendResult />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/settings/metronome" element={<Metronome />} />
      <Route path="/settings/tuner" element={<Tuner />} />
      <Route path="/settings/audio" element={<Audio />} />
    </Routes>
  );
}