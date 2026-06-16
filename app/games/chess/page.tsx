'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Chess } from 'chess.js';
import { 
  Undo2, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ArrowLeft, 
  Bot, 
  User, 
  Award,
  Zap,
  Info
} from 'lucide-react';

// ==========================================
// 1. CHESS PIECE SVG RENDERER
// ==========================================
interface ChessPieceProps {
  type: string;
  color: string;
  className?: string;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ type, color, className }) => {
  const fillColor = color === 'w' ? '#ffffff' : '#1e293b';
  const strokeColor = color === 'w' ? '#1e293b' : '#f8fafc';

  switch (type) {
    case 'p':
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-.83.65-1.41 1.63-1.41 2.75 0 .28.03.55.09.81-2.48.56-4.09 2.06-4.09 3.91 0 1.38 1.12 2.5 2.5 2.5h19c1.38 0 2.5-1.12 2.5-2.5 0-1.85-1.61-3.35-4.09-3.91.06-.26.09-.53.09-.81 0-1.12-.58-2.1-1.41-2.75C34.06 24.84 35 23.03 35 21c0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'r':
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M9 39h27v-3H9v3zm3-3h21v-4H12v4zm2.25-4h16.5l1.25-8H13l1.25 8z" />
            <path d="M12 22h21v-3H12v3zm1.5-3h18l1.5-8H12l1.5 8z" />
            <path d="M12 9v4h3V9h-3zm6 0v4h3V9h-3zm6 0v4h3V9h-3zm6 0v4h3V9h-3zm6 0v4h3V9h-3z" />
          </g>
        </svg>
      );
    case 'n':
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M 22,10 C 22,10 19,11 16,15 C 13,19 13,23 13,23 C 13,23 14.5,21.5 16,22 C 16,22 15.5,25 18,25 C 18.5,25 19,25 19.5,24.5 C 19.5,24.5 19.5,26.5 18,27.5 C 17,28.5 15,28.5 15,28.5 C 15,28.5 18,30.5 22,29.5 C 23.5,29 25,27.5 26.5,25.5 C 27.5,24 28,21.5 28,19 C 28,15.5 26,11.5 22,10 z" />
            <path d="M 9.5 37 L 35.5 37 L 35.5 39.5 L 9.5 39.5 L 9.5 37 z" />
            <path d="M 11.5 30 L 33.5 30 C 33.5 30 35 34 32 37 L 13 37 C 10 34 11.5 30 11.5 30 z" />
          </g>
        </svg>
      );
    case 'b':
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M9 36h27v-3H9v3zm3-3h21v-4H12v4zm2.5-4c0 0-2.5-4 1-8 3.5-4 7-8 7-8s3.5 4 7 8c3.5 4 1 8 1 8H14.5z" />
            <circle cx="22.5" cy="10.5" r="2.25" />
            <path d="M22.5 12.5v12M16.5 18.5h12" />
          </g>
        </svg>
      );
    case 'q':
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M9 39h27v-3H9v3zm3-3h21v-4H12v4zm2.25-4H30.75l1.25-16.5L25.5 28.5L22.5 13.5L19.5 28.5L13 15.5L14.25 32z" />
            <circle cx="13" cy="15.5" r="1.5" />
            <circle cx="19.5" cy="28.5" r="1" />
            <circle cx="22.5" cy="13.5" r="1.5" />
            <circle cx="25.5" cy="28.5" r="1" />
            <circle cx="32" cy="15.5" r="1.5" />
          </g>
        </svg>
      );
    case 'k':
      return (
        <svg viewBox="0 0 45 45" className={className} xmlns="http://www.w3.org/2000/svg">
          <g fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
            <path d="M8.5 39h28v-3H8.5v3zm3-3h22v-4H11.5v4zm2.25-4h17.5c0 0 2.25-5.5-1-10-3.25-4.5-6.5-6.5-6.5-6.5s-3.25 2-6.5 6.5c-3.25 4.5-1 10-1 10z" />
            <path d="M11.5 30c2.5 0 5-1 7.5-1s5 1 7.5 1 5-1 7.5-1 5 1 7.5 1" />
            <path d="M22.5 6v6M19.5 9h6" strokeWidth="1.5" />
          </g>
        </svg>
      );
    default:
      return null;
  }
};

