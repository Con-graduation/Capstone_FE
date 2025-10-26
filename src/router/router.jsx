import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import Login from "../pages/login";
import MusicRecommend from "../pages/recommend/musicRecommend";
import RecommendResult from "../pages/recommend/recommendResult";
import Join from "../pages/join"
import MyPage from "../pages/mypage"
import Metronome from "../pages/soundSettings/metronome"
import Tuner from "../pages/soundSettings/tuner"
import Audio from "../pages/soundSettings/audio"
import Setting from "../pages/setting"
import Notification from "../pages/notification/notification"
import NotificationForm from "../pages/notification/notificationForm"
import PracticeStart from "../pages/practice/practiceStart"
import Practice from "../pages/practice/practice"
import FeedBack from "../pages/practice/feedBack"
import RoutineForm from "../pages/routineForm"

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/join" element={<Join />} />
      <Route path="/home" element={<Home />} />
      <Route path="/recommend" element={<MusicRecommend />} />
      <Route path="/recommend/result" element={<RecommendResult />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/settings/metronome" element={<Metronome />} />
      <Route path="/settings/tuner" element={<Tuner />} />
      <Route path="/settings/audio" element={<Audio />} />
      <Route path="/setting" element={<Setting />} />
      <Route path="/notification" element={<Notification />} />
      <Route path="/notification/form" element={<NotificationForm />} />
      <Route path="/practice/start" element={<PracticeStart />} />
      <Route path="/practice" element={<Practice />} />
      <Route path="/practice/feedBack" element={<FeedBack />} />
      <Route path="/routine/form" element={<RoutineForm />} />
    </Routes>
  );
}