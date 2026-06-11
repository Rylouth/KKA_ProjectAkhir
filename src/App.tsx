/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import SnakeGame from "./components/SnakeGame";
import GameOver from "./components/GameOver";
import { Difficulty, Category, GameStats } from "./types";

type ViewState = "MENU" | "PLAYING" | "GAME_OVER";

export default function App() {
  const [view, setView] = useState<ViewState>("MENU");
  const [playerName, setPlayerName] = useState("Pemain_Asing");
  const [difficulty, setDifficulty] = useState<Difficulty>("Sedang");
  const [category, setCategory] = useState<Category | "Semua">("Semua");
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    comboStreak: 0,
    maxCombo: 0,
  });

  const handleStartGame = (name: string, diff: Difficulty, cat: Category | "Semua") => {
    setPlayerName(name);
    setDifficulty(diff);
    setCategory(cat);
    setView("PLAYING");
  };

  const handleGameOver = (stats: GameStats) => {
    setGameStats(stats);
    setView("GAME_OVER");
  };

  const handleRestart = () => {
    setView("PLAYING");
  };

  const handleHome = () => {
    setView("MENU");
  };

  return (
    <div className="bg-glass-gradient min-h-screen text-slate-100 font-sans antialiased overflow-x-hidden">
      {view === "MENU" && <MainMenu onStart={handleStartGame} />}

      {view === "PLAYING" && (
        <SnakeGame
          playerName={playerName}
          difficulty={difficulty}
          category={category}
          onGameOver={handleGameOver}
          onExit={handleHome}
        />
      )}

      {view === "GAME_OVER" && (
        <GameOver
          playerName={playerName}
          difficulty={difficulty}
          stats={gameStats}
          onRestart={handleRestart}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
