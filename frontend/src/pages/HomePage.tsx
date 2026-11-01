import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHealth } from "../api";
import { GOAL_LABELS } from "../labels";
import { EXAMPLE_TOPICS } from "../services/mockData";
import { useApp } from "../store";
import type { ExploreGoal } from "../types";
import { ArrowRightIcon, SparkleIcon } from "../components/Icon";
import titlePojian from "../assets/title_pojian_purple.svg";

// 四个探索目标卡片：标题 + 副文案
const GOAL_CARDS: { goal: ExploreGoal; sub: string; num: string }[] = [
  { goal: "understand_mechanism", sub: "探索背后的原理", num: "01" },
  { goal: "understand_perspectives", sub: "看见更多可能", num: "02" },
  { goal: "discover_directions", sub: "探索未知领域", num: "03" },
  { goal: "compare_evidence", sub: "寻找更可靠的答案", num: "04" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { startExploration } = useApp();
  const [topic, setTopic] = useState("");
  const [goal, setGoal] = useState<ExploreGoal>("understand_mechanism");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [health, setHealth] = useState<"checking" | "ok" | "down">("checking");

  async function checkHealth() {
    setHealth("checking");
    try {
      await fetchHealth();
      setHealth("ok");
    } catch {
      setHealth("down");
    }
  }

  useEffect(() => {
    void checkHealth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleStart(e?: FormEvent, preset?: string) {
    e?.preventDefault();
    const t = (preset ?? topic).trim();
    if (!t) {
      setError("请输入一个话题，例如：短视频对青少年的影响");
      return;
    }
    if (t.length > 200) {
      setError("话题过长，请控制在 200 字以内");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await startExploration(t, goal);
      navigate("/map");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-content pb-4">
      {/* ===== Hero ===== */}
      <div className="pt-6 text-center sm:pt-10">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200/70 bg-white/60 px-3 py-1 text-xs font-medium text-brand-700 backdrop-blur">
          <SparkleIcon className="h-3.5 w-3.5" />
          信息探索
        </span>

        <img
          src={titlePojian}
          alt="破茧"
          className="mx-auto mt-4 h-auto w-[300px] select-none sm:w-[420px]"
          style={{ filter: "drop-shadow(0 2px 24px rgba(255,255,255,0.85))" }}
        />

        <p className="mx-auto mt-3 max-w-xl text-lg text-ink-body sm:text-xl">
          走出算法的回音壁，探索未知的信息世界。
        </p>

        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.35em] text-brand-500">
          Break the Bubble · Explore Beyond
        </p>

        {/* 已知 → 探索 → 未知 */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm">
          <span className="rounded-full bg-white/60 px-4 py-1.5 text-ink-muted shadow-sm backdrop-blur">
            已知
          </span>
          <span className="text-brand-400">→</span>
          <span className="rounded-full bg-brand-600 px-4 py-1.5 font-medium text-white shadow-button">
            探索
          </span>
          <span className="text-brand-400">→</span>
          <span className="rounded-full bg-white/60 px-4 py-1.5 text-ink-muted shadow-sm backdrop-blur">
            未知
          </span>
        </div>
      </div>

      {/* ===== 搜索 + 目标 + 开始 ===== */}
      <form onSubmit={(e) => handleStart(e)} className="mx-auto mt-10 max-w-3xl">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="请输入你想探索的主题，例如：人工智能教育的影响"
          className="w-full rounded-card border border-white/70 bg-white/75 px-5 py-4 text-base text-ink-body shadow-card backdrop-blur-xl transition focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-200/60"
          maxLength={200}
        />

        <p className="mt-8 text-center text-sm font-medium text-ink-muted">选择探索目标</p>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GOAL_CARDS.map((c) => {
            const active = goal === c.goal;
            return (
              <button
                key={c.goal}
                type="button"
                onClick={() => setGoal(c.goal)}
                className={`group rounded-card border p-4 text-left transition ${
                  active
                    ? "border-brand-400/70 bg-white/85 shadow-button ring-2 ring-brand-200/60"
                    : "border-white/70 bg-white/60 shadow-card hover:border-brand-300/70 hover:bg-white/80"
                } backdrop-blur-xl`}
              >
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold ${
                    active ? "bg-brand-600 text-white" : "bg-brand-100 text-brand-700"
                  }`}
                >
                  {c.num}
                </span>
                <div
                  className={`mt-3 font-medium ${active ? "text-ink-title" : "text-ink-body"}`}
                >
                  {GOAL_LABELS[c.goal]}
                </div>
                <div className="mt-0.5 text-xs text-ink-muted">{c.sub}</div>
              </button>
            );
          })}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-4 text-base font-semibold text-white shadow-button transition hover:from-brand-700 hover:to-brand-600 active:scale-[0.99] disabled:opacity-50"
        >
          {loading ? "正在生成探索地图…" : "开始探索"}
          {!loading && <ArrowRightIcon className="h-5 w-5" />}
        </button>

        {error && <p className="mt-3 text-center text-sm text-red-600">{error}</p>}
      </form>

      {/* ===== 示例主题 + 后端状态 ===== */}
      <div className="mt-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-3 py-1 text-xs text-ink-muted shadow-sm backdrop-blur">
          {health === "checking" && (
            <>
              <span className="h-2 w-2 rounded-full bg-slate-300" /> 正在检测后端服务…
            </>
          )}
          {health === "ok" && (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> 后端服务正常
            </>
          )}
          {health === "down" && (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-400" /> 后端服务未连接（演示数据模式）
            </>
          )}
          <button
            type="button"
            onClick={() => void checkHealth()}
            className="text-brand-600 underline underline-offset-2 transition hover:text-brand-800"
          >
            重试
          </button>
        </div>

        <h2 className="mt-6 text-sm font-medium text-ink-muted">试试这些示例主题</h2>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {EXAMPLE_TOPICS.map((ex) => (
            <button
              key={ex}
              disabled={loading}
              onClick={() => handleStart(undefined, ex)}
              className="rounded-full border border-brand-200/70 bg-white/70 px-4 py-1.5 text-sm text-ink-body shadow-sm backdrop-blur transition hover:border-brand-400 hover:bg-white hover:text-brand-700 disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
