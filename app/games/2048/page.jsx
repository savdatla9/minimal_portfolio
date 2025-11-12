"use client"

import { useEffect, useMemo, useRef, useState } from "react";

// 2048 -:- Features: New Game, Undo (1 step), Best Score,
// Keyboard (Arrow/WASD), Touch swipe, Win/Lose overlay.

const SIZE = 4;
const GOAL = 2048;
const START_TILES = 2;

function emptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
};

function deepCopy(board) {
  return board.map((row) => [...row]);
};

function getEmptyCells(board) {
  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) cells.push([r, c]);
    }
  }
  return cells;
};

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
};

function placeRandom(board) {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return false;
  const [r, c] = randomChoice(empty);
  // 90% 2, 10% 4
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return true;
};

function slideAndMerge(row) {
  // compress non-zeros left
  const arr = row.filter((v) => v !== 0);
  let scoreGain = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] !== 0 && arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      scoreGain += arr[i];
      arr[i + 1] = 0;
      i++; // skip next
    }
  }
  const merged = arr.filter((v) => v !== 0);
  while (merged.length < SIZE) merged.push(0);
  return { row: merged, scoreGain };
};

function rotateLeft(board) {
  const res = emptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      res[SIZE - 1 - c][r] = board[r][c];
    }
  }
  return res;
};

function rotateRight(board) {
  const res = emptyBoard();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      res[c][SIZE - 1 - r] = board[r][c];
    }
  }
  return res;
};

function flip(board) {
  // horizontal flip (reverse each row)
  return board.map((row) => [...row].reverse());
};

function boardsEqual(a, b) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (a[r][c] !== b[r][c]) return false;
    }
  }
  return true;
};

function anyMovesLeft(board) {
  if (getEmptyCells(board).length > 0) return true;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const v = board[r][c];
      if ((r + 1 < SIZE && board[r + 1][c] === v) || (c + 1 < SIZE && board[r][c + 1] === v)) return true;
    }
  };
  
  return false;
};

function useBestScore() {
  const [best, setBest] = useState(() => {
    const s = localStorage.getItem("best-2048");
    return s ? Number(s) : 0;
  });
  useEffect(() => {
    localStorage.setItem("best-2048", String(best));
  }, [best]);
  return [best, setBest];
};

