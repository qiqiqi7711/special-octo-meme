import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import { ArrowRightIcon } from "../components/Icon";
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
        <p className="text-ink-muted">尚无探索记录，无法生成报告。</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 rounded-full bg-brand-600 px-4 py-2 text-white shadow-button transition hover:bg-brand-700 active:scale-[0.98]"
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
          <h1 className="text-2xl font-bold text-ink-title">探索报告</h1>
          <p className="mt-1 text-sm text-ink-muted">主题：{report.topic}</p>
        </div>
        <button
          onClick={handleRestart}
          className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-ink-body shadow-sm backdrop-blur transition hover:border-brand-200 hover:bg-white active:scale-[0.98]"
        >
          重新开始
        </button>
      </div>

      <Section title="已探索的维度">
        {report.exploredDimensions.length === 0 ? (
          <p className="text-sm text-ink-muted">尚未探索任何维度。</p>
        ) : (
          <ul className="space-y-2">
            {report.exploredDimensions.map((d) => (
              <li key={d.id} className="glass flex items-center justify-between rounded-control p-3">
                <span className="font-medium text-ink-title">{d.title}</span>
                <StatusBadge status={d.status} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="尚未探索的相关维度">
        {report.unexploredDimensions.length === 0 ? (
          <p className="text-sm text-ink-muted">已覆盖全部维度。</p>
        ) : (
          <ul className="space-y-2">
            {report.unexploredDimensions.map((d) => (
              <li key={d.id} className="glass flex items-center justify-between gap-2 rounded-control p-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-ink-title">{d.title}</span>
                  <StatusBadge status={d.status} />
                </div>
                <button
                  onClick={() => handleExplore(d.id)}
                  className="rounded-full border border-brand-200/70 bg-brand-50/80 px-3 py-1 text-sm text-brand-700 backdrop-blur transition hover:bg-brand-100 active:scale-[0.98]"
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
          <p className="text-sm text-ink-muted">暂无已加载证据。</p>
        ) : (
          <div className="space-y-2">
            {report.sourceDistribution.map((s) => (
              <div key={s.type} className="flex items-center gap-3">
                <span className="w-20 shrink-0 text-sm text-ink-body">{s.label}</span>
                <div className="h-4 flex-1 overflow-hidden rounded bg-white/70">
                  <div
                    className="h-4 rounded bg-gradient-to-r from-brand-500 to-brand-400"
                    style={{ width: `${(s.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right text-sm font-medium text-ink-title">{s.count}</span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="可能重复的材料">
        {report.possibleDuplicates.length === 0 ? (
          <p className="text-sm text-ink-muted">未发现明显重复。</p>
        ) : (
          <ul className="space-y-2">
            {report.possibleDuplicates.map((d, i) => (
              <li key={i} className="glass rounded-control p-3 text-sm">
                <p className="font-medium text-ink-title">{d.title}</p>
                <p className="mt-0.5 text-ink-muted">{d.reason}</p>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="尚待核实的问题">
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-body">
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
          className="w-full rounded-control border border-white/70 bg-white/75 p-3 text-sm text-ink-body shadow-sm backdrop-blur transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200/60"
        />
      </Section>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate("/map")}
          className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-ink-body shadow-sm backdrop-blur transition hover:border-brand-200 hover:bg-white active:scale-[0.98]"
        >
          返回地图
        </button>
        <button
          onClick={() => navigate("/map")}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-button transition hover:bg-brand-700 active:scale-[0.98]"
        >
          继续探索 <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-sm font-medium text-ink-muted">{title}</h2>
      {children}
    </section>
  );
}
