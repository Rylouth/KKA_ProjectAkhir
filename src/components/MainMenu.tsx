/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Trophy,
  User,
  Zap,
  Target,
  Brain,
  Sparkles,
  Calculator,
  BookOpen,
  Globe,
  Atom,
  Users,
  Hourglass,
  Compass,
  Lightbulb,
} from "lucide-react";
import { Difficulty, Category, LeaderboardEntry } from "../types";
import { getLeaderboardEntries } from "../utils/leaderboard";
import { CATEGORY_COLORS } from "../data/questions";
import { motion } from "motion/react";

interface MainMenuProps {
  onStart: (name: string, difficulty: Difficulty, selectedCategory: Category | "Semua") => void;
}

const CATEGORIES_LIST: (Category | "Semua")[] = [
  "Semua",
  "Matematika",
  "Bahasa Indonesia",
  "Bahasa Inggris",
  "IPA",
  "IPS",
  "Sejarah",
  "Geografi",
  "Pengetahuan Umum",
];

const CATEGORY_ICONS_MAP: Record<string, React.ReactNode> = {
  "Semua": <Sparkles className="w-4 h-4" />,
  "Matematika": <Calculator className="w-4 h-4" />,
  "Bahasa Indonesia": <BookOpen className="w-4 h-4" />,
  "Bahasa Inggris": <Globe className="w-4 h-4" />,
  "IPA": <Atom className="w-4 h-4" />,
  "IPS": <Users className="w-4 h-4" />,
  "Sejarah": <Hourglass className="w-4 h-4" />,
  "Geografi": <Compass className="w-4 h-4" />,
  "Pengetahuan Umum": <Lightbulb className="w-4 h-4" />,
};

