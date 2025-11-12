'use client'

import { useEffect, useMemo, useState } from "react";

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function calcWinner(squares) {
  for (const [a, b, c] of LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  };
  
  return null;
};

const emptyBoard = () => Array(9).fill(null);

function isBoardFull(sq) {
  return sq.every(Boolean);
};

function availableMoves(sq) {
  const moves = [];
  for (let i = 0; i < 9; i++) if (!sq[i]) moves.push(i);
  return moves;
};

// Minimax with alpha-beta pruning (unbeatable on 3x3)
function minimax(board, isMaximizing, ai, human, alpha, beta) {
  const win = calcWinner(board);

  if(win){
    return (win.player === ai ? 10 : -10) * (isMaximizing ? 1 : 1);
  };

  if (isBoardFull(board)) return 0;

  const moves = availableMoves(board);

  if (isMaximizing) {
    let best = -Infinity;

    for(const m of moves){
      board[m] = ai;
      const score = minimax(board, false, ai, human, alpha, beta);
      board[m] = null;
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    };

    return best;
  } else {
    let best = Infinity;

    for (const m of moves) {
      board[m] = human;
      const score = minimax(board, true, ai, human, alpha, beta);
      board[m] = null;
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    };

    return best;
  };
};

function bestMove(board, ai, human){
  if (board.every((c) => c === null) && board[4] === null) return 4;

  let bestScore = -Infinity;
  let move = null;

  for (const m of availableMoves(board)) {
    board[m] = ai;
    const score = minimax(board, false, ai, human, -Infinity, Infinity);
    board[m] = null;

    if (score > bestScore) {
      bestScore = score;
      move = m;
    };
  };

  return move;
};

function randomMove(board) {
  const moves = availableMoves(board);
  return moves[Math.floor(Math.random() * moves.length)];
};

function mediumMove(board, ai, human){
  if (Math.random() < 0.7) return bestMove(board, ai, human);
  return randomMove(board);
};

