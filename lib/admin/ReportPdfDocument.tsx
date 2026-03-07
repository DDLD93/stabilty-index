import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { SubmissionAnalyticsResult } from "./submissionAnalytics";
import { PILLARS } from "@/lib/constants";

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 8,
    color: "#666",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    color: "#444",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    gap: 8,
  },
  scoreBig: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#166534",
  },
  twoCol: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 8,
  },
  col: {
    flex: 1,
  },
  pill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 2,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  barBg: {
    height: 6,
    backgroundColor: "#eee",
    borderRadius: 2,
    marginTop: 2,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#166534",
    borderRadius: 2,
  },
});

type ReportPdfDocumentProps = {
  data: SubmissionAnalyticsResult;
  monthYear: string;
  generatedAt: string;
};

export function ReportPdfDocument({
  data,
  monthYear,
  generatedAt,
}: ReportPdfDocumentProps) {
  const maxBucket = Math.max(
    data.scoreDistribution["1-3"] ?? 0,
    data.scoreDistribution["4-6"] ?? 0,
    data.scoreDistribution["7-10"] ?? 0,
    1
  );
  const stateEntries = Object.entries(data.spotlightByState)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const tagEntries = Object.entries(data.spotlightByTag)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const topWords = data.oneWordCounts.slice(0, 12);
  const moodEntries = Object.entries(data.moodDistribution)
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Stability Index — {monthYear}</Text>
          <Text style={styles.subtitle}>
            Report generated: {generatedAt} · {data.submissionCount} submissions
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall score</Text>
          <Text style={styles.scoreBig}>
            {data.overallAvgScore != null
              ? data.overallAvgScore.toFixed(2)
              : "—"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pillar averages</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {PILLARS.map((p) => (
              <View key={p.key} style={styles.pill}>
                <Text>
                  {p.label}:{" "}
                  {(data.avgPerPillar[p.key] ?? 0) > 0
                    ? (data.avgPerPillar[p.key] ?? 0).toFixed(1)
                    : "—"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.twoCol}>
          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Score distribution</Text>
              {(["7-10", "4-6", "1-3"] as const).map((bucket) => {
                const n = data.scoreDistribution[bucket] ?? 0;
                const pct = maxBucket > 0 ? (n / maxBucket) * 100 : 0;
                return (
                  <View key={bucket} style={{ marginBottom: 4 }}>
                    <View style={styles.tableRow}>
                      <Text>{bucket}</Text>
                      <Text>{n}</Text>
                    </View>
                    <View style={styles.barBg}>
                      <View
                        style={[
                          styles.barFill,
                          { width: `${pct}%` },
                        ]}
                      />
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Mood (count · avg score)</Text>
              {moodEntries.length === 0 ? (
                <Text>—</Text>
              ) : (
                moodEntries.slice(0, 6).map(([mood, count]) => (
                  <View key={mood} style={styles.tableRow}>
                    <Text>{mood}</Text>
                    <Text>
                      {count}
                      {(data.avgScoreByMood[mood] ?? 0) > 0
                        ? ` · ${(data.avgScoreByMood[mood] ?? 0).toFixed(1)}`
                        : ""}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top states (responses)</Text>
              {stateEntries.length === 0 ? (
                <Text>—</Text>
              ) : (
                stateEntries.map(([state, count]) => (
                  <View key={state} style={styles.tableRow}>
                    <Text>{state}</Text>
                    <Text>
                      {count}
                      {(data.avgScoreByState[state] ?? 0) > 0
                        ? ` · avg ${(data.avgScoreByState[state] ?? 0).toFixed(1)}`
                        : ""}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Top tags</Text>
              {tagEntries.length === 0 ? (
                <Text>—</Text>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                  {tagEntries.map(([tag, count]) => (
                    <Text key={tag} style={styles.pill}>
                      {tag} ({count})
                    </Text>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>One word</Text>
              {topWords.length === 0 ? (
                <Text>—</Text>
              ) : (
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                  {topWords.map(({ word, count }) => (
                    <Text key={word} style={styles.pill}>
                      {word} ({count})
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
