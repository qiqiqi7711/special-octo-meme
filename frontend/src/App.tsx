import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import DirectionPage from "./pages/DirectionPage";
import EvidencePage from "./pages/EvidencePage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import ReportPage from "./pages/ReportPage";
import { useApp } from "./store";

export default function App() {
  const navigate = useNavigate();
  const { topicMap, restart } = useApp();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${
      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
    }`;

  function handleRestart() {
    restart();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-white">
              破
            </span>
            <span className="text-lg font-semibold">破茧</span>
          </NavLink>
          <nav className="flex items-center gap-1">
            <NavLink to="/map" className={navClass}>
              探索地图
            </NavLink>
            <NavLink to="/evidence" className={navClass}>
              证据
            </NavLink>
            <NavLink to="/report" className={navClass}>
              报告
            </NavLink>
            {topicMap && (
              <button
                onClick={handleRestart}
                className="ml-2 rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
              >
                重新开始
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/direction/:id" element={<DirectionPage />} />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>

      <footer className="mx-auto w-full max-w-5xl px-4 py-8 text-center text-xs text-slate-400">
        破茧 · 信息视野探索工具（竞赛演示版）
      </footer>
    </div>
  );
}
