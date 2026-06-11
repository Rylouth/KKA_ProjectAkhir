/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Clock,
  Zap,
  Snowflake,
  Sparkles,
  Volume2,
  Check,
  X,
  HelpCircle,
  AlertCircle,
  BookOpen,
} from "lucide-react";
import { Question, Difficulty, Category } from "../types";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../data/questions";
import { motion } from "motion/react";

interface QuizPopupProps {
  question: Question;
  difficulty: Difficulty;
  quizTimerDuration: number; // in seconds (15, 10, or 7)
  inventory: {
    freeze: number;
    double: number;
    shield: number;
    slow: number;
  };
  onUsePowerUp: (type: "freeze" | "double") => void;
  onAnswer: (isCorrect: boolean, isTimeout: boolean, doubleScoreApplied: boolean) => void;
}

export default function QuizPopup({
  question,
  difficulty,
  quizTimerDuration,
  inventory,
  onUsePowerUp,
  onAnswer,
}: QuizPopupProps) {
  const [timeLeft, setTimeLeft] = useState(quizTimerDuration);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [freezeDurationLeft, setFreezeDurationLeft] = useState(0);
  const [doubleScoreActive, setDoubleScoreActive] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const freezeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (isAnswered) return;

    timerRef.current = setInterval(() => {
      if (isFrozen) {
        // Decrease freeze time indicator
        setFreezeDurationLeft((prev) => {
          if (prev <= 1) {
            setIsFrozen(false);
            return 0;
          }
          return prev - 1;
        });
      } else {
        // Normal count down
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsTimeout(true);
            setIsAnswered(true);
            // Wait for user to read or process timeout, then complete
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFrozen, isAnswered]);

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;

    setSelectedIdx(idx);
    setIsAnswered(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleActivateFreeze = () => {
    if (inventory.freeze <= 0 || isFrozen || isAnswered) return;
    onUsePowerUp("freeze");
    setIsFrozen(true);
    setFreezeDurationLeft(5);
  };

  const handleActivateDouble = () => {
    if (inventory.double <= 0 || doubleScoreActive || isAnswered) return;
    onUsePowerUp("double");
    setDoubleScoreActive(true);
  };

  const isCorrect = selectedIdx === question.correctAnswerIndex;

  const handleContinue = () => {
    onAnswer(isCorrect && !isTimeout, isTimeout, doubleScoreActive);
  };

  // Get color indicator for a choice after selecting
  const getChoiceStyles = (idx: number) => {
    if (!isAnswered) {
      return "bg-white/5 border-white/10 text-slate-100 hover:bg-white/10 hover:border-white/25 cursor-pointer";
    }

    const isThisCorrect = idx === question.correctAnswerIndex;
    const isThisSelected = idx === selectedIdx;

    if (isThisCorrect) {
      return "bg-emerald-500/10 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/30";
    }
    if (isThisSelected && !isThisCorrect) {
      return "bg-rose-500/10 border-rose-500 text-rose-300 ring-1 ring-rose-500/30";
    }
    return "bg-white/2 border-white/5 text-slate-500 pointer-events-none";
  };

  // Timer color indicator
  const getTimerColor = () => {
    if (isFrozen) return "from-cyan-400 to-blue-500";
    const ratio = timeLeft / quizTimerDuration;
    if (ratio > 0.5) return "from-cyan-400 to-indigo-500";
    if (ratio > 0.25) return "from-amber-400 to-orange-500";
    return "from-rose-500 to-red-600 animate-pulse";
  };

  return (
    <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-md">
      <div className="w-full max-w-2xl glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* UPPER STATUS BAR */}
        <div className="bg-white/3 px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-bold rounded-lg border flex items-center gap-1 uppercase tracking-wider ${
                CATEGORY_COLORS[question.category] || "text-slate-300 bg-white/5 border-white/10"
              }`}
            >
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              {question.category}
            </span>
            <span className="text-xs font-semibold text-slate-300 capitalize px-2 py-0.5 bg-white/5 rounded border border-white/10">
              Kuis {difficulty}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {doubleScoreActive && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-extrabold uppercase rounded-full animate-bounce">
                <Sparkles className="w-3 h-3" />
                Double Score 2X
              </span>
            )}

            {/* TIMER CONTAINER */}
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${isFrozen ? "text-cyan-300 animate-pulse" : "text-slate-300"}`} />
              <span className={`font-mono font-black text-lg ${isFrozen ? "text-cyan-300" : "text-white"}`}>
                {isTimeout ? "0" : timeLeft}s
              </span>
              {isFrozen && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold px-1.5 py-0.5 rounded animate-pulse">
                  BEKU (+{freezeDurationLeft}s)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* TIME BAR VISUALIZER */}
        <div className="w-full h-1.5 bg-white/5">
          <div
            className={`h-full bg-gradient-to-r transition-all duration-1000 ${getTimerColor()}`}
            style={{ width: `${(timeLeft / quizTimerDuration) * 100}%` }}
          />
        </div>

        {/* MAIN BODY */}
        <div className="p-6 md:p-8 flex-1 space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-extrabold text-white leading-relaxed text-center md:text-left">
              {question.questionText}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option, idx) => {
              const isThisCorrect = idx === question.correctAnswerIndex;
              const isThisSelected = idx === selectedIdx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${getChoiceStyles(
                    idx
                  )}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-300 uppercase font-bold w-5 h-5 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                      {["A", "B", "C", "D"][idx]}
                    </span>
                    <span className="pr-2">{option}</span>
                  </div>

                  {isAnswered && (
                    <span className="flex-shrink-0">
                      {isThisCorrect ? (
                        <Check className="w-4 h-4 text-emerald-400 animate-scale-up" />
                      ) : (
                        isThisSelected && <X className="w-4 h-4 text-rose-400 animate-scale-up" />
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* AFTER ANSWER IS COMPLETED DISPLAY */}
          {isAnswered && (
            <div className="bg-white/3 rounded-2xl p-4 border border-white/5 space-y-2 shadow-inner">
              <div className="flex items-center gap-2">
                {isTimeout ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-black text-rose-300 uppercase tracking-wider">
                      Waktu Habis! Nyawa Berkurang.
                    </span>
                  </>
                ) : isCorrect ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                      Jawaban Benar! +10 poin
                    </span>
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-black text-rose-300 uppercase tracking-wider">
                      Jawaban Kurang Tepat
                    </span>
                  </>
                )}
              </div>

              {question.explanation && (
                <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                  💡 <span className="text-white">Penjelasan:</span> {question.explanation}
                </p>
              )}
            </div>
          )}
        </div>

        {/* POWER-UP CONTROL BAR & CONTINUE */}
        <div className="bg-white/3 px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Active Player Power-Ups */}
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Bantuan:
            </span>

            {/* Freeze Button */}
            <button
              onClick={handleActivateFreeze}
              disabled={isAnswered || isFrozen || inventory.freeze <= 0}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all text-xs font-extrabold ${
                isAnswered || isFrozen || inventory.freeze <= 0
                  ? "bg-white/2 border-white/5 text-slate-500 cursor-not-allowed"
                  : "bg-white/5 border-white/10 text-cyan-300 hover:border-cyan-500/40 hover:bg-white/10 cursor-pointer"
              }`}
            >
              <Snowflake className="w-3.5 h-3.5" />
              <span>Waktu Beku ({inventory.freeze})</span>
            </button>

            {/* Double points Button */}
            <button
              onClick={handleActivateDouble}
              disabled={isAnswered || doubleScoreActive || inventory.double <= 0}
              className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-all text-xs font-extrabold ${
                isAnswered || doubleScoreActive || inventory.double <= 0
                  ? "bg-white/2 border-white/5 text-slate-500 cursor-not-allowed"
                  : "bg-white/5 border-white/10 text-amber-300 hover:border-amber-500/40 hover:bg-white/10 cursor-pointer"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Skor Ganda ({inventory.double})</span>
            </button>
          </div>

          {/* Action Button */}
          {isAnswered && (
            <button
              onClick={handleContinue}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-white font-extrabold py-3 px-8 rounded-xl text-sm tracking-wide shadow-md shadow-cyan-500/10 cursor-pointer transition-all active:scale-95 text-center"
            >
              Lanjutkan Permainan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
