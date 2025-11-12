"use client"

import { useEffect, useState } from "react";

const CARD_IMAGES = [
  "🐶", "🐱", "🐭",
  "🐹", "🐰", "🦊",
  "🐻", "🐼", "🦤",
];

export default function MemoryGame() {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [disabled, setDisabled] = useState(false);

    const shuffleCards = () => {
        const shuffled = [...CARD_IMAGES, ...CARD_IMAGES]
        .sort(() => Math.random() - 0.5)
        .map((emoji, i) => ({ id: i, emoji }));

        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setDisabled(false);
    };

    useEffect(() => {
        shuffleCards();
    }, []);

    const handleFlip = (index) => {
        if (disabled) return;
        if (flipped.length === 0) {
            setFlipped([index]);
        } else if (flipped.length === 1) {
            setFlipped([flipped[0], index]);
            setDisabled(true);
            setMoves((m) => m + 1);
        }
    };

    useEffect(() => {
        if (flipped.length === 2) {
            const [first, second] = flipped;
            if (cards[first].emoji === cards[second].emoji) {
                setMatched((prev) => [...prev, cards[first].emoji]);
            };

            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 800);
        };
    }, [flipped, cards]);

    const isFlipped = (index) =>
        flipped.includes(index) || matched.includes(cards[index].emoji);

    const isGameComplete = matched.length === CARD_IMAGES.length;

    return (
        <div style={styles.container}>
            <h1 className="text-center text-[20px] font-semibold">
                <a href='/games' className='underline'>🏠︎</a>&nbsp;&nbsp;🧩 Memory Card Flip Game
            </h1>

            <p className="text-center">
                Moves: {moves} | Matches: {matched.length}/{CARD_IMAGES.length}
            </p>

            <div style={styles.grid}>
                {cards.map((card, index) => (
                    <div
                        key={card.id}
                        onClick={() => !isFlipped(index) && handleFlip(index)}
                        style={{
                            ...styles.card,
                            background: isFlipped(index) ? "#fff" : "#0070f3",
                            cursor: isFlipped(index) ? "default" : "pointer",
                            color: isFlipped(index) ? "#000" : "transparent",
                        }}
                    >
                        {card.emoji}
                    </div>
                ))}
            </div>

            {isGameComplete && (
                <div style={styles.overlay}>
                    <h2>🎉 You Won in {moves} Moves!</h2>

                    <button onClick={shuffleCards} style={styles.btn}>
                        Play Again
                    </button>
                </div>
            )}

            <button onClick={shuffleCards} style={styles.restartBtn}>
                🔄 Restart
            </button>
        </div>
    );
};

const styles = {
  container: {
    fontFamily: "Inter, sans-serif",
    padding: "20px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 100px)",
    gap: "15px",
    justifyContent: "center",
    marginTop: "30px",
  },
  card: {
    width: "100px",
    height: "100px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    fontSize: "42px",
    transition: "all 0.3s ease",
    border: "2px solid #C0C0C0",
    borderBottom: '5px solid #C0C0C0', 
    boxShadow: "0 2px 6px rgba(192, 192, 192, 0.25)",
  },
  overlay: {
    marginTop: "20px",
    background: "transparent",
    borderRadius: "12px",
    padding: "15px",
    display: "inline-block",
    border: "2px solid",
    borderBottom: '5px solid'

  },
  btn: {
    marginTop: "10px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },
  restartBtn: {
    marginTop: "25px",
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    border: "2px solid",
    borderBottom: "4px solid"
  },
};