export default function MainMenu({ onStart }: MainMenuProps) {
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Sedang");
  const [selectedCategory, setSelectedCategory] = useState<Category | "Semua">("Semua");
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(true);

  useEffect(() => {
    // Load previously entered nickname if existing
    const savedName = localStorage.getItem("quiz_snake_player_name");
    if (savedName) {
      setName(savedName);
    } else {
      // Pick a fun default name
      const defaultNames = ["Ular_Bijak", "Master_Quiz", "Siswa_Pintar", "Kobra_Edukasi"];
      const randomDefault = defaultNames[Math.floor(Math.random() * defaultNames.length)];
      setName(randomDefault);
    }

    // Load leaderboard
    async function fetchLeaderboard() {
      setIsLoadingScores(true);
      try {
        const scores = await getLeaderboardEntries();
        setLeaderboard(scores);
      } catch (err) {
        console.error("Leaderboard load failed", err);
      } finally {
        setIsLoadingScores(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || "Pemain_Asing";
    localStorage.setItem("quiz_snake_player_name", finalName);
    onStart(finalName, difficulty, selectedCategory);
  };

  return (
    <div className="min-h-screen bg-glass-gradient text-slate-100 flex flex-col items-center justify-start py-8 px-4 font-sans select-none antialiased relative">
      {/* Dynamic Animated Background Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-5xl z-10 flex flex-col md:flex-row gap-8 items-stretch mt-4 md:mt-10">
        {/* LEFT COLUMN: Setup Form */}
        <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            {/* Header / Logo */}
            <div className="text-center md:text-left mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 text-cyan-300 rounded-full border border-white/10 text-xs font-semibold uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Refleks & Otak Gabung Jadi Satu
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-3">
                QUIZ <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">SNAKE</span>
              </h1>
              <p className="text-sm text-slate-300/80 mt-2 leading-relaxed">
                Kendalikan ular klasik, kumpulkan makanan, dan jawab kuis edukasi secepat kilat untuk menjadi nomor satu!
              </p>
            </div>

            <form onSubmit={handleStartGame} className="space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Nama Pengenal (Nickname)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={16}
                  placeholder="Masukkan nama pemain..."
                  className="w-full bg-white/5 border border-white/10 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 focus:outline-none rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 transition-all font-semibold"
                />
              </div>

              {/* Difficulty Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Tingkat Kesulitan
                </label>
                <div id="difficulty-selector" className="grid grid-cols-3 gap-2">
                  {(["Mudah", "Sedang", "Sulit"] as Difficulty[]).map((level) => {
                    const isSelected = difficulty === level;
                    const desc =
                      level === "Mudah"
                        ? "Santai • 15 dtk"
                        : level === "Sedang"
                        ? "Normal • 10 dtk"
                        : "Cepat • 7 dtk";
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`px-3 py-3 rounded-xl border font-bold text-sm transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                          isSelected
                            ? "bg-white/10 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10"
                            : "bg-white/3 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-200"
                        }`}
                      >
                        <span>{level}</span>
                        <span className="text-[10px] font-medium text-slate-500">{desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  Kategori Pembelajaran
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                  {CATEGORIES_LIST.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-white/10 border-indigo-400 text-indigo-300 ring-1 ring-indigo-500/30"
                            : "bg-white/3 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-300"
                        }`}
                      >
                        <span className={isSelected ? "text-indigo-300" : "text-slate-500"}>
                          {CATEGORY_ICONS_MAP[cat]}
                        </span>
                        <span className="truncate">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Play Button */}
              <button
                type="submit"
                id="btn-start"
                className="w-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 active:scale-[0.99] text-white font-extrabold text-lg rounded-xl py-4 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
              >
                Mulai Berpetualang
              </button>
            </form>
          </div>

          <div className="text-[11px] text-slate-400 text-center md:text-left mt-6 pt-4 border-t border-white/5">
            Gunakan tombol panah <b>(Arrow Keys)</b> atau tombol <b>W-A-S-D</b> di desktop, atau kontrol layar di mobile untuk menggerakkan ular.
          </div>
        </div>

        {/* RIGHT COLUMN: Leaderboard display */}
        <div className="w-full md:w-[380px] glass-panel rounded-2xl p-6 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
            <h2 className="font-extrabold text-lg text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              Peringkat Teratas (Leaderboard)
            </h2>
            <span className="text-[10px] text-cyan-400 bg-white/5 px-2 py-0.5 rounded-full font-semibold border border-white/10">
              Live Cloud
            </span>
          </div>

          {isLoadingScores ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-500">Memuat peringkat dari awan...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 border border-dashed border-white/10 rounded-xl bg-white/3">
              <Target className="w-8 h-8 mb-2 opacity-30 text-cyan-400" />
              <p className="text-xs font-semibold text-slate-300">Belum Ada Skor Tercatat</p>
              <p className="text-[10px] text-slate-500 px-6 text-center mt-1">
                Jadilah pemain pertama yang menembus podium puncak!
              </p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto space-y-2 max-h-[440px] pr-1">
              {leaderboard.map((entry, index) => {
                const getRankColor = () => {
                  if (index === 0) return "bg-amber-400/10 text-amber-300 border-amber-400/20";
                  if (index === 1) return "bg-slate-300/10 text-slate-200 border-slate-300/20";
                  if (index === 2) return "bg-amber-600/10 text-amber-500 border-amber-600/20";
                  return "bg-white/3 text-slate-400 border-white/5";
                };

                const getBadge = () => {
                  if (index === 0) return "🏆";
                  if (index === 1) return "🥈";
                  if (index === 2) return "🥉";
                  return `#${index + 1}`;
                };

                return (
                  <div
                    key={entry.id || index}
                    className="bg-white/3 hover:bg-white/6 border border-white/5 hover:border-white/10 rounded-xl p-3 flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs border ${getRankColor()}`}
                      >
                        {getBadge()}
                      </span>
                      <div className="max-w-[140px]">
                        <p className="font-extrabold text-sm text-slate-100 truncate">{entry.name}</p>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            {entry.difficulty}
                          </span>
                          <span className="text-[9px] text-cyan-400 bg-white/5 px-1 py-0.5 rounded font-bold">
                            {entry.accuracy}% Acc
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-cyan-400 text-base">{entry.score}</p>
                      <p className="text-[9px] text-slate-400 font-semibold uppercase">{entry.correctAnswers} Soal</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
