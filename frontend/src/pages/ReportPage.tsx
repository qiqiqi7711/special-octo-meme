import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { useApp } from "../store";

export default function ReportPage() {
  const navigate = useNavigate();
  const { topicMap, buildReport, setReflection, reflection, selectDimension, restart } = useApp();

  const report = useMemo(() => {
    if (!topicMap) return null;
    try {
      return buildReport();
    } catch {
      return null;
    }
  }, [topicMap, buildReport]);

  if (!topicMap || !report) {
    return (
      <div className="py-24 text-center">
        <p className="text-slate-500">尚无探索记录，无法生成报告。</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
        >
          去首页开始
        </button>
      </div>
    );
  }

  const maxCount = Math.max(1, ...report.sourceDistribution.map((s) => s.count));

  async function handleExplore(id: string) {
    await selectDimension(id);
    navigate("/evidence");
  }

  function handleRestart() {
    restart();
    navigate("/");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">探索报告</h1>
          <p className="mt-1 text-sm text-slate-500">主题：{report.topic}</p>
        </div>
        <button
          onClick={handleRestart}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          重新开始
        </button>
      </div>

      <Section title="已探索的维度">
        {report.exploredDimensions.length === 0 ? (
          <p className="text-sm text-slate-500">尚未探索任何维度。</p>
        ) : (
          <ul className="space-y-2">
            {report.exploredDimensions.map((d) => (
              <li key={d.id} className="flex items-center justify-between rounded-lg bg-white p-3">
                <span className="font-medium">{d.title}</span>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="尚未探索的相关维度">
        {report.unexploredDimensions.length === 0 ? (
          <p className="text-sm text-slate-500">已覆盖全部维度。</p>
        ) : (
          <ul className="space-y-2">
            {report.unexploredDimensions.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-2 rounded-lg bg-white p-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{d.title}</span>
                  <StatusBadge status={d.status} />
                </div>
                <button
                  onClick={() => handleExplore(d.id)}
                  className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm text-indigo-700 hover:bg-indigo-100"
                >
                  去探索
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="来源分布">
        {report.sourceDistribution.length === 0 ? (
          <p className="text-sm text-slate-500">暂无已加载证据。</p>
        ) : (
          <div className="space-y-2">
            {report.sourceDistribution.map((s) => (
              <div key={s.type} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm text-slate-600">{s.label}</span>
                <div className="h-4 flex-1 overflow-hidden rounded bg-slate-100">
                  <div
                    className="h-4 rounded bg-indigo-500"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-medium text-slate-700">{s.count}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="可能重复的材料">
        {report.possibleDuplicates.length === 0 ? (
          <p className="text-sm text-slate-500">未发现明显重复。</p>
        ) : (
          <ul className="space-y-2">
            {report.possibleDuplicates.map((d, i) => (
              <li key={i} className="rounded-lg bg-white p-3 text-sm">
                <p className="font-medium text-slate-800">{d.title}</p>
                <p className="mt-0.5 text-slate-500">{d.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="尚待核实的问题">
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          {report.openQuestions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </Section>

      <Section title="我的反思记录">
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={4}
          placeholder="记录你在这次探索中的想法、判断或新问题…"
          className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        />
      </Section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/map")}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          返回地图
        </button>
        <button
          onClick={() => navigate("/map")}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          继续探索 →
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-medium text-slate-500">{title}</h2>
      {children}
    </section>
  );
}
