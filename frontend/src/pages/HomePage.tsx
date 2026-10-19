import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { fetchHealth } from "../api";
import { GOAL_HINTS, GOAL_LABELS } from "../labels";
import { EXAMPLE_TOPICS } from "../services/mockData";
import { useApp } from "../store";
import type { ExploreGoal } from "../types";

const GOALS = Object.keys(GOAL_LABELS) as ExploreGoal[];

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
    <div className="mx-auto max-w-3xl py-12 sm:py-20">
      <div className="text-center">
        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          信息探索
        </span>
        <h1 className="mt-4 bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-5xl font-bold text-transparent">
          破茧
        </h1>
        <p className="mt-3 text-lg text-slate-600">发现你尚未探索的信息维度</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
          {health === "checking" && (
            <>
              <span className="h-2 w-2 rounded-full bg-slate-300" /> 正在检测后端服务…
            </>
          )}
          {health === "ok" && (
            <>
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> 后端服务正常
            </>
          )}
          {health === "down" && (
            <>
              <span className="h-2 w-2 rounded-full bg-amber-500" /> 后端服务未连接（演示数据模式）
            </>
          )}
          <button
            type="button"
            onClick={() => void checkHealth()}
            className="ml-1 text-indigo-600 hover:underline"
          >
            重试
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => handleStart(e)}
        className="mt-10 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">输入一个话题</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：短视频对青少年的影响"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">探索目标</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGoal(g)}
                className={`rounded-xl border px-4 py-2.5 text-left text-sm transition ${
                  goal === g
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="font-medium">{GOAL_LABELS[g]}</div>
                <div className="mt-0.5 text-xs text-slate-500">{GOAL_HINTS[g]}</div>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "正在生成探索地图…" : "开始探索"}
        </button>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>

      <div className="mt-8 text-center">
        <h2 className="text-sm font-medium text-slate-500">试试这些示例主题</h2>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {EXAMPLE_TOPICS.map((ex) => (
            <button
              key={ex}
              disabled={loading}
              onClick={() => handleStart(undefined, ex)}
              className="rounded-full border border-slate-300 px-4 py-1.5 text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
