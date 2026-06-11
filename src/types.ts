/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = "Mudah" | "Sedang" | "Sulit";

export type Category =
  | "Matematika"
  | "Bahasa Indonesia"
  | "Bahasa Inggris"
  | "IPA"
  | "IPS"
  | "Sejarah"
  | "Geografi"
  | "Pengetahuan Umum";

export type PowerUpType = "freeze" | "double" | "shield" | "slow";

export interface Question {
  id: string;
  category: Category;
  questionText: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface PowerUp {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  durationMs: number; // how long it lasts when active (if applicable)
}

export interface SnakeSegment {
  x: number;
  y: number;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface LeaderboardEntry {
  id?: string;
  name: string;
  score: number;
  correctAnswers: number;
  accuracy: number;
  difficulty: Difficulty;
  createdAt: string;
}

export interface GameStats {
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  comboStreak: number;
  maxCombo: number;
}