function ScoreBox({ label, value }) {
  return (
    <div className="bg-neutral-900 text-white rounded-xl px-4 py-2 text-center min-w-[88px]">
      <div className="text-xs uppercase tracking-wide opacity-80">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
};

function Tile({ value }) {
  const colorMap = useMemo(
    () => ({
      0: "bg-neutral-200 text-transparent",
      2: "bg-[#eee4da] text-[#776e65]",
      4: "bg-[#ede0c8] text-[#776e65]",
      8: "bg-[#f2b179] text-white",
      16: "bg-[#f59563] text-white",
      32: "bg-[#f67c5f] text-white",
      64: "bg-[#f65e3b] text-white",
      128: "bg-[#edcf72] text-white",
      256: "bg-[#edcc61] text-white",
      512: "bg-[#edc850] text-white",
      1024: "bg-[#edc53f] text-white",
      2048: "bg-[#edc22e] text-white",
      bigger: "bg-black/80 text-white",
    }),
    []
  );

  const cls = value <= 2048 ? colorMap[value] : colorMap.bigger;

  return (
    <div
      className={`w-full h-full rounded-xl font-bold flex items-center justify-center leading-none shadow-sm transition-all duration-150 select-none ${cls}`}
    >
      {value !== 0 ? (
        <span className="text-xl sm:text-2xl md:text-3xl">{value}</span>
      ) : (
        <span className="opacity-0">0</span>
      )}
    </div>
  );
};

export default function Game2048() {
  const [board, setBoard] = useState(() => {
    const b = emptyBoard();
    let work = deepCopy(b);
    for (let i = 0; i < START_TILES; i++) placeRandom(work);
    return work;
  });
  
  const [score, setScore] = useState(0);
  const [best, setBest] = useBestScore();
  const [won, setWon] = useState(false);
  const [over, setOver] = useState(false);
  const prevRef = useRef({ board: null, score: 0 });

  // Touch handling
  const touchStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.toLowerCase();
      if (["arrowup", "w", "k"].includes(key)) {
        e.preventDefault();
        move("up");
      } else if (["arrowdown", "s", "j"].includes(key)) {
        e.preventDefault();
        move("down");
      } else if (["arrowleft", "a", "h"].includes(key)) {
        e.preventDefault();
        move("left");
      } else if (["arrowright", "d", "l"].includes(key)) {
        e.preventDefault();
        move("right");
      }
    };
    window.addEventListener("keydown", onKey, { passive: false });
    return () => window.removeEventListener("keydown", onKey);
  }, [board, score]);

  useEffect(() => {
    // Check win/lose
    if (!won) {
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          if (board[r][c] >= GOAL) {
            setWon(true);
            break;
          }
        }
      }
    }
    if (!anyMovesLeft(board)) setOver(true);
  }, [board, won]);

  function reset() {
    const b = emptyBoard();
    let work = deepCopy(b);
    for (let i = 0; i < START_TILES; i++) placeRandom(work);
    setBoard(work);
    setScore(0);
    setWon(false);
    setOver(false);
  };

  function undo() {
    if (prevRef.current.board) {
      setBoard(prevRef.current.board);
      setScore(prevRef.current.score);
      setOver(false);
      setWon(false);
    }
  };

  function move(dir) {
    // Save for undo
    prevRef.current = { board: deepCopy(board), score };

    let working = deepCopy(board);
    let totalGain = 0;

    const applyLeft = () => {
      const next = [];
      for (let r = 0; r < SIZE; r++) {
        const { row, scoreGain } = slideAndMerge(working[r]);
        next.push(row);
        totalGain += scoreGain;
      }
      working = next;
    };

    // Transform board so that we always compute as if moving left
    if (dir === "left") {
      // no transform
    } else if (dir === "right") {
      working = flip(working);
    } else if (dir === "up") {
      working = rotateLeft(working);
    } else if (dir === "down") {
      working = rotateRight(working);
    }

    const before = deepCopy(working);
    applyLeft();
    const moved = !boardsEqual(before, working);

    // Undo transform
    if (dir === "left") {
      // no transform
    } else if (dir === "right") {
      working = flip(working);
    } else if (dir === "up") {
      working = rotateRight(working);
    } else if (dir === "down") {
      working = rotateLeft(working);
    }

    if (moved) {
      placeRandom(working);
      const newScore = score + totalGain;
      setBoard(working);
      setScore(newScore);
      if (newScore > best) setBest(newScore);
    }
  };

  const onTouchStart = (e) => {
    const t = e.changedTouches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e) => {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    const dy = t.clientY - touchStart.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const threshold = 24; // pixels
    if (absX < threshold && absY < threshold) return;
    if (absX > absY) {
      move(dx > 0 ? "right" : "left");
    } else {
      move(dy > 0 ? "down" : "up");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-[480px]">
        {/* Header */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              <a href='/games' className="underline">🏠︎</a>  2048
            </h1>
            
            <p className="text-sm font-bold text-neutral-500">Use your arrow keys or swipe to join the numbers and get to 2048!</p>
          </div>
          <div className="flex gap-2">
            <ScoreBox label="Score" value={score} />
            <ScoreBox label="Best" value={best} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={reset}
            className="px-3 py-2 rounded-xl bg-neutral-900 text-white font-semibold hover:opacity-90"
          >
            New Game
          </button>
          <button
            onClick={undo}
            className="px-3 py-2 rounded-xl bg-neutral-300 text-neutral-900 font-semibold hover:opacity-90"
          >
            Undo
          </button>
        </div>

        {/* Board */}
        <div
          className="relative select-none"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Unified grid (background + tiles) */}
          <div className="grid grid-cols-4 gap-2 bg-neutral-300 p-3 rounded-2xl shadow-inner">
            {board.flat().map((v, i) => (
              <div key={`tile-${i}`} className="aspect-square">
                <Tile value={v} />
              </div>
            ))}
          </div>
        </div>

        {(won || over) && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 text-center w-[80%] max-w-sm shadow-xl">
              <h2 className="text-2xl font-bold mb-2">{won ? "You Win!" : "Game Over"}</h2>
              <p className="text-sm text-neutral-600 mb-4">
                {won ? "Keep playing to reach even higher tiles, or start a new game." : "No moves left. Try again!"}
              </p>
              <div className="flex gap-2 justify-center">
                {won && (
                  <button
                    onClick={() => {
                      setWon(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-neutral-900 text-white font-semibold hover:opacity-90"
                  >
                    Keep Playing
                  </button>
                )}
                <button
                  onClick={reset}
                  className="px-3 py-2 rounded-xl bg-neutral-300 text-neutral-900 font-semibold hover:opacity-90"
                >
                  New Game
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-2 text-xs text-center font-bold text-neutral-500">
          <p>Shortcuts: WASD/HJKL also work. Touch: swipe anywhere on the board.</p>
        </div>
      </div>
    </div>
  );
};