import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { CycleSummary, PerCycleAgentRow, CrossCycleMatrixRow } from "./agentAnalytics";

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 9, fontFamily: "Helvetica" },
  header: {
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    paddingBottom: 8,
  },
  title: { fontSize: 14, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 8, color: "#666" },
  section: { marginBottom: 12 },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eee",
  },
  th: {
    flexDirection: "row",
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    fontWeight: "bold",
    fontSize: 8,
  },
  cell: { flex: 1, paddingRight: 4 },
  cellNarrow: { width: 48, paddingRight: 4 },
});

export type AgentsReportPdfInput = {
  generatedAt: string;
  roster: {
    name: string;
    email: string;
    phone: string;
    referrerCode: string;
    isActive: boolean;
    submissionCount: number;
  }[];
  perCycle:
    | {
        monthYear: string;
        rows: PerCycleAgentRow[];
        unattributedCount: number;
        totalCount: number;
      }
    | null;
  crossCycle: {
    cycles: CycleSummary[];
    matrix: CrossCycleMatrixRow[];
  };
};

function truncate(s: string, max: number) {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export function AgentsReportPdfDocument(props: AgentsReportPdfInput) {
  const { generatedAt, roster, perCycle, crossCycle } = props;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Nigeria Stability Index — Agent report</Text>
          <Text style={styles.subtitle}>Generated: {generatedAt}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Agent roster</Text>
          <View style={styles.th}>
            <Text style={[styles.cell, { flex: 2 }]}>Name</Text>
            <Text style={styles.cell}>Email</Text>
            <Text style={styles.cellNarrow}>Code</Text>
            <Text style={styles.cellNarrow}>Subs</Text>
            <Text style={styles.cellNarrow}>Active</Text>
          </View>
          {roster.length === 0 ? (
            <Text>No agents yet.</Text>
          ) : (
            roster.map((a, i) => (
              <View key={i} style={styles.row} wrap={false}>
                <Text style={[styles.cell, { flex: 2 }]}>{truncate(a.name, 28)}</Text>
                <Text style={styles.cell}>{truncate(a.email, 32)}</Text>
                <Text style={styles.cellNarrow}>{a.referrerCode}</Text>
                <Text style={styles.cellNarrow}>{String(a.submissionCount)}</Text>
                <Text style={styles.cellNarrow}>{a.isActive ? "Yes" : "No"}</Text>
              </View>
            ))
          )}
        </View>

        {perCycle && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Submissions by agent — {perCycle.monthYear} ({perCycle.totalCount} total)
            </Text>
            <View style={styles.th}>
              <Text style={[styles.cell, { flex: 2 }]}>Agent</Text>
              <Text style={styles.cellNarrow}>Code</Text>
              <Text style={styles.cellNarrow}>Count</Text>
            </View>
            {perCycle.rows.map((r, i) => (
              <View key={r.agentId ?? `r-${i}`} style={styles.row} wrap={false}>
                <Text style={[styles.cell, { flex: 2 }]}>{truncate(r.name, 36)}</Text>
                <Text style={styles.cellNarrow}>{r.referrerCode ?? "—"}</Text>
                <Text style={styles.cellNarrow}>{String(r.count)}</Text>
              </View>
            ))}
            <View style={[styles.row, { marginTop: 4 }]} wrap={false}>
              <Text style={[styles.cell, { flex: 2 }]}>Direct / unattributed</Text>
              <Text style={styles.cellNarrow}>—</Text>
              <Text style={styles.cellNarrow}>{String(perCycle.unattributedCount)}</Text>
            </View>
          </View>
        )}
      </Page>

      {crossCycle.cycles.length > 0 && (
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Cross-cycle referral counts</Text>
            <Text style={styles.subtitle}>
              {crossCycle.cycles.length} cycle(s) · window ends {crossCycle.cycles[0]?.monthYear ?? ""}
            </Text>
          </View>
          <View style={styles.section}>
            <View style={[styles.th, { flexWrap: "wrap" }]}>
              <Text style={[styles.cell, { flex: 1.4, minWidth: 80 }]}>Agent</Text>
              {crossCycle.cycles.map((c) => (
                <Text key={c.id} style={[styles.cellNarrow, { width: 52, fontSize: 7 }]}>
                  {truncate(c.monthYear, 10)}
                </Text>
              ))}
              <Text style={[styles.cellNarrow, { width: 40 }]}>Σ</Text>
            </View>
            {crossCycle.matrix.map((row, i) => (
              <View key={row.agentId ?? `u-${i}`} style={styles.row} wrap={false}>
                <Text style={[styles.cell, { flex: 1.4, minWidth: 80 }]}>
                  {truncate(row.name, 22)}
                </Text>
                {crossCycle.cycles.map((c) => (
                  <Text key={c.id} style={[styles.cellNarrow, { width: 52 }]}>
                    {String(row.countsByCycleId[c.id] ?? 0)}
                  </Text>
                ))}
                <Text style={[styles.cellNarrow, { width: 40 }]}>{String(row.totalInWindow)}</Text>
              </View>
            ))}
          </View>
        </Page>
      )}
    </Document>
  );
}
