/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  Trophy,
  Award,
  RefreshCw,
  Home,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Flame,
  CloudLightning,
} from "lucide-react";
import { Difficulty, GameStats } from "../types";
import { saveLeaderboardEntry } from "../utils/leaderboard";
import { motion } from "motion/react";

interface GameOverProps {
  playerName: string;
  difficulty: Difficulty;
  stats: GameStats;
  onRestart: () => void;
  onHome: () => void;
}

export default function GameOver({
  playerName,
  difficulty,
  stats,
  onRestart,
  onHome,
}: GameOverProps) {
  const [isSaving, setIsSaving] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"connecting" | "success" | "error">("connecting");

  const total = stats.totalAnswers;
  const accuracy = total > 0 ? Math.round((stats.correctAnswers / total) * 105 - 5) : 0; // standard custom mapping or math
  const actualAccuracy = total > 0 ? Math.round((stats.correctAnswers / total) * 100) : 0;

  useEffect(() => {
    async function submitScore() {
      setIsSaving(true);
      setSaveStatus("connecting");
      try {
        await saveLeaderboardEntry({
          name: playerName,
          score: stats.score,
          correctAnswers: stats.correctAnswers,
          accuracy: actualAccuracy,
          difficulty: difficulty,
          createdAt: new Date().toISOString(),
        });
        setSaveStatus("success");
      } catch (err) {
        console.error("Failed storing leaderboard entry", err);
        setSaveStatus("error");
      } finally {
        setIsSaving(false);
      }
    }
    submitScore();
  }, [playerName, stats.score, stats.correctAnswers, actualAccuracy, difficulty]);

  // Assessment phrase based on performance
  const getAssessment = () => {
    if (stats.score === 0) return "Ayo coba lagi, latih refleksmu!";
    if (actualAccuracy >= 90) return "Luar Biasa! Otak Einstein, Refleks Kilat!";
    if (actualAccuracy >= 70) return "Bagus sekali! Edukasi dan Kecepatan seimbang!";
    if (actualAccuracy >= 50) return "Cukup baik, pertahankan konsentrasimu!";
    return "Terus berlatih! Pengetahuan adalah kunci meraih skor tertinggi!";
  };

  return (
    <div className="min-h-screen bg-glass-gradient text-slate-100 flex flex-col items-center justify-center py-8 px-4 font-sans select-none antialiased relative">
      {/* Dynamic Ambient Background Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-xl glass-panel rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl z-10 text-center space-y-6">
        {/* UPPER EMBLEM */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-16 h-16 bg-white/5 border border-white/10 text-cyan-400 rounded-2xl flex items-center justify-center shadow-lg mb-2">
            <Trophy className="w-8 h-8 text-cyan-300" />
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            PERMAINAN SELESAI
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            Hasil Skor Akhir
          </h1>
          <p className="text-xs text-cyan-400 max-w-xs">{getAssessment()}</p>
        </div>

        {/* PRIMARY SCORE GRAPHIC */}
        <div className="bg-white/3 rounded-2xl border border-white/5 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent pointer-events-none" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Total Poin Diperoleh
          </span>
          <span className="text-6xl font-black text-white bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-300 bg-clip-text text-transparent mt-1 mb-2 drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
            {stats.score}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {playerName}
            </span>
            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" />
            <span className="text-xs font-semibold text-cyan-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
              {difficulty}
            </span>
          </div>
        </div>

        {/* DETAILED STATISTICS BENTO GRID */}
        <div className="grid grid-cols-2 gap-3 text-left">
          {/* STAT 1: Correct answers */}
          <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Benar / Total
              </span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-slate-100">
              {stats.correctAnswers} <span className="text-xs text-slate-400 font-medium">dari {stats.totalAnswers} Soal</span>
            </p>
          </div>

          {/* STAT 2: Accuracy */}
          <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Akurasi Kuis
              </span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl font-black text-slate-100">
              {actualAccuracy}%
            </p>
          </div>

          {/* STAT 3: Max Combo */}
          <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Combo Beruntun
              </span>
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <p className="text-xl font-black text-slate-100">
              {stats.maxCombo}x <span className="text-xs text-slate-400 font-medium">beruntun</span>
            </p>
          </div>

          {/* STAT 4: Status Saved indicator */}
          <div className="bg-white/3 border border-white/5 rounded-xl p-4 flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Sinkronisasi Rank
              </span>
              <CloudLightning className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              {saveStatus === "connecting" && (
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold text-slate-400">Menyimpan...</span>
                </div>
              )}
              {saveStatus === "success" && (
                <span className="text-xs font-bold text-emerald-400">Tersimpan di Awan!</span>
              )}
              {saveStatus === "error" && (
                <span className="text-xs font-bold text-rose-400">Offline (Lokal Oke)</span>
              )}
            </div>
          </div>
        </div>

        {/* BUTTON ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Main Lagi */}
          <button
            onClick={onRestart}
            id="btn-play-again"
            className="flex-1 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 active:scale-95 text-white font-extrabold rounded-xl py-3.5 shadow-md shadow-cyan-500/10 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Main Lagi
          </button>

          {/* Kembali ke Menu */}
          <button
            onClick={onHome}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 active:scale-95 text-slate-200 hover:text-white font-bold rounded-xl py-3.5 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Kembali ke Menu
          </button>
        </div>
      </div>
    </div>
  );
}
