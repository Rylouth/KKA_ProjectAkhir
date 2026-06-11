/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { LeaderboardEntry } from "../types";
import firebaseConfig from "../firebase-applet-config.json";

// Define the required operation types and schemas for error handling
enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

// Check if Firebase configuration is active and has valid credentials
const isFirebaseConfigured =
  firebaseConfig &&
  firebaseConfig.apiKey !== "" &&
  firebaseConfig.projectId !== "";

let db: any = null;

if (isFirebaseConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    // Using the specified database ID if available
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    console.log("Firebase Firestore successfully initialized for Quiz Snake!");
  } catch (err) {
    console.error("Failed to initialize Firebase:", err);
  }
} else {
  console.log("Firebase is not fully configured yet. Operating in LocalStorage-only mode.");
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path,
  };
  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Fallback high scores to populate a lively initial board
const INITIAL_LOCAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    name: "Asep Ganteng",
    score: 180,
    correctAnswers: 15,
    accuracy: 94,
    difficulty: "Sedang",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    name: "Siti Pintar",
    score: 250,
    correctAnswers: 20,
    accuracy: 100,
    difficulty: "Sulit",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    name: "Budi Refleks",
    score: 110,
    correctAnswers: 10,
    accuracy: 83,
    difficulty: "Mudah",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    name: "Rian Matematika",
    score: 150,
    correctAnswers: 13,
    accuracy: 86,
    difficulty: "Sedang",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

/**
 * Saves a player's score to Firebase Firestore if it is fully active,
 * and always persists a copy locally using client-side localStorage.
 */
export async function saveLeaderboardEntry(entry: LeaderboardEntry): Promise<void> {
  const localScoresString = localStorage.getItem("quiz_snake_leaderboard");
  let localScores: LeaderboardEntry[] = localScoresString
    ? JSON.parse(localScoresString)
    : [...INITIAL_LOCAL_LEADERBOARD];

  // Store in LocalStorage first as an instant dependable copy
  localScores.push(entry);
  // Sort in descending order of score, keep top 100 entries
  localScores.sort((a, b) => b.score - a.score);
  localStorage.setItem("quiz_snake_leaderboard", JSON.stringify(localScores.slice(0, 100)));

  // Persist to Cloud Firestore if connected
  if (db) {
    const colPath = "leaderboard";
    try {
      await addDoc(collection(db, colPath), {
        name: entry.name,
        score: Number(entry.score),
        correctAnswers: Number(entry.correctAnswers),
        accuracy: Number(entry.accuracy),
        difficulty: entry.difficulty,
        createdAt: entry.createdAt,
      });
      console.log("Successfully saved record to Firebase!");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, colPath);
    }
  }
}

/**
 * Fetches the leaderboard entries. Pulls from Firestore if active,
 * and merges/falls back to localStorage entries.
 */
export async function getLeaderboardEntries(): Promise<LeaderboardEntry[]> {
  let cloudScores: LeaderboardEntry[] = [];

  if (db) {
    const colPath = "leaderboard";
    try {
      const q = query(collection(db, colPath), orderBy("score", "desc"), limit(20));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cloudScores.push({
          id: doc.id,
          name: data.name || "Anonymous",
          score: data.score || 0,
          correctAnswers: data.correctAnswers || 0,
          accuracy: data.accuracy || 0,
          difficulty: data.difficulty || "Sedang",
          createdAt: data.createdAt || new Date().toISOString(),
        });
      });
      console.log("Loaded leaderboard entries from Firestore:", cloudScores.length);
    } catch (error) {
      console.warn("Could not retrieve cloud rankings, falling back to local scores:", error);
    }
  }

  // Load from LocalStorage
  const localScoresString = localStorage.getItem("quiz_snake_leaderboard");
  let localScores: LeaderboardEntry[] = localScoresString
    ? JSON.parse(localScoresString)
    : [...INITIAL_LOCAL_LEADERBOARD];

  if (!localStorage.getItem("quiz_snake_leaderboard")) {
    localStorage.setItem("quiz_snake_leaderboard", JSON.stringify(localScores));
  }

  // If cloud scores were successfully retrieved, merge them or prioritize them
  if (cloudScores.length > 0) {
    // Merge scores and remove exact duplicates based on name, score, and datetime
    const merged = [...cloudScores];
    localScores.forEach((local) => {
      const isDuplicate = merged.some(
        (cloud) =>
          cloud.name === local.name &&
          cloud.score === local.score &&
          cloud.difficulty === local.difficulty
      );
      if (!isDuplicate) {
        merged.push(local);
      }
    });
    merged.sort((a, b) => b.score - a.score);
    return merged.slice(0, 25);
  }

  localScores.sort((a, b) => b.score - a.score);
  return localScores.slice(0, 25);
}