function Square({ value, onClick, highlight, index, disabled }){
  return(
    <button
      aria-label={`square ${index + 1}`}
      className={`aspect-square w-full rounded-xl border text-3xl font-semibold flex items-center justify-center select-none
        border-b-5 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors
        ${highlight ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-600" : ""}
        ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={value === "X" ? "text-indigo-600" : "text-pink-600"}>{value}</span>
    </button>
  );
};

function Toolbar({ mode, setMode, firstPlayer, setFirstPlayer, difficulty, setDifficulty, onReset, canUndo, onUndo }) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex flex-col">
          <label className="text-sm text-slate-600 dark:text-slate-300">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="rounded-lg border p-2 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
          >
            <option value="pvp">Player vs Player</option>
            <option value="ai">Player vs AI</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm text-slate-600 dark:text-slate-300">First turn</label>
          <select
            value={firstPlayer}
            onChange={(e) => setFirstPlayer(e.target.value)}
            className="rounded-lg border p-2 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
          >
            <option value="X">X (first)</option>
            <option value="O">O</option>
          </select>
        </div>
        {mode === "ai" && (
          <div className="flex flex-col">
            <label className="text-sm text-slate-600 dark:text-slate-300">AI difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-lg border p-2 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard (unbeatable)</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="rounded-xl border px-4 py-2 border-slate-300 dark:border-slate-700 disabled:opacity-50"
        >
          Undo
        </button>
        <button
          onClick={onReset}
          className="rounded-xl bg-indigo-600 text-white px-4 py-2 hover:brightness-110"
        >
          Restart
        </button>
      </div>
    </div>
  );
};

function Score({ score }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-center">
      <div className="rounded-xl border border-b-3 p-3 border-slate-300 dark:border-slate-700">
        <div className="text-xs text-slate-500">X Wins</div>
        <div className="text-2xl font-semibold">{score.X}</div>
      </div>

      <div className="rounded-xl border border-b-3 p-3 border-slate-300 dark:border-slate-700">
        <div className="text-xs text-slate-500">Draws</div>
        <div className="text-2xl font-semibold">{score.D}</div>
      </div>

      <div className="rounded-xl border border-b-3 p-3 border-slate-300 dark:border-slate-700">
        <div className="text-xs text-slate-500">O Wins</div>
        <div className="text-2xl font-semibold">{score.O}</div>
      </div>
    </div>
  );
};

export default function TicTacToeApp() {
  const [mode, setMode] = useState("ai"); // "pvp" | "ai"
  const [difficulty, setDifficulty] = useState("hard"); // easy | medium | hard
  const [firstPlayer, setFirstPlayer] = useState("X"); // who starts each round

  const [board, setBoard] = useState(emptyBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]); // stack of moves (index)
  const [score, setScore] = useState({ X: 0, O: 0, D: 0 });
  const [winnerState, setWinnerState] = useState(null); // {player, line}

  const currentPlayer = xIsNext ? "X" : "O";

  // Reset round keeping score
  function resetRound(nextStarter = firstPlayer) {
    setBoard(emptyBoard());
    setXIsNext(nextStarter === "X");
    setHistory([]);
    setWinnerState(null);
  };

  function hardAiMove(b, ai, human) {
    return bestMove([...b], ai, human);
  };

  function chooseAiMove(b, diff, ai, human) {
    if (diff === "easy") return randomMove(b);
    if (diff === "medium") return mediumMove([...b], ai, human);
    return hardAiMove([...b], ai, human);
  };

  const status = useMemo(() => {
    const w = calcWinner(board);
    if (w) return `${w.player} wins!`;
    if (isBoardFull(board)) return "Draw";
    return `${currentPlayer}'s turn`;
  }, [board, xIsNext]);

  const winningLine = winnerState?.line ?? calcWinner(board)?.line ?? [];

  function handleClick(i) {
    if (board[i] || winnerState) return; // ignore if filled or game over

    const newBoard = board.slice();
    newBoard[i] = currentPlayer;
    const newHist = history.concat(i);
    setBoard(newBoard);
    setHistory(newHist);

    const w = calcWinner(newBoard);
    
    if (w) {
      setWinnerState(w);
      setScore((s) => ({ ...s, [w.player]: s[w.player] + 1 }));
      return;
    };

    if (isBoardFull(newBoard)) {
      setScore((s) => ({ ...s, D: s.D + 1 }));
      return;
    };

    setXIsNext(!xIsNext);
  };

  function handleUndo() {
    if (!history.length || winnerState) {
      // If game ended, allow a single undo to continue
      if (winnerState && history.length) setWinnerState(null);
      else return;
    }
    const last = history[history.length - 1];
    const newBoard = board.slice();
    newBoard[last] = null;
    setBoard(newBoard);
    setHistory(history.slice(0, -1));
    setXIsNext(!xIsNext);
  };

  function handleRestart() {
    resetRound(firstPlayer);
  };

  useEffect(() => {
    if (mode !== "ai") return;
    const human = firstPlayer;
    const ai = firstPlayer === "X" ? "O" : "X";
    const w = calcWinner(board);
    if (w || isBoardFull(board)) return;

    const aiTurn = (ai === "X" && xIsNext) || (ai === "O" && !xIsNext);
    if (!aiTurn) return;

    const timer = setTimeout(() => {
      const moveIndex = chooseAiMove(board, difficulty, ai, human);
  
      if (moveIndex === undefined || moveIndex === null) return;
      handleClick(moveIndex);
    }, 300); // small delay for UX

    return () => clearTimeout(timer);
  }, [board, xIsNext, mode, difficulty, firstPlayer]);

  useEffect(() => {
    resetRound(firstPlayer);
  }, [firstPlayer, mode, difficulty]);

  const cellDisabled = !!winnerState;

  return (
    <div className="text-slate-900 dark:text-slate-100 p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl">

        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight"><a href='/games' className='underline'>🏠︎</a>&nbsp;&nbsp;Tic‑Tac‑Toe</h1>

          <div className="text-sm text-slate-500">React • {mode === "ai" ? `AI: ${difficulty}` : "Local PvP"}</div>
        </header>

        <Toolbar
          mode={mode}
          setMode={setMode}
          firstPlayer={firstPlayer}
          setFirstPlayer={setFirstPlayer}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          onReset={handleRestart}
          canUndo={history.length > 0}
          onUndo={handleUndo}
        />

        <div className="my-6">
          <Score score={score} />
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-start">

          <div>
            
            <div className="mb-3 text-center text-lg font-medium">
              <span
                className={`inline-block rounded-full px-3 py-1 border text-sm border-slate-300 dark:border-slate-700 ${
                status.includes("wins")
                  ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-600"
                  : status === "Draw"
                  ? "bg-amber-100 dark:bg-amber-900/30 border-amber-400 dark:border-amber-600"
                  : "bg-slate-100 dark:bg-slate-800"
                }`}
              >
                {status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {board.map((val, i) => (
                <Square
                  key={i}
                  value={val}
                  index={i}
                  onClick={() => handleClick(i)}
                  disabled={cellDisabled || (mode === "ai" && ((firstPlayer === "X" && !xIsNext) || (firstPlayer === "O" && xIsNext)))}
                  highlight={winningLine.includes(i)}
                />
              ))}
            </div>
          </div>

          {/* Move list */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="font-semibold mb-3">Moves</h2>
              {history.length === 0 ? (
                <p className="text-sm text-slate-500">No moves yet. {mode === "ai" ? "Make your move!" : "X starts."}</p>
              ) : (
                <ol className="space-y-1 text-sm max-h-64 overflow-auto pr-1">
                  {history.map((idx, k) => (
                    <li key={k} className="flex items-center justify-between">
                      <span>
                        {k + 1}. {k % 2 === 0 ? "X" : "O"} → ({Math.floor(idx / 3) + 1}, {(idx % 3) + 1})
                      </span>

                      <button
                        className="text-indigo-600 hover:underline"
                        onClick={() => {
                          // jump to move k
                          const newBoard = emptyBoard();
                          for (let m = 0; m <= k; m++) newBoard[history[m]] = m % 2 === 0 ? "X" : "O";
                          setBoard(newBoard);
                          setHistory(history.slice(0, k + 1));
                          setXIsNext((k + 1) % 2 === 0);
                          setWinnerState(null);
                        }}
                      >
                        Jump
                      </button>
                    </li>
                  ))}
                </ol>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setScore({ X: 0, O: 0, D: 0 })}
                  className="rounded-xl border px-3 py-2 text-sm border-slate-300 dark:border-slate-700"
                >
                  Reset Score
                </button>

                <button
                  onClick={() => {
                    setScore({ X: 0, O: 0, D: 0 });
                    setFirstPlayer("X");
                    setMode("ai");
                    setDifficulty("hard");
                    resetRound("X");
                  }}

                  className="rounded-xl border px-3 py-2 text-sm border-slate-300 dark:border-slate-700"
                >
                  Factory Reset
                </button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};