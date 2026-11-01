import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import DirectionPage from "./pages/DirectionPage";
import EvidencePage from "./pages/EvidencePage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import ReportPage from "./pages/ReportPage";
import { ButterflyIcon, EyeIcon, NodesIcon, ScaleIcon } from "./components/Icon";
import { useApp } from "./store";

export default function App() {
  const navigate = useNavigate();
  const { topicMap, restart } = useApp();

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
      isActive
        ? "bg-brand-600 text-white shadow-button"
        : "text-ink-muted hover:bg-white/70 hover:text-brand-700"
    }`;

  function handleRestart() {
    restart();
    navigate("/");
  }

  return (
    <div className="flex min-h-screen flex-col text-ink-body">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/55 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] w-full max-w-content items-center justify-between px-[clamp(24px,5vw,80px)]">
          <NavLink to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-button">
              <ButterflyIcon className="h-6 w-6" strokeWidth={2} />
            </span>
            <span className="flex items-baseline gap-2">
              <span className="text-lg font-semibold tracking-tight text-ink-title">破茧</span>
              <span className="hidden text-xs text-ink-muted sm:inline">信息视野探索</span>
            </span>
          </NavLink>
          <nav className="flex items-center gap-1.5">
            <NavLink to="/map" className={navClass}>
              <NodesIcon className="h-4 w-4" />
              探索地图
            </NavLink>
            <NavLink to="/evidence" className={navClass}>
              <EyeIcon className="h-4 w-4" />
              证据
            </NavLink>
            <NavLink to="/report" className={navClass}>
              <ScaleIcon className="h-4 w-4" />
              报告
            </NavLink>
            {topicMap && (
              <button
                onClick={handleRestart}
                className="ml-2 rounded-full border border-white/70 bg-white/70 px-3.5 py-1.5 text-sm text-ink-body shadow-sm transition hover:border-brand-200 hover:text-brand-700 active:scale-[0.98]"
              >
                重新开始
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-content flex-1 px-[clamp(24px,5vw,80px)] py-8 sm:py-10">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/direction/:id" element={<DirectionPage />} />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="/report" element={<ReportPage />} />
        </Routes>
      </main>

      <footer className="mx-auto w-full max-w-content px-[clamp(24px,5vw,80px)] py-8 text-center text-xs text-ink-muted">
        破茧 · 信息视野探索工具（竞赛演示版）
      </footer>
    </div>
  );
}
