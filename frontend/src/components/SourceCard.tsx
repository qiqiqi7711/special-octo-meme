import type { SourceDocument } from "../types";
import EvidenceTypeBadge from "./EvidenceTypeBadge";

interface Props {
  doc: SourceDocument;
}

// 可复用资料卡片：标题 / 来源 / 摘要 / 发布日期 / 资料类型 / 原文链接。
// 对缺摘要、缺日期、缺链接分别给出合理兜底；mock 资料显式标注“演示资料”。
export default function SourceCard({ doc }: Props) {
  const hasUrl = doc.url.trim().length > 0;

  return (
    <article className="glass rounded-control p-5 transition hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-ink-title">{doc.title}</h3>
        <div className="flex shrink-0 items-center gap-2">
          {doc.isMock && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              演示资料
            </span>
          )}
          <EvidenceTypeBadge type={doc.sourceType} />
        </div>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-ink-body">
        {doc.snippet.trim() ? doc.snippet : "暂无摘要。"}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
        <span>来源：{doc.sourceName}</span>
        <span>{doc.publishedAt ? doc.publishedAt : "发布日期未知"}</span>
      </div>

      <div className="mt-3">
        {hasUrl ? (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand-600 hover:text-brand-800 hover:underline"
          >
            查看原文 ↗
          </a>
        ) : (
          <span className="text-sm text-ink-muted">无可用链接</span>
        )}
      </div>
    </article>
  );
}