// ==========================================
// 2. AUDIO SYNTHESIZER
// ==========================================
type SoundType = 'move' | 'capture' | 'check' | 'gameover';

const playChessSound = (type: SoundType, muted: boolean) => {
  if (muted || typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'move') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'capture') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.15);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'check') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(330, now + 0.08);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'gameover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(261.63, now); // C4
      osc.frequency.setValueAtTime(329.63, now + 0.12); // E4
      osc.frequency.setValueAtTime(392.00, now + 0.24); // G4
      osc.frequency.setValueAtTime(523.25, now + 0.36); // C5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
      osc.start(now);
      osc.stop(now + 0.7);
    }
  } catch (e) {
    console.warn("Web Audio not supported or blocked", e);
  }
};

// ==========================================
// 3. AI BOT ENGINE
// ==========================================
const getBaseValue = (type: string): number => {
  switch (type) {
    case 'p': return 100;
    case 'n': return 320;
    case 'b': return 330;
    case 'r': return 500;
    case 'q': return 900;
    case 'k': return 20000;
    default: return 0;
  }
};

const getPositionalBonus = (type: string, color: 'w' | 'b', row: number, col: number): number => {
  let score = 0;
  
  // Center coordinates (rows 3-4, cols 3-4)
  if ((row === 3 || row === 4) && (col === 3 || col === 4)) {
    if (type === 'n' || type === 'b' || type === 'p' || type === 'q') score += 25;
  }
  // Outer center coordinates (rows 2-5, cols 2-5)
  else if ((row >= 2 && row <= 5) && (col >= 2 && col <= 5)) {
    if (type === 'n' || type === 'b' || type === 'p' || type === 'q') score += 10;
  }

  // Pawns: prefer advancing
  if (type === 'p') {
    const rank = color === 'w' ? (7 - row) : row;
    score += rank * 10;
  }

  // Knights: avoid corner files
  if (type === 'n') {
    if (col === 0 || col === 7 || row === 0 || row === 7) score -= 15;
  }

  // King safety: early game corner ranks
  if (type === 'k') {
    const isBackRank = color === 'w' ? (row === 7) : (row === 0);
    const isCorner = col <= 2 || col >= 5;
    if (isBackRank && isCorner) {
      score += 15;
    } else if (!isBackRank) {
      score -= 20; // exposed king
    }
  }

  return score;
};

const evaluateBoardState = (board: any[][]): number => {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece) {
        const value = getBaseValue(piece.type) + getPositionalBonus(piece.type, piece.color, r, c);
        if (piece.color === 'w') {
          score += value;
        } else {
          score -= value;
        }
      }
    }
  }
  return score;
};

