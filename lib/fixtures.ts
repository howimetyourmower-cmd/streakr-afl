// lib/fixtures.ts
import "server-only";
import { adminDb } from "./firebaseAdmin";

type AnyRec = Record<string, any>;

// ---- Status model (single source of truth) ----
export const QUESTION_STATUSES = [
  "open",
  "pending",
  "final",
  "void",
  "regrade",
  "start" // legacy value some docs might still have
] as const;

export type QuestionStatus = typeof QUESTION_STATUSES[number];

// Map legacy -> current for safety
export const normalizeStatus = (s: string | undefined): QuestionStatus => {
  if (s === "start") return "open";
  return (QUESTION_STATUSES as readonly string[]).includes(s ?? "")
    ? (s as QuestionStatus)
    : "open";
};

// ---- Types for Picks/Questions ----
export type PickTotals = {
  yes: number;
  no: number;
};

export interface PublicQuestion {
  id: string;          // question doc id
  roundId: string;     // e.g. "round-1"
  gameId: string;      // parent game doc id
  quarter: number;     // 1..4
  text: string;        // the question text
  status: QuestionStatus;
  totals: PickTotals;
}

const mapQuestion = (
  roundId: string,
  gameId: string,
  snap: FirebaseFirestore.QueryDocumentSnapshot
): PublicQuestion => {
  const d = snap.data() as any;
  return {
    id: snap.id,
    roundId,
    gameId,
    quarter: d.quarter ?? 1,
    text: d.question ?? d.text ?? "",
    status: normalizeStatus(d.status),
    totals: d.totals ?? { yes: 0, no: 0 },
  };
};

export async function getPendingSettlementPicks(): Promise<AnyRec[]> {
  const snap = await adminDb.collection("picks").where("status", "==", "pending").get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAdminAuditLog(limit = 100): Promise<AnyRec[]> {
  const snap = await adminDb
    .collection("adminAudit")
    .orderBy("ts", "desc")
    .limit(limit)
    .get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function settlePick(pickId: string, result: "yes" | "no" | "void"): Promise<void> {
  await adminDb.collection("picks").doc(pickId).update({ status: "final", result });
}

export async function getUserPicks(uid: string): Promise<AnyRec[]> {
  const snap = await adminDb.collection("picks").where("uid", "==", uid).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getLeaderboardTop(limit = 100): Promise<AnyRec[]> {
    const snap = await adminDb
        .collection("users")
        .orderBy("roundScore", "desc")
        .limit(limit)
        .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getSeasonLeaderboardTop(limit = 100): Promise<AnyRec[]> {
    const snap = await adminDb
        .collection("users")
        .orderBy("seasonScore", "desc")
        .limit(limit)
        .get();
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getUpcomingQuestions(limit = 6): Promise<AnyRec[]> {
  const snap = await adminDb.collection("questions").where("status", "==", "pending").limit(limit).get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getLatestRoundId(): Promise<string> {
    const snap = await adminDb
        .collection("rounds")
        .orderBy("startsAt", "desc")
        .limit(1)
        .get();
    if (snap.empty) {
        throw new Error("No rounds found");
    }
    return snap.docs[0].id;
}

export async function getRoundData(roundId: string): Promise<AnyRec | null> {
    const roundDoc = await adminDb.collection("rounds").doc(roundId).get();
    if (!roundDoc.exists) {
        return null;
    }
    const questionsSnap = await adminDb.collection("questions").where("roundId", "==", roundId).get();
    const questions = questionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    return { id: roundDoc.id, ...roundDoc.data(), questions };
}

export async function getRoundQuestions(roundId: string): Promise<PublicQuestion[]> {
  const snap = await adminDb.collection("questions").where("roundId", "==", roundId).get();
  return snap.docs.map(d => mapQuestion(roundId, d.data().gameId, d));
}

export async function saveUserPick(uid: string, questionId: string, choice: "yes" | "no"): Promise<void> {
  const pick = {
    uid,
    questionId,
    choice,
    status: "pending" as const,
    createdAt: new Date(),
  };

  const query = adminDb
    .collection("picks")
    .where("uid", "==", uid)
    .where("questionId", "==", questionId)
    .limit(1);

  const snapshot = await query.get();

  if (snapshot.empty) {
    await adminDb.collection("picks").add(pick);
  } else {
    const docId = snapshot.docs[0].id;
    await adminDb.collection("picks").doc(docId).update({ choice });
  }
}
