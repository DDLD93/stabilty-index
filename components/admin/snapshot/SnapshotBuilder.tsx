"use client";

/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  SnapshotModel,
  SnapshotListItem,
  SnapshotApiResponse,
  InstitutionSpotlight,
  StreetPulseSpotlight,
  SourceRef,
  defaultSnapshot,
  bulletsToKeyPointsHtml,
  hasError,
  hasSnapshot,
} from "./types";
import { SnapshotSidebar } from "./SnapshotSidebar";
import { SnapshotOverview } from "./SnapshotOverview";
import { SnapshotPillars } from "./SnapshotPillars";
import { SnapshotHighlights } from "./SnapshotHighlights";
import { SnapshotSentiment } from "./SnapshotSentiment";
import { SnapshotSources } from "./SnapshotSources";

type TabId = "overview" | "pillars" | "highlights" | "sentiment" | "sources";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <OverviewIcon /> },
  { id: "pillars", label: "Pillars", icon: <PillarsIcon /> },
  { id: "highlights", label: "Spotlights", icon: <HighlightsIcon /> },
  { id: "sentiment", label: "Sentiment", icon: <SentimentIcon /> },
  { id: "sources", label: "Sources", icon: <SourcesIcon /> },
];

export function SnapshotBuilder() {
  const [list, setList] = useState<SnapshotListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | "new">("new");
  const [model, setModel] = useState<SnapshotModel>({ ...defaultSnapshot });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const locked = !!model.isLocked;
  const published = !!model.publishedAt;

  // Validation & completion status (keyPointsHtml: treat as complete if it has any text content)
  const hasKeyPoints = (html: string) => (html || "").replace(/<[^>]+>/g, "").trim().length >= 1;
  const completionStatus = useMemo(() => {
    const checks = [
      model.period.trim().length > 2,
      model.overallNarrative.trim().length > 0,
      model.pillarScores.pillars.every((p) => p.title && p.summary),
      hasKeyPoints(model.stateSpotlightContent.keyPointsHtml),
      model.publicSentimentSummary.topMood.trim().length > 0,
    ];
    return {
      completed: checks.filter(Boolean).length,
      total: checks.length,
    };
  }, [model]);

  const canSave = useMemo(() => {
    return (
      model.period.trim().length > 2 &&
      model.overallNarrative.trim().length > 0 &&
      model.pillarScores.pillars.length === 5 &&
      hasKeyPoints(model.stateSpotlightContent.keyPointsHtml)
    );
  }, [model]);

  // API functions
  const loadList = useCallback(async () => {
    const res = await fetch("/api/admin/snapshot?take=20");
    if (!res.ok) return;
    const data = (await res.json()) as { items: SnapshotListItem[] };
    setList(data.items);
  }, []);

  const loadOne = useCallback(async (id: string) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const res = await fetch(`/api/admin/snapshot/${id}`);
    setLoading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Failed to load snapshot.");
      return;
    }
    const data = (await res.json()) as SnapshotApiResponse;
    if (!("snapshot" in data)) {
      setError(data.error ?? "Failed to load snapshot.");
      return;
    }
    const snap = data.snapshot;

    const inst = (snap.institutionSpotlightContent as unknown as (InstitutionSpotlight & { bullets?: string[] }) | null) ?? {
      institution: "",
      summary: "",
      keyPointsHtml: "",
    };
    const instNorm =
      typeof inst === "object" && inst !== null
        ? {
            institution: String(inst.institution ?? ""),
            summary: String(inst.summary ?? ""),
            keyPointsHtml:
              typeof (inst as { keyPointsHtml?: string }).keyPointsHtml === "string"
                ? (inst as { keyPointsHtml: string }).keyPointsHtml
                : bulletsToKeyPointsHtml(Array.isArray(inst.bullets) ? inst.bullets : []),
          }
        : { institution: "", summary: "", keyPointsHtml: "" };

    const stateRaw = (snap.stateSpotlightContent as unknown as { state?: string; score?: number; bullets?: string[]; keyPointsHtml?: string }) ?? {};
    const stateNorm = {
      state: String(stateRaw.state ?? ""),
      score: Number(stateRaw.score) || 0,
      keyPointsHtml:
        typeof stateRaw.keyPointsHtml === "string"
          ? stateRaw.keyPointsHtml
          : bulletsToKeyPointsHtml(Array.isArray(stateRaw.bullets) ? stateRaw.bullets : []),
    };

    const streetPulseRaw = (snap.streetPulseSpotlightContent as unknown as StreetPulseSpotlight | null) ?? null;
    const streetPulseNorm: StreetPulseSpotlight =
      typeof streetPulseRaw === "object" && streetPulseRaw !== null
        ? {
            title: String(streetPulseRaw.title ?? ""),
            summary: String(streetPulseRaw.summary ?? ""),
            keyPointsHtml: String(streetPulseRaw.keyPointsHtml ?? ""),
          }
        : { title: "", summary: "", keyPointsHtml: "" };

    const sr = (snap.sourcesReferences as unknown as SourceRef[] | null) ?? [];
    const srNorm = Array.isArray(sr)
      ? sr
          .filter((x) => x && typeof x === "object" && "label" in x && "url" in x)
          .map((x) => ({ label: String(x.label), url: String(x.url) }))
      : [];

    setModel({
      id: snap.id,
      cycleId: snap.cycleId ?? null,
      period: snap.period,
      overallScore: snap.overallScore,
      overallNarrative: snap.overallNarrative,
      pillarScores: (snap.pillarScores as unknown as SnapshotModel["pillarScores"]) ?? { pillars: [] },
      stateSpotlightContent: stateNorm,
      institutionSpotlightContent: instNorm,
      streetPulseSpotlightContent: streetPulseNorm,
      sourcesReferences: srNorm,
      publicSentimentSummary:
        (snap.publicSentimentSummary as unknown as SnapshotModel["publicSentimentSummary"]) ?? {
          topWords: [],
          averagePublicScore: 0,
          topMood: "",
        },
      publishedAt: snap.publishedAt ?? null,
      isLocked: snap.isLocked ?? false,
    });
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    if (selectedId === "new") {
      setModel({ ...defaultSnapshot });
      return;
    }
    void loadOne(selectedId);
  }, [selectedId, loadOne]);

  const save = useCallback(async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    const res = await fetch("/api/admin/snapshot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: model.id,
        cycleId: model.cycleId,
        period: model.period,
        overallScore: model.overallScore,
        overallNarrative: model.overallNarrative,
        pillarScores: model.pillarScores,
        stateSpotlightContent: model.stateSpotlightContent,
        institutionSpotlightContent: model.institutionSpotlightContent,
        streetPulseSpotlightContent: model.streetPulseSpotlightContent,
        sourcesReferences: model.sourcesReferences,
        publicSentimentSummary: model.publicSentimentSummary,
      }),
    });
    setLoading(false);

    const data = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      setError(hasError(data) ? data.error : "Save failed.");
      return;
    }

    setSuccess("Saved successfully.");
    if (hasSnapshot<{ id: string; publishedAt: string | null; isLocked: boolean }>(data)) {
      setModel((m) => ({
        ...m,
        id: data.snapshot.id,
        publishedAt: data.snapshot.publishedAt,
        isLocked: data.snapshot.isLocked,
      }));
      await loadList();
      setSelectedId(data.snapshot.id);
    }
  }, [model, loadList]);

  const publish = useCallback(async () => {
    if (!model.id) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    const res = await fetch(`/api/admin/snapshot/${model.id}/publish`, { method: "POST" });
    setLoading(false);
    const data = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      setError(hasError(data) ? data.error : "Publish failed.");
      return;
    }
    setSuccess("Published successfully.");
    setModel((m) => ({
      ...m,
      publishedAt: hasSnapshot<{ publishedAt: string }>(data)
        ? data.snapshot.publishedAt
        : new Date().toISOString(),
    }));
    await loadList();
  }, [model.id, loadList]);

  const lock = useCallback(async () => {
    if (!model.id) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    const res = await fetch(`/api/admin/snapshot/${model.id}/lock`, { method: "POST" });
    setLoading(false);
    const data = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      setError(hasError(data) ? data.error : "Lock failed.");
      return;
    }
    setSuccess("Locked (now immutable).");
    setModel((m) => ({ ...m, isLocked: true }));
    await loadList();
  }, [model.id, loadList]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      {/* Sidebar */}
      <SnapshotSidebar
        list={list}
        selectedId={selectedId}
        onSelect={setSelectedId}
        model={model}
        loading={loading}
        locked={locked}
        published={published}
        canSave={canSave}
        error={error}
        success={success}
        onSave={save}
        onPublish={publish}
        onLock={lock}
        completionStatus={completionStatus}
      />

      {/* Main Content Area */}
      <div className="min-w-0 flex-1">
        {/* Tab Navigation */}
        <nav
          role="tablist"
          aria-label="Snapshot sections"
          className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-black/10 bg-white p-1.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-black/10"
          onKeyDown={(e) => {
            const idx = tabs.findIndex((t) => t.id === activeTab);
            if (e.key === "ArrowRight" && idx < tabs.length - 1) {
              setActiveTab(tabs[idx + 1].id);
            } else if (e.key === "ArrowLeft" && idx > 0) {
              setActiveTab(tabs[idx - 1].id);
            }
          }}
        >
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--nsi-gold)] focus-visible:ring-offset-1 ${
                activeTab === tab.id
                  ? "bg-[color:var(--nsi-green)] text-white shadow-sm"
                  : "text-[color:var(--nsi-ink-soft)] hover:bg-black/5 hover:text-[color:var(--nsi-ink)]"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={activeTab}
          className="admin-card"
        >
          <div className="mb-6 border-b border-black/5 pb-4">
            <h2 className="font-serif text-xl font-semibold text-[color:var(--nsi-ink)]">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <p className="mt-1 text-sm text-[color:var(--nsi-ink-soft)]">
              {activeTab === "overview" && "Basic information about this snapshot period"}
              {activeTab === "pillars" && "Define scores for each stability pillar"}
              {activeTab === "highlights" && "Featured state and institution analysis"}
              {activeTab === "sentiment" && "Public mood and sentiment data"}
              {activeTab === "sources" && "Verifiable references and data sources"}
            </p>
          </div>

          {/* Tab content with fade animation */}
          <div key={activeTab} className="animate-in fade-in duration-200">
            {activeTab === "overview" && (
              <SnapshotOverview model={model} setModel={setModel} locked={locked} />
            )}
            {activeTab === "pillars" && (
              <SnapshotPillars model={model} setModel={setModel} locked={locked} />
            )}
            {activeTab === "highlights" && (
              <SnapshotHighlights model={model} setModel={setModel} locked={locked} />
            )}
            {activeTab === "sentiment" && (
              <SnapshotSentiment model={model} setModel={setModel} locked={locked} />
            )}
            {activeTab === "sources" && (
              <SnapshotSources model={model} setModel={setModel} locked={locked} />
            )}
          </div>
        </div>

        {/* Navigation Hints */}
        <div className="mt-4 flex items-center justify-between text-sm text-[color:var(--nsi-ink-soft)]">
          <button
            type="button"
            onClick={() => {
              const idx = tabs.findIndex((t) => t.id === activeTab);
              if (idx > 0) setActiveTab(tabs[idx - 1].id);
            }}
            disabled={activeTab === tabs[0].id}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 transition-colors hover:bg-black/5 disabled:opacity-40"
          >
            <ChevronLeftIcon />
            Previous
          </button>
          <span>
            {tabs.findIndex((t) => t.id === activeTab) + 1} of {tabs.length}
          </span>
          <button
            type="button"
            onClick={() => {
              const idx = tabs.findIndex((t) => t.id === activeTab);
              if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1].id);
            }}
            disabled={activeTab === tabs[tabs.length - 1].id}
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 transition-colors hover:bg-black/5 disabled:opacity-40"
          >
            Next
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

// Tab Icons
function OverviewIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
    </svg>
  );
}

function PillarsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function HighlightsIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  );
}

function SentimentIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
    </svg>
  );
}

function SourcesIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
