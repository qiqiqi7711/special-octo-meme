// 全局探索状态：主题地图、当前维度、证据缓存、反思记录，以及操作动作。
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  buildReport,
  generateTopicMap,
  loadEvidence,
} from "./services/explorationService";
import type {
  DimensionStatus,
  EvidenceCard,
  ExplorationReport,
  ExploreGoal,
  TopicMap,
} from "./types";

interface AppState {
  topicMap: TopicMap | null;
  activeDimensionId: string | null;
  evidenceByDimension: Record<string, EvidenceCard[]>;
  reflection: string;
  loadingEvidence: boolean;
  startExploration: (topic: string, goal: ExploreGoal) => Promise<void>;
  selectDimension: (id: string) => Promise<void>;
  loadMoreEvidence: (id: string) => Promise<void>;
  setReflection: (text: string) => void;
  buildReport: () => ExplorationReport;
  restart: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [topicMap, setTopicMap] = useState<TopicMap | null>(null);
  const [activeDimensionId, setActiveDimensionId] = useState<string | null>(null);
  const [evidenceByDimension, setEvidenceByDimension] = useState<Record<string, EvidenceCard[]>>({});
  const [offsets, setOffsets] = useState<Record<string, number>>({});
  const [reflection, setReflectionState] = useState("");
  const [loadingEvidence, setLoadingEvidence] = useState(false);

  const startExploration = useCallback(async (topic: string, goal: ExploreGoal) => {
    const tm = await generateTopicMap(topic, goal);
    setTopicMap(tm);
    setActiveDimensionId(null);
    setEvidenceByDimension({});
    setOffsets({});
    setReflectionState("");
  }, []);

  const loadMoreEvidence = useCallback(
    async (id: string) => {
      if (!topicMap) return;
      const dimension = topicMap.dimensions.find((d) => d.id === id);
      if (!dimension) return;
      setLoadingEvidence(true);
      try {
        const offset = offsets[id] ?? 0;
        const cards = await loadEvidence(topicMap.topic, dimension, offset);
        if (cards.length > 0) {
          setEvidenceByDimension((prev) => ({ ...prev, [id]: [...(prev[id] ?? []), ...cards] }));
          setOffsets((prev) => ({ ...prev, [id]: offset + cards.length }));
        }
      } finally {
        setLoadingEvidence(false);
      }
    },
    [topicMap, offsets]
  );

  const selectDimension = useCallback(
    async (id: string) => {
      if (!topicMap) return;
      setActiveDimensionId(id);
      setTopicMap((prev) => {
        if (!prev) return prev;
        const dim = prev.dimensions.find((d) => d.id === id);
        if (dim && dim.status === "not_started") {
          return {
            ...prev,
            dimensions: prev.dimensions.map((d) =>
              d.id === id ? { ...d, status: "explored" as DimensionStatus } : d
            ),
          };
        }
        return prev;
      });
      if (!evidenceByDimension[id] || evidenceByDimension[id].length === 0) {
        await loadMoreEvidence(id);
      }
    },
    [topicMap, evidenceByDimension, loadMoreEvidence]
  );

  const buildReportFn = useCallback((): ExplorationReport => {
    if (!topicMap) throw new Error("尚未开始探索");
    return buildReport({ topicMap, evidenceByDimension, reflection });
  }, [topicMap, evidenceByDimension, reflection]);

  const restart = useCallback(() => {
    setTopicMap(null);
    setActiveDimensionId(null);
    setEvidenceByDimension({});
    setOffsets({});
    setReflectionState("");
  }, []);

  const setReflection = useCallback((text: string) => setReflectionState(text), []);

  const value = useMemo<AppState>(
    () => ({
      topicMap,
      activeDimensionId,
      evidenceByDimension,
      reflection,
      loadingEvidence,
      startExploration,
      selectDimension,
      loadMoreEvidence,
      setReflection,
      buildReport: buildReportFn,
      restart,
    }),
    [
      topicMap,
      activeDimensionId,
      evidenceByDimension,
      reflection,
      loadingEvidence,
      startExploration,
      selectDimension,
      loadMoreEvidence,
      setReflection,
      buildReportFn,
      restart,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp 必须在 AppProvider 内使用");
  return ctx;
}
