/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Trophy,
  Flame,
  Zap,
  Snowflake,
  Shield,
  Clock,
  RotateCcw,
  Volume2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  Activity,
} from "lucide-react";
import {
  Difficulty,
  Category,
  Question,
  PowerUp,
  SnakeSegment,
  Direction,
  GameStats,
} from "../types";
import { QUESTION_BANK } from "../data/questions";
import QuizPopup from "./QuizPopup";
import { motion, AnimatePresence } from "motion/react";

interface SnakeGameProps {
  playerName: string;
  difficulty: Difficulty;
  category: Category | "Semua";
  onGameOver: (stats: GameStats) => void;
  onExit: () => void;
}

// 20x20 grid layout
const GRID_SIZE = 20;

export default function SnakeGame({
  playerName,
  difficulty,
  category,
  onGameOver,
  onExit,
}: SnakeGameProps) {
  // Game standard configuration based on selected difficulty
  const getSpeedAndTimer = () => {
    switch (difficulty) {
      case "Mudah":
        return { baseSpeedMs: 200, quizTimerS: 15 };
      case "Sulit":
        return { baseSpeedMs: 90, quizTimerS: 7 };
      case "Sedang":
      default:
        return { baseSpeedMs: 140, quizTimerS: 10 };
    }
  };

  const { baseSpeedMs, quizTimerS } = getSpeedAndTimer();

  // Core Game State
  const [snake, setSnake] = useState<SnakeSegment[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
  ]);
  const [direction, setDirection] = useState<Direction>("UP");
  const [food, setFood] = useState<SnakeSegment>({ x: 5, y: 5 });
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalAnswers, setTotalAnswers] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  // Active Effects
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [slowMoTimeLeft, setSlowMoTimeLeft] = useState(0); // in seconds
  const [isImmortalityFlashing, setIsImmortalityFlashing] = useState(false);

  // Inventory Power-Ups count
  const [inventory, setInventory] = useState({
    freeze: 1, // Start with 1 of each to make it extra fun!
    double: 1,
    shield: 0,
    slow: 0,
  });

  // Flow State
  const [isPaused, setIsPaused] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  // Canvas Refs & Dimension State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  // Direction queue to prevent rapid double-taps crashing the snake into itself
  const directionRef = useRef<Direction>("UP");
  const nextDirectionRef = useRef<Direction>("UP");

  // Filtered lists of questions for the active category
  const activeQuestionBank = useRef<Question[]>([]);

  // Feed notifications list
  const [feedLogs, setFeedLogs] = useState<{ id: string; text: string; color: string }[]>([]);

  // Sound placeholders simulation
  const addFeedLog = (text: string, color = "text-emerald-400") => {
    const id = Math.random().toString(36).substring(2, 9);
    setFeedLogs((prev) => [{ id, text, color }, ...prev].slice(0, 5));
    setTimeout(() => {
      setFeedLogs((prev) => prev.filter((log) => log.id !== id));
    }, 4000);
  };

  // Populate categorized questions
  useEffect(() => {
    const bank =
      category === "Semua"
        ? QUESTION_BANK
        : QUESTION_BANK.filter((q) => q.category === category);
    activeQuestionBank.current = bank.length > 0 ? bank : QUESTION_BANK;
    
    // Spawn initial random coordinates
    respawnFood([]);
    addFeedLog(`✨ Kategori: ${category} terpasang!`, "text-teal-400");
  }, [category]);

  // Handle Canvas Resize Observation
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        // Keep it square based on container width (clamped)
        const size = Math.max(300, Math.min(width, 500));
        setDimensions({ width: size, height: size });
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      const key = e.key.toLowerCase();
      let newDir: Direction | null = null;

      if (key === "arrowup" || key === "w") newDir = "UP";
      else if (key === "arrowdown" || key === "s") newDir = "DOWN";
      else if (key === "arrowleft" || key === "a") newDir = "LEFT";
      else if (key === "arrowright" || key === "d") newDir = "RIGHT";

      if (newDir) {
        e.preventDefault();
        const curr = directionRef.current;
        // Block exact 180-degree self-collisions
        if (newDir === "UP" && curr !== "DOWN") nextDirectionRef.current = "UP";
        else if (newDir === "DOWN" && curr !== "UP") nextDirectionRef.current = "DOWN";
        else if (newDir === "LEFT" && curr !== "RIGHT") nextDirectionRef.current = "LEFT";
        else if (newDir === "RIGHT" && curr !== "LEFT") nextDirectionRef.current = "RIGHT";
      }

      // Hotkey powers activations
      if (key === "1") {
        handleTriggerFreeze();
      } else if (key === "2") {
        handleTriggerDouble();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, inventory]);

  // Main game tick coordinates recalculator
  useEffect(() => {
    if (isPaused || activeQuestion) return;

    const activeSpeed = slowMoTimeLeft > 0 ? baseSpeedMs * 1.6 : baseSpeedMs;

    const interval = setInterval(() => {
      moveSnake();
    }, activeSpeed);

    return () => clearInterval(interval);
  }, [snake, direction, isPaused, activeQuestion, slowMoTimeLeft]);

  // Active Effects Timers decrementers
  useEffect(() => {
    if (isPaused) return;

    const secondsTimer = setInterval(() => {
      if (slowMoTimeLeft > 0) {
        setSlowMoTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(secondsTimer);
  }, [slowMoTimeLeft, isPaused]);

  // Draw Arena
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = "#020617"; // slate-950
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    const cellW = dimensions.width / GRID_SIZE;
    const cellH = dimensions.height / GRID_SIZE;

    // Draw Subtle Grid Background Lines
    ctx.strokeStyle = "#0f172a"; // slate-900
    ctx.lineWidth = 1;
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellW, 0);
      ctx.lineTo(i * cellW, dimensions.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * cellH);
      ctx.lineTo(dimensions.width, i * cellH);
      ctx.stroke();
    }

    // Draw Active Power Up Items
    powerUps.forEach((pup) => {
      let color = "#38bdf8"; // default freeze lightblue
      if (pup.type === "double") color = "#fbbf24"; // amber
      if (pup.type === "shield") color = "#c084fc"; // purple
      if (pup.type === "slow") color = "#facc15"; // yellow slow

      const px = pup.x * cellW + cellW / 2;
      const py = pup.y * cellH + cellH / 2;
      const r = cellW / 2.3;

      // Draw pulsing outer circle glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset shadow

      // Draw inside accent core symbol
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 9px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      let sym = "❅";
      if (pup.type === "double") sym = "2X";
      if (pup.type === "shield") sym = "🛡";
      if (pup.type === "slow") sym = "🐌";
      ctx.fillText(sym, px, py);
    });

    // Draw regular Food
    const fx = food.x * cellW + cellW / 2;
    const fy = food.y * cellH + cellH / 2;
    const fr = cellW / 2.3;

    ctx.shadowColor = "#f43f5e"; // rose-500 apple glow
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(fx, fy, fr, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Leaf of the food
    ctx.fillStyle = "#10b981"; // green-500
    ctx.beginPath();
    ctx.ellipse(fx + 2, fy - 5, 2, 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake Segments
    snake.forEach((seg, idx) => {
      const isHead = idx === 0;
      const sx = seg.x * cellW;
      const sy = seg.y * cellH;

      ctx.save();

      if (isHead) {
        // Render head bubble with immunity flashing or shield color
        if (isImmortalityFlashing && Math.floor(Date.now() / 150) % 2 === 0) {
          ctx.fillStyle = "rgba(148, 163, 184, 0.3)";
        } else {
          ctx.fillStyle = "#10b981"; // emerald-500
        }

        // Round head nicely based on directions
        ctx.beginPath();
        ctx.roundRect(sx + 1, sy + 1, cellW - 2, cellH - 2, 6);
        ctx.fill();

        // Draw cute eyes looking in snake direction
        ctx.fillStyle = "#ffffff";
        const eyeRadius = cellW / 7;
        const curD = directionRef.current;
        let eyeX1 = 0, eyeY1 = 0, eyeX2 = 0, eyeY2 = 0;

        if (curD === "UP") {
          eyeX1 = sx + cellW * 0.3; eyeY1 = sy + cellH * 0.3;
          eyeX2 = sx + cellW * 0.7; eyeY2 = sy + cellH * 0.3;
        } else if (curD === "DOWN") {
          eyeX1 = sx + cellW * 0.3; eyeY1 = sy + cellH * 0.7;
          eyeX2 = sx + cellW * 0.7; eyeY2 = sy + cellH * 0.7;
        } else if (curD === "LEFT") {
          eyeX1 = sx + cellW * 0.3; eyeY1 = sy + cellH * 0.3;
          eyeX2 = sx + cellW * 0.3; eyeY2 = sy + cellH * 0.7;
        } else if (curD === "RIGHT") {
          eyeX1 = sx + cellW * 0.7; eyeY1 = sy + cellH * 0.3;
          eyeX2 = sx + cellW * 0.7; eyeY2 = sy + cellH * 0.7;
        }

        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, eyeRadius, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY2, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();

        // Draw Shield bubble helper if shield is active
        if (isShieldActive) {
          ctx.strokeStyle = "#c084fc";
          ctx.lineWidth = 2.5;
          ctx.shadowColor = "#a855f7";
          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(sx + cellW / 2, sy + cellH / 2, cellW * 1.1, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      } else {
        // Body segment styling (with smooth gradient transition or scale)
        const alpha = 1 - (idx / snake.length) * 0.7; // body fades out to tail
        const scale = 1 - (idx / snake.length) * 0.4; // body tapers
        const sW = (cellW - 3) * scale;
        const sH = (cellH - 3) * scale;
        const offsetW = (cellW - sW) / 2;
        const offsetYH = (cellH - sH) / 2;

        if (isImmortalityFlashing && Math.floor(Date.now() / 150) % 2 === 0) {
          ctx.fillStyle = `rgba(100, 116, 139, ${alpha * 0.3})`;
        } else {
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`; // fading emerald greens
        }

        ctx.beginPath();
        ctx.roundRect(sx + offsetW, sy + offsetYH, sW, sH, 4);
        ctx.fill();
      }

      ctx.restore();
    });
  }, [snake, food, powerUps, dimensions, isShieldActive, isImmortalityFlashing]);

  // Core movement calculator
  const moveSnake = () => {
    // Lock directions updates
    directionRef.current = nextDirectionRef.current;
    const curD = directionRef.current;

    const head = { ...snake[0] };

    // Increment head location matching direction vector
    if (curD === "UP") head.y -= 1;
    else if (curD === "DOWN") head.y += 1;
    else if (curD === "LEFT") head.x -= 1;
    else if (curD === "RIGHT") head.x += 1;

    // Boundary/Wall self wrap/destroy collision checks
    const hasHitWall = head.x < 0 || head.y < 0 || head.x >= GRID_SIZE || head.y >= GRID_SIZE;
    const hasHitSelf = snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y);

    if (hasHitWall || hasHitSelf) {
      if (isImmortalityFlashing) {
        // ignore collisions while temporarily blinking immortal
        return;
      }

      if (isShieldActive) {
        // Shield absorbs the blow!
        setIsShieldActive(false);
        addFeedLog("🛡️ Shield hancur melindungimu!", "text-purple-400");
        
        // Push snake safety bounce slightly backwards
        return;
      }

      // Lose 1 Life!
      handleLoseLife();
      return;
    }

    // Check if head eats standard food
    const eatsFood = head.x === food.x && head.y === food.y;
    if (eatsFood) {
      // Pause game ticks and open a live quiz popup
      setIsPaused(true);
      fetchNextQuestion();
      return;
    }

    // Check if head eats collectible power-ups
    const eatenPowerUpIdx = powerUps.findIndex((p) => p.x === head.x && p.y === head.y);
    let updatedPowerUps = [...powerUps];

    if (eatenPowerUpIdx !== -1) {
      const pup = powerUps[eatenPowerUpIdx];
      activateEatenPowerUp(pup);
      updatedPowerUps.splice(eatenPowerUpIdx, 1);
    }

    // Normal movement tick, drag segments
    const newSnake = [head, ...snake];
    newSnake.pop(); // remove tail

    setSnake(newSnake);
    setPowerUps(updatedPowerUps);
  };

  // Triggers quiz load
  const fetchNextQuestion = () => {
    const bank = activeQuestionBank.current;
    const randomQuestion = bank[Math.floor(Math.random() * bank.length)];
    setActiveQuestion(randomQuestion);
  };

  // Activate power-up items immediately or store in inventory
  const activateEatenPowerUp = (pup: PowerUp) => {
    if (pup.type === "freeze") {
      setInventory((prev) => ({ ...prev, freeze: prev.freeze + 1 }));
      addFeedLog("❄️ Memperoleh Bantuan Waktu Beku!", "text-cyan-400");
    } else if (pup.type === "double") {
      setInventory((prev) => ({ ...prev, double: prev.double + 1 }));
      addFeedLog("⚡ Memperoleh Bantuan Skor Ganda!", "text-amber-400");
    } else if (pup.type === "shield") {
      setIsShieldActive(true);
      addFeedLog("🛡️ Pelindung (Shield) Aktif!", "text-purple-400");
    } else if (pup.type === "slow") {
      setSlowMoTimeLeft(10);
      addFeedLog("🐌 Efek Lambat (Slow motion) 10 detik!", "text-yellow-400");
    }
  };

  // Lose life logic and safety recovery
  const handleLoseLife = () => {
    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      // Trigger GameOver
      onGameOver({
        score,
        correctAnswers: correctAnswersCount,
        totalAnswers,
        comboStreak: combo,
        maxCombo,
      });
    } else {
      // Warn and respawn safely at center
      addFeedLog("💥 Tabrakan! Kehilangan 1 nyawa.", "text-rose-500");
      
      // Reset position but preserve lengths to not frustrate player too much!
      const safetyCenter = { x: 10, y: 10 };
      const safetySnake = [
        { x: 10, y: 10 },
        { x: 10, y: 11 },
        { x: 10, y: 12 },
      ];
      setSnake(safetySnake);
      setDirection("UP");
      nextDirectionRef.current = "UP";
      directionRef.current = "UP";

      // Immortal flashing temporary
      setIsImmortalityFlashing(true);
      setTimeout(() => {
        setIsImmortalityFlashing(false);
      }, 2500);
    }
  };

  // Generate safe random grid locations for foods or powers
  const getRandomCell = (occupiedCells: SnakeSegment[]): SnakeSegment => {
    let attempts = 0;
    while (attempts < 50) {
      const rx = Math.floor(Math.random() * GRID_SIZE);
      const ry = Math.floor(Math.random() * GRID_SIZE);
      const isOccupied = occupiedCells.some((c) => c.x === rx && c.y === ry);
      if (!isOccupied) {
        return { x: rx, y: ry };
      }
      attempts++;
    }
    return { x: 2, y: 2 }; // fallback safe
  };

  // Spawns/respawns standard food
  const respawnFood = (occupied: SnakeSegment[]) => {
    const allOccupied = [...snake, ...occupied];
    setFood(getRandomCell(allOccupied));
  };

  // Handles Quiz answers outputs
  const handleQuizAnswered = (
    isCorrect: boolean,
    isTimeout: boolean,
    doubleScoreApplied: boolean
  ) => {
    setTotalAnswers((prev) => prev + 1);

    if (isTimeout) {
      // Timeout is failure + loses life immediately
      setCombo(0);
      handleLoseLife();
      respawnFood([]);
    } else if (isCorrect) {
      // Correct setup
      setCorrectAnswersCount((prev) => prev + 1);
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > maxCombo) {
        setMaxCombo(nextCombo);
      }

      // Points and combo rewards
      let earnPoints = 10;
      if (doubleScoreApplied) {
        earnPoints = 20;
        addFeedLog("🔥 Skor Ganda Diaktifkan!", "text-amber-400");
      }

      // Combo milestone bonuses
      let comboBonus = 0;
      if (nextCombo === 3) {
        comboBonus = 20;
        addFeedLog("🎉 Combo 3x Beruntun! Bonus +20!", "text-yellow-400");
      } else if (nextCombo === 5) {
        comboBonus = 50;
        addFeedLog("👑 Super Combo 5x Beruntun! Bonus +50!", "text-indigo-400");
      }

      setScore((prev) => prev + earnPoints + comboBonus);
      addFeedLog(`✅ Jawaban Benar! +${earnPoints} Poin`, "text-emerald-400");

      // Increase Snake lengths & Spawn custom power on chance
      increaseSnakeLength();

      // 30% chance to spawn some random power item on correct
      if (Math.random() < 0.35 && powerUps.length < 2) {
        spawnRandomPowerUp();
      }

      // Spawn next food safely
      respawnFood([]);
    } else {
      // Incorrect answer: no score, no growth, game loop continues
      setCombo(0);
      addFeedLog("❌ Jawaban Salah! Panjang ular tetap.", "text-rose-400");
      respawnFood([]);
    }

    // Dismisspopup and resume ticks
    setActiveQuestion(null);
    setIsPaused(false);
  };

  // Expand snake segment bounds by replicating tail
  const increaseSnakeLength = () => {
    setSnake((prev) => {
      const tail = prev[prev.length - 1] || { x: 10, y: 10 };
      return [...prev, { ...tail }];
    });
  };

  // Create a power collectible on the board
  const spawnRandomPowerUp = () => {
    const types: ("freeze" | "double" | "shield" | "slow")[] = [
      "freeze",
      "double",
      "shield",
      "slow",
    ];
    const pickedType = types[Math.floor(Math.random() * types.length)];
    const cell = getRandomCell([...snake, food]);

    const newPower: PowerUp = {
      id: Math.random().toString(),
      type: pickedType,
      x: cell.x,
      y: cell.y,
      durationMs: 15000, // persists 15s
    };

    setPowerUps((prev) => [...prev, newPower]);

    // Cleanup timer to fade power if not caught
    setTimeout(() => {
      setPowerUps((prev) => prev.filter((p) => p.id !== newPower.id));
    }, 15000);
  };

  // Keyboard inventory click handlers
  const handleTriggerFreeze = () => {
    if (inventory.freeze <= 0 || !activeQuestion || isPaused) return;
    // Visually pass to QuizPopup
  };

  const handleTriggerDouble = () => {
    if (inventory.double <= 0 || !activeQuestion || isPaused) return;
  };

  // Deduct spent item from inventory
  const handleSpentPowerUp = (type: "freeze" | "double") => {
    setInventory((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-glass-gradient text-slate-100 flex flex-col font-sans select-none antialiased relative">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* HEADER CONTROLS BAR WITH BLURRED GLASS EFFECT */}
      <header className="bg-white/3 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold cursor-pointer transition-all shadow-sm"
          >
            Keluar Game
          </button>
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase block tracking-wider leading-none">
              Pemain
            </span>
            <span className="text-sm font-black text-white">{playerName}</span>
          </div>
        </div>

        {/* LOGO */}
        <div className="hidden sm:flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <span className="font-extrabold text-base tracking-wider text-white">
            QUIZ <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-indigo-300">SNAKE</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            {difficulty}
          </span>
          <span className="text-xs bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 px-2.5 py-1 rounded-full font-bold">
            {category}
          </span>
        </div>
      </header>

      {/* CORE INTERACTIVITY COLUMN LAYOUT */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 items-stretch justify-center z-10">
        {/* GAME ARENA VIEWPORT COLUMN */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          {/* FEED NOTIFICATION STICKERS CHIPS */}
          <div className="h-8 relative w-full flex justify-center overflow-hidden">
            <AnimatePresence>
              {feedLogs.slice(0, 1).map((log) => (
                <motion.div
                   key={log.id}
                   initial={{ opacity: 0, y: 15 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -15 }}
                   className={`text-xs font-bold uppercase tracking-wider text-center ${log.color} bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg`}
                >
                  {log.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div
            ref={containerRef}
            className="w-full max-w-[480px] aspect-square rounded-3xl p-1 glass-panel relative flex items-center justify-center overflow-hidden"
          >
            <canvas
              ref={canvasRef}
              width={dimensions.width}
              height={dimensions.height}
              className="rounded-2xl"
            />

            {/* Immortality Warning Overlay flasher */}
            {isImmortalityFlashing && (
              <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 text-yellow-300 text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider shadow-md">
                🛡️ Transisi Proteksi Aktif
              </div>
            )}
          </div>

          {/* ON SCREEN MOBILES DIRECTORY TOUCH PAD (D-PAD) */}
          <div id="mobile-controls" className="block sm:hidden w-full max-w-[180px] mx-auto pt-2">
            <div className="grid grid-cols-3 gap-2">
              <div />
              <button
                onClick={() => {
                  if (directionRef.current !== "DOWN") nextDirectionRef.current = "UP";
                }}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-slate-200 cursor-pointer transition-all mx-auto shadow-sm"
              >
                <ArrowUp className="w-5 h-5 text-cyan-400" />
              </button>
              <div />

              <button
                onClick={() => {
                  if (directionRef.current !== "RIGHT") nextDirectionRef.current = "LEFT";
                }}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-slate-200 cursor-pointer transition-all mx-auto shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-cyan-400" />
              </button>
              <div className="w-12 h-12 flex items-center justify-center text-slate-400 font-bold text-[10px] bg-white/3 rounded-full border border-white/5 mx-auto">
                Nav
              </div>
              <button
                onClick={() => {
                  if (directionRef.current !== "LEFT") nextDirectionRef.current = "RIGHT";
                }}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-slate-200 cursor-pointer transition-all mx-auto shadow-sm"
              >
                <ArrowRight className="w-5 h-5 text-cyan-400" />
              </button>

              <div />
              <button
                onClick={() => {
                  if (directionRef.current !== "UP") nextDirectionRef.current = "DOWN";
                }}
                className="w-12 h-12 bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 rounded-xl flex items-center justify-center text-slate-200 cursor-pointer transition-all mx-auto shadow-sm"
              >
                <ArrowDown className="w-5 h-5 text-cyan-400" />
              </button>
              <div />
            </div>
          </div>
        </div>

        {/* SIDE ACTIONS AND DASHBOARD UTILITIES COLUMN */}
        <div className="w-full lg:w-[320px] glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-6 shadow-xl">
          {/* LIVES & SCORE STATS SECTION */}
          <div className="space-y-4">
            {/* Health and active combo details */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Nyawa Tersisa
                </span>
                <div id="lives-counter" className="flex items-center gap-1.5">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <Heart
                      key={idx}
                      className={`w-6 h-6 transition-all ${
                        idx < lives
                          ? "fill-rose-500 text-rose-500 scale-100 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.5)]"
                          : "fill-white/5 text-white/5 scale-90"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Panjang Ular
                </span>
                <span className="font-mono font-black text-white text-lg">
                  {snake.length} segmen
                </span>
              </div>
            </div>

            {/* Core Score */}
            <div className="bg-white/3 rounded-xl border border-white/5 p-4 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Poin Saat Ini
                </span>
                <span id="score-counter" className="font-mono font-black text-3xl text-cyan-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]">
                  {score}
                </span>
              </div>
              <div className="w-10 h-10 bg-white/5 border border-white/10 text-cyan-400 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-cyan-300" />
              </div>
            </div>

            {/* Active Combo status */}
            <div className="bg-white/3 rounded-xl border border-white/5 p-4 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Combo Aktif
                </span>
                <span className="font-mono font-black text-xl text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500 animate-pulse drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
                  {combo} x Beruntun
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 font-bold block">REKOR KAMU</span>
                <span className="text-xs font-semibold text-slate-300">{maxCombo} beruntun</span>
              </div>
            </div>

            {/* Active Effects Display */}
            {(slowMoTimeLeft > 0 || isShieldActive) && (
              <div className="bg-white/3 rounded-xl border border-white/5 p-4 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Efek Aktif
                </span>

                {isShieldActive && (
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Shield className="w-4 h-4 fill-indigo-500/20 text-indigo-400" />
                    <span>Perisai Aktif (Melindungi 1 Tubruk)</span>
                  </div>
                )}

                {slowMoTimeLeft > 0 && (
                  <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Gerakan Lambat ({slowMoTimeLeft}s)</span>
                    </div>
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400"
                        style={{ width: `${(slowMoTimeLeft / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ACTIVE INVENTORY DRAWER */}
          <div className="bg-white/3 rounded-xl border border-white/5 p-4 space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Persediaan Bantuan (Inventory)
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white/3 border border-white/5 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-cyan-300 mb-1">
                  <span className="font-bold text-[11px]">Waktu Beku</span>
                  <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-black text-sm text-slate-200">
                    x {inventory.freeze}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Tekan 1</span>
                </div>
              </div>

              <div className="p-2.5 bg-white/3 border border-white/5 rounded-lg flex flex-col justify-between">
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="font-bold text-[11px]">Skor Ganda</span>
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="font-black text-sm text-slate-200">
                    x {inventory.double}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Tekan 2</span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed font-medium text-center">
              Tabrak item spesial berkilau di arena permainan untuk memperoleh penambahan item bantuan! Gunakan selama pengerjaan kuis.
            </p>
          </div>
        </div>
      </main>

      {/* MODAL QUIZ WINDOWS SCREEN CHIPS */}
      {activeQuestion && (
        <QuizPopup
          question={activeQuestion}
          difficulty={difficulty}
          quizTimerDuration={quizTimerS}
          inventory={inventory}
          onUsePowerUp={handleSpentPowerUp}
          onAnswer={handleQuizAnswered}
        />
      )}
    </div>
  );
}