// Minimax with Alpha-Beta Pruning
const minimax = (
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number => {
  if (depth === 0 || chess.isGameOver()) {
    return evaluateBoardState(chess.board());
  }

  const moves = chess.moves({ verbose: true });
  
  // Sorting moves for faster alpha-beta cuts (captures first)
  moves.sort((a, b) => {
    const scoreA = a.captured ? getBaseValue(a.captured) : 0;
    const scoreB = b.captured ? getBaseValue(b.captured) : 0;
    return scoreB - scoreA;
  });

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of moves) {
      chess.move({ from: move.from, to: move.to, promotion: 'q' });
      const evaluation = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      chess.move({ from: move.from, to: move.to, promotion: 'q' });
      const evaluation = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

const getBestBotMove = (chess: Chess, difficulty: string, botColor: 'w' | 'b'): any => {
  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  // Easy: Random moves (with occasional capture logic)
  if (difficulty === 'easy') {
    const captures = moves.filter(m => m.captured);
    if (captures.length > 0 && Math.random() < 0.6) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Medium: Depth 2 minimax
  // Hard: Depth 3 minimax
  const depth = difficulty === 'medium' ? 2 : 3;

  // Shuffle moves first to make the bot dynamic in identical paths
  moves.sort(() => Math.random() - 0.5);

  let bestMove = moves[0];
  let bestVal = botColor === 'w' ? -Infinity : Infinity;

  for (const move of moves) {
    // Standardize promotion to Queen for evaluation
    chess.move({ from: move.from, to: move.to, promotion: 'q' });
    const val = minimax(chess, depth - 1, -Infinity, Infinity, botColor === 'w' ? false : true);
    chess.undo();

    if (botColor === 'w') {
      if (val > bestVal) {
        bestVal = val;
        bestMove = move;
      }
    } else {
      if (val < bestVal) {
        bestVal = val;
        bestMove = move;
      }
    }
  }

  return bestMove;
};

// ==========================================
// 4. MAIN PAGE COMPONENT
// ==========================================
export default function ChessGame() {
  const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  
  // State variables
  const [game, setGame] = useState(() => new Chess());
  const [board, setBoard] = useState(() => game.board());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<string[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [muted, setMuted] = useState(false);
  const [boardFlipped, setBoardFlipped] = useState(false);
  const [gameMode, setGameMode] = useState<'pvp' | 'bot'>('bot');
  const [botDifficulty, setBotDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [playerColor, setPlayerColor] = useState<'w' | 'b'>('w');
  const [botIsThinking, setBotIsThinking] = useState(false);
  
  // Game FEN History for undoing
  const [history, setHistory] = useState<string[]>([initialFen]);
  const [moveLog, setMoveLog] = useState<string[]>([]);

  // Promotion state
  const [promotionPending, setPromotionPending] = useState<{ from: string; to: string } | null>(null);

  // Score stats
  const [score, setScore] = useState({ wWins: 0, bWins: 0, draws: 0 });

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Current turn helper
  const turn = game.turn(); // 'w' | 'b'
  const isGameOver = game.isGameOver();

  // Advantage and Captured Pieces calculation
  const capturedPieces = useMemo(() => {
    const initialCount = {
      w: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 },
      b: { p: 8, n: 2, b: 2, r: 2, q: 1, k: 1 }
    };
    
    const currentCount = {
      w: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 },
      b: { p: 0, n: 0, b: 0, r: 0, q: 0, k: 0 }
    };

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece) {
          currentCount[piece.color as 'w' | 'b'][piece.type as 'p' | 'n' | 'b' | 'r' | 'q' | 'k']++;
        }
      }
    }

    const captured = {
      w: [] as string[], // White pieces captured by Black
      b: [] as string[]  // Black pieces captured by White
    };

    for (const color of ['w', 'b'] as const) {
      for (const type of ['p', 'n', 'b', 'r', 'q'] as const) {
        const diff = initialCount[color][type] - currentCount[color][type];
        for (let i = 0; i < diff; i++) {
          captured[color].push(type);
        }
      }
    }

    return captured;
  }, [board]);

  const materialAdvantage = useMemo(() => {
    const valueMap: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    // White's advantage = sum(captured Black pieces) - sum(captured White pieces)
    let wScore = capturedPieces.b.reduce((sum, type) => sum + (valueMap[type] || 0), 0);
    let bScore = capturedPieces.w.reduce((sum, type) => sum + (valueMap[type] || 0), 0);

    if (wScore === bScore) return null;
    return wScore > bScore ? { color: 'w', val: wScore - bScore } : { color: 'b', val: bScore - wScore };
  }, [capturedPieces]);

  // Synchronise state board representation
  const syncBoard = (chessObj: Chess) => {
    setBoard(chessObj.board());
  };

  // Find Check status king coordinate
  const checkKingSquare = useMemo(() => {
    if (!game.inCheck()) return null;
    const currentTurn = game.turn();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === 'k' && piece.color === currentTurn) {
          return files[c] + ranks[r];
        }
      }
    }
    return null;
  }, [board, game]);

  // Sound triggering on checkmate, check, capture, move
  const triggerAudioEffect = (moveResult: any, isCheck: boolean, isOver: boolean) => {
    if (isOver) {
      playChessSound('gameover', muted);
    } else if (isCheck) {
      playChessSound('check', muted);
    } else if (moveResult.captured) {
      playChessSound('capture', muted);
    } else {
      playChessSound('move', muted);
    }
  };

  // Bot execution loop
  useEffect(() => {
    if (gameMode !== 'bot' || isGameOver || botIsThinking) return;

    const botColor = playerColor === 'w' ? 'b' : 'w';
    if (turn !== botColor) return;

    setBotIsThinking(true);

    const timer = setTimeout(() => {
      try {
        const botMove = getBestBotMove(game, botDifficulty, botColor);
        if (botMove) {
          const moveResult = game.move({ from: botMove.from, to: botMove.to, promotion: 'q' });
          const nextFen = game.fen();
          
          setHistory(prev => [nextFen, ...prev]);
          setMoveLog(prev => [...prev, moveResult.san]);
          setLastMove({ from: botMove.from, to: botMove.to });
          syncBoard(game);
          
          const isCheck = game.inCheck();
          const isOver = game.isGameOver();
          triggerAudioEffect(moveResult, isCheck, isOver);
          
          if (isOver) {
            handleGameOverScore();
          }
        }
      } catch (err) {
        console.error("Bot Move failed", err);
      } finally {
        setBotIsThinking(false);
      }
    }, 450); // slight delay for visual balance

    return () => clearTimeout(timer);
  }, [turn, gameMode, playerColor, botDifficulty, isGameOver]);

  const handleGameOverScore = () => {
    if (game.isCheckmate()) {
      if (game.turn() === 'w') {
        setScore(s => ({ ...s, bWins: s.bWins + 1 }));
      } else {
        setScore(s => ({ ...s, wWins: s.wWins + 1 }));
      }
    } else if (game.isDraw()) {
      setScore(s => ({ ...s, draws: s.draws + 1 }));
    }
  };

  // Handle Board Cell Clicks
  const handleSquareClick = (square: string) => {
    if (isGameOver || botIsThinking) return;

    // In Bot mode, prevent making moves when it's the Bot's turn
    if (gameMode === 'bot' && turn !== playerColor) return;

    const colIdx = files.indexOf(square[0]);
    const rowIdx = ranks.indexOf(square[1]);
    const clickedPiece = board[rowIdx][colIdx];

    // If a piece from the same player is clicked, select it
    if (clickedPiece && clickedPiece.color === turn) {
      setSelectedSquare(square);
      // Fetch legal moves for selected piece
      const moves = game.moves({ square: square as any, verbose: true }) as any[];
      setPossibleMoves(moves.map(m => m.to));
      return;
    }

    // If a square is in possible moves list, make the move
    if (possibleMoves.includes(square) && selectedSquare) {
      // Check for pawn promotion (White pawn reaching rank 8, Black pawn reaching rank 1)
      const fromPiece = board[ranks.indexOf(selectedSquare[1])][files.indexOf(selectedSquare[0])];
      const isPromotion = fromPiece?.type === 'p' && (square[1] === '8' || square[1] === '1');

      if (isPromotion) {
        setPromotionPending({ from: selectedSquare, to: square });
        return;
      }

      executePlayerMove(selectedSquare, square);
    }

    // Clear selection
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  const executePlayerMove = (from: string, to: string, promotionChar = 'q') => {
    try {
      const moveResult = game.move({ from, to, promotion: promotionChar });
      const nextFen = game.fen();

      setHistory(prev => [nextFen, ...prev]);
      setMoveLog(prev => [...prev, moveResult.san]);
      setLastMove({ from, to });
      syncBoard(game);

      const isCheck = game.inCheck();
      const isOver = game.isGameOver();
      triggerAudioEffect(moveResult, isCheck, isOver);

      if (isOver) {
        handleGameOverScore();
      }
    } catch (err) {
      console.warn("Invalid move", err);
    }
    
    setSelectedSquare(null);
    setPossibleMoves([]);
    setPromotionPending(null);
  };

  // Promotion Selection Handler
  const handlePromotionSelect = (pieceChar: string) => {
    if (!promotionPending) return;
    executePlayerMove(promotionPending.from, promotionPending.to, pieceChar);
  };

  // Reset Game Round
  const handleRestart = () => {
    const newG = new Chess();
    setGame(newG);
    setBoard(newG.board());
    setHistory([initialFen]);
    setMoveLog([]);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
    setPromotionPending(null);
    playChessSound('move', muted);
  };

  // Undo Mechanism
  const handleUndo = () => {
    if (history.length <= 1 || botIsThinking) return;

    // In Bot mode, we want to undo 2 moves (both Bot move and Player move)
    let undoCount = gameMode === 'bot' ? 2 : 1;
    if (gameMode === 'bot' && history.length === 2) {
      // If only 1 move has been played, just undo 1
      undoCount = 1;
    }

    const newHistory = history.slice(undoCount);
    const targetFen = newHistory[0] || initialFen;

    const restoredGame = new Chess(targetFen);
    setGame(restoredGame);
    setBoard(restoredGame.board());
    setHistory(newHistory);
    setMoveLog(prev => prev.slice(0, prev.length - undoCount));
    
    // Clear highlights
    setSelectedSquare(null);
    setPossibleMoves([]);
    setLastMove(null);
    setPromotionPending(null);
    playChessSound('move', muted);
  };

  // Dynamic Flipped Board State Sync (Optional helper)
  const flipBoardVisual = () => {
    setBoardFlipped(!boardFlipped);
  };

  // Switch Colors in Bot Mode
  const handleColorToggle = () => {
    const newColor = playerColor === 'w' ? 'b' : 'w';
    setPlayerColor(newColor);
    setBoardFlipped(newColor === 'b');
    handleRestart();
  };

  // Switch PvP and Bot modes
  const handleModeToggle = (mode: 'pvp' | 'bot') => {
    setGameMode(mode);
    handleRestart();
  };

  // Display status Banner
  const statusMessage = useMemo(() => {
    if (game.isCheckmate()) {
      return `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} Wins 🏆`;
    }
    if (game.isDraw()) {
      if (game.isStalemate()) return 'Draw! Stalemate 🤝';
      if (game.isThreefoldRepetition()) return 'Draw! Threefold Repetition 🤝';
      if (game.isInsufficientMaterial()) return 'Draw! Insufficient Material 🤝';
      return 'Draw game! 🤝';
    }
    if (game.inCheck()) {
      return `${game.turn() === 'w' ? 'White' : 'Black'} King is in Check! ⚠️`;
    }
    
    if (gameMode === 'bot') {
      if (turn === playerColor) {
        return "Your turn 🟢";
      } else {
        return "Bot is thinking... 🤖";
      }
    }
    return `${turn === 'w' ? "White's" : "Black's"} turn`;
  }, [turn, gameMode, playerColor, isGameOver, checkKingSquare]);

  // Coordinates arrays for rendering
  const displayRows = boardFlipped ? [...ranks].reverse() : ranks;
  const displayCols = boardFlipped ? [...files].reverse() : files;

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 p-4 md:p-6 bg-radial from-slate-50 to-slate-200 dark:from-slate-900 dark:to-slate-950 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-300 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <a 
              href="/games" 
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
              aria-label="Back to Games"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Premium 2D Chess
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Play vs Bot or local Pass &amp; Play
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMuted(!muted)}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
              title={muted ? "Unmute sounds" : "Mute sounds"}
            >
              {muted ? <VolumeX className="w-5 h-5 text-rose-500" /> : <Volume2 className="w-5 h-5 text-indigo-500" />}
            </button>

            <button
              onClick={flipBoardVisual}
              className="px-3 py-2 text-sm font-medium rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-1"
            >
              Flip Board 🔄
            </button>
          </div>
        </header>

        {/* Toolbar & Configurator */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Game Mode */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Game Mode</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleModeToggle('bot')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                  gameMode === 'bot'
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Bot className="w-4 h-4" />
                Vs Bot
              </button>
              <button
                onClick={() => handleModeToggle('pvp')}
                className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-semibold transition-all ${
                  gameMode === 'pvp'
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <User className="w-4 h-4" />
                Pass &amp; Play
              </button>
            </div>
          </div>

          {/* AI Settings */}
          {gameMode === 'bot' && (
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">AI Settings</label>
              <div className="flex gap-2">
                <div className="flex-1 flex flex-col gap-1">
                  <select
                    value={botDifficulty}
                    onChange={(e) => setBotDifficulty(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-semibold"
                  >
                    <option value="easy">Easy Bot 🪵</option>
                    <option value="medium">Medium Bot ⚡</option>
                    <option value="hard">Hard Bot 🧠</option>
                  </select>
                </div>
                <button
                  onClick={handleColorToggle}
                  className="px-3 h-10 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-semibold flex items-center gap-1.5 whitespace-nowrap hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  title="Toggle side"
                >
                  Side: {playerColor === 'w' ? 'White ⚪' : 'Black ⚫'}
                </button>
              </div>
            </div>
          )}

          {gameMode === 'pvp' && (
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm flex items-center justify-center">
              <div className="text-center text-sm text-slate-500 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" />
                <span>Take turns moving pieces on the same screen.</span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm flex items-center justify-between md:justify-end gap-3">
            <button
              onClick={handleUndo}
              disabled={history.length <= 1 || botIsThinking}
              className="flex-1 md:flex-none h-10 px-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Undo2 className="w-4 h-4" />
              Undo
            </button>
            <button
              onClick={handleRestart}
              className="flex-1 md:flex-none h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>

        </div>

        {/* Main Chess Arena */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left / Center Side: Chessboard & Captured Pieces */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Top Captured Bar (Black's captured White pieces) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-slate-100 flex items-center justify-center font-bold shadow-sm">
                  ⚫
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {gameMode === 'bot' ? (playerColor === 'b' ? 'User' : `AI (${botDifficulty})`) : 'Black'}
                  </h3>
                  <div className="flex flex-wrap gap-0.5 mt-0.5 min-h-[1.25rem]">
                    {capturedPieces.w.map((type, idx) => (
                      <span key={idx} className="text-lg opacity-85 select-none" title={`Captured ${type}`}>
                        {type === 'p' && '♙'}
                        {type === 'n' && '♘'}
                        {type === 'b' && '♗'}
                        {type === 'r' && '♖'}
                        {type === 'q' && '♕'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {materialAdvantage && materialAdvantage.color === 'b' && (
                <span className="text-xs font-extrabold bg-slate-900/10 dark:bg-white/10 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                  +{materialAdvantage.val}
                </span>
              )}
            </div>

            {/* Chessboard Box */}
            <div className="relative aspect-square w-full max-w-[600px] mx-auto rounded-3xl bg-slate-200 dark:bg-slate-950 p-2.5 shadow-2xl border border-slate-300 dark:border-slate-900">
              <div className="w-full h-full grid grid-rows-8 grid-cols-8 rounded-2xl overflow-hidden shadow-inner border border-slate-300/40 dark:border-slate-800/40">
                
                {displayRows.map((rankName, rIdx) => {
                  const trueRow = ranks.indexOf(rankName);

                  return displayCols.map((fileName, cIdx) => {
                    const trueCol = files.indexOf(fileName);
                    const squareName = fileName + rankName;
                    const piece = board[trueRow][trueCol];
                    
                    // Style attributes
                    const isDark = (trueRow + trueCol) % 2 === 1;
                    const isSelected = selectedSquare === squareName;
                    const isPossibleTarget = possibleMoves.includes(squareName);
                    const hasPiece = !!piece;

                    const isLastMoveSrc = lastMove?.from === squareName;
                    const isLastMoveDst = lastMove?.to === squareName;
                    const isKingChecked = checkKingSquare === squareName;

                    return (
                      <div
                        key={squareName}
                        onClick={() => handleSquareClick(squareName)}
                        className={`relative aspect-square flex items-center justify-center select-none cursor-pointer transition-all duration-200 ${
                          isDark 
                            ? 'bg-[#769656] dark:bg-[#4b6a2e]' 
                            : 'bg-[#eeeed2] dark:bg-[#e2e8f0]'
                        } ${
                          isKingChecked
                            ? 'bg-rose-500/50 dark:bg-rose-500/40 shadow-[inset_0_0_15px_rgba(239,68,68,0.7)] animate-pulse'
                            : isSelected
                            ? 'bg-indigo-500/40 dark:bg-indigo-500/35 ring-4 ring-indigo-500/60 ring-inset'
                            : isLastMoveSrc || isLastMoveDst
                            ? 'bg-yellow-200/45 dark:bg-yellow-500/20'
                            : ''
                        }`}
                      >
                        {/* Piece Icon */}
                        {piece && (
                          <div className={`w-[82%] h-[82%] relative z-10 filter drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] transition-transform duration-250 ${
                            botIsThinking && piece.color === (playerColor === 'w' ? 'b' : 'w') ? 'animate-pulse' : ''
                          }`}>
                            <ChessPiece type={piece.type} color={piece.color} className="w-full h-full" />
                          </div>
                        )}

                        {/* Move Helper Dot / Ring */}
                        {isPossibleTarget && (
                          <div className="absolute inset-0 flex items-center justify-center z-20">
                            {hasPiece ? (
                              // Capture Highlight Ring
                              <div className="w-[84%] h-[84%] rounded-full border-[5px] border-black/15 dark:border-white/25" />
                            ) : (
                              // Normal Legal Dot
                              <div className="w-4 h-4 rounded-full bg-black/15 dark:bg-white/25 shadow-sm" />
                            )}
                          </div>
                        )}

                        {/* Corner Coordinates Labels */}
                        {((!boardFlipped && trueCol === 0) || (boardFlipped && trueCol === 7)) && (
                          <span className={`absolute top-1.5 left-1.5 text-[9px] font-extrabold ${
                            isDark ? 'text-[#eeeed2] dark:text-[#e2e8f0]' : 'text-[#769656] dark:text-[#4b6a2e]'
                          } opacity-60`}>
                            {rankName}
                          </span>
                        )}
                        {((!boardFlipped && trueRow === 7) || (boardFlipped && trueRow === 0)) && (
                          <span className={`absolute bottom-1 right-1.5 text-[9px] font-extrabold ${
                            isDark ? 'text-[#eeeed2] dark:text-[#e2e8f0]' : 'text-[#769656] dark:text-[#4b6a2e]'
                          } opacity-60`}>
                            {fileName}
                          </span>
                        )}
                      </div>
                    );
                  });
                })}

                {/* Promotion Modal Overlay */}
                {promotionPending && (
                  <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 rounded-2xl">
                    <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 p-5 rounded-2xl shadow-2xl w-full max-w-xs text-center flex flex-col gap-4 animate-scaleUp">
                      <h3 className="font-extrabold text-md text-slate-800 dark:text-slate-200">
                        Choose Promotion Piece 👑
                      </h3>
                      <div className="grid grid-cols-4 gap-2.5">
                        {[
                          { char: 'q', label: 'Queen' },
                          { char: 'r', label: 'Rook' },
                          { char: 'b', label: 'Bishop' },
                          { char: 'n', label: 'Knight' }
                        ].map((choice) => (
                          <button
                            key={choice.char}
                            onClick={() => handlePromotionSelect(choice.char)}
                            className="p-2 aspect-square rounded-xl bg-slate-100 hover:bg-indigo-50 border border-slate-200 dark:bg-slate-800 dark:hover:bg-indigo-950/20 dark:border-slate-700 flex flex-col items-center justify-center hover:scale-105 transition-all"
                          >
                            <div className="w-10 h-10">
                              <ChessPiece type={choice.char} color={turn} className="w-full h-full" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 mt-1">{choice.label}</span>
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => setPromotionPending(null)}
                        className="text-xs text-rose-500 font-semibold hover:underline mt-1"
                      >
                        Cancel Move
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Bottom Captured Bar (White's captured Black pieces) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-900 flex items-center justify-center font-bold shadow-sm">
                  ⚪
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {gameMode === 'bot' ? (playerColor === 'w' ? 'User' : `AI (${botDifficulty})`) : 'White'}
                  </h3>
                  <div className="flex flex-wrap gap-0.5 mt-0.5 min-h-[1.25rem]">
                    {capturedPieces.b.map((type, idx) => (
                      <span key={idx} className="text-lg opacity-85 select-none" title={`Captured ${type}`}>
                        {type === 'p' && '♟'}
                        {type === 'n' && '♞'}
                        {type === 'b' && '♝'}
                        {type === 'r' && '♜'}
                        {type === 'q' && '♛'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {materialAdvantage && materialAdvantage.color === 'w' && (
                <span className="text-xs font-extrabold bg-slate-900/10 dark:bg-white/10 px-2 py-0.5 rounded-md text-slate-700 dark:text-slate-300">
                  +{materialAdvantage.val}
                </span>
              )}
            </div>

          </div>

          {/* Right Side: Game Logs & Information */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            
            {/* Status Panel */}
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                Status
              </h2>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                {statusMessage}
              </div>
              
              {/* Turn indicator ribbon */}
              {!isGameOver && (
                <div className="mt-3 flex items-center gap-2 text-sm bg-slate-100 dark:bg-slate-800/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800">
                  <span className={`w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700 ${
                    turn === 'w' ? 'bg-white shadow-sm' : 'bg-slate-900'
                  }`} />
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {turn === 'w' ? 'White' : 'Black'} to move
                  </span>
                </div>
              )}
            </div>

            {/* Score Stats */}
            <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-indigo-500" />
                Scoreboard
              </h2>
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/40">
                  <div className="text-[10px] font-bold text-slate-500">White Wins</div>
                  <div className="text-xl font-black text-indigo-600 dark:text-indigo-400">{score.wWins}</div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/40">
                  <div className="text-[10px] font-bold text-slate-500">Draws</div>
                  <div className="text-xl font-black">{score.draws}</div>
                </div>
                <div className="p-2 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/40">
                  <div className="text-[10px] font-bold text-slate-500">Black Wins</div>
                  <div className="text-xl font-black text-rose-500">{score.bWins}</div>
                </div>
              </div>
            </div>

            {/* Move Log Panel */}
            <div className="flex-1 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm flex flex-col min-h-[220px]">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Move Log
              </h2>
              
              <div className="flex-1 overflow-y-auto max-h-[260px] pr-1.5 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {moveLog.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No moves recorded yet.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
                    {Array.from({ length: Math.ceil(moveLog.length / 2) }).map((_, stepIdx) => {
                      const whiteMove = moveLog[stepIdx * 2];
                      const blackMove = moveLog[stepIdx * 2 + 1];

                      return (
                        <React.Fragment key={stepIdx}>
                          <div className="flex items-center gap-2 font-medium">
                            <span className="text-xs text-slate-400 w-4 select-none">
                              {stepIdx + 1}.
                            </span>
                            <span className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded-md font-mono">
                              {whiteMove}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 font-medium">
                            {blackMove && (
                              <span className="text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded-md font-mono">
                                {blackMove}
                              </span>
                            )}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Instructions / Info */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
                <span>Minimax engine performs with depth 3 and Alpha-Beta pruning on Hard difficulty.</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